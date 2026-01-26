// KYWARD BITCOIN SERVICE
// Handles XPUB address derivation and payment verification

const MEMPOOL_API = 'https://mempool.space/api';

// In-memory address index counter (in production, persist this to database)
let addressIndex = parseInt(process.env.ADDRESS_START_INDEX || '0');

// Track the last generated address to check if it's been used
let lastGeneratedAddress = null;
let lastGeneratedIndex = null;

// Address assignments per user/email (email -> { address, index, assignedAt, expectedSats })
// Addresses are reused within 30 min window if unpaid
const addressAssignments = new Map();
const ADDRESS_ASSIGNMENT_DURATION = 30 * 60 * 1000; // 30 minutes in ms

// Cache for BTC price (expires after 2 minutes)
let priceCache = {
  price: null,
  timestamp: null,
  expiresIn: 120 // 2 minutes in seconds
};

/**
 * Get current BTC price in USD from mempool.space
 * Caches for 2 minutes
 */
async function getBtcPrice() {
  const now = Date.now();

  // Return cached price if still valid
  if (priceCache.price && priceCache.timestamp) {
    const age = (now - priceCache.timestamp) / 1000;
    if (age < priceCache.expiresIn) {
      return {
        price: priceCache.price,
        cached: true,
        expiresIn: Math.ceil(priceCache.expiresIn - age)
      };
    }
  }

  try {
    const response = await fetch(`${MEMPOOL_API}/v1/prices`);
    const data = await response.json();

    // Update cache
    priceCache.price = data.USD;
    priceCache.timestamp = now;

    console.log(`BTC Price updated: $${data.USD}`);

    return {
      price: data.USD,
      cached: false,
      expiresIn: priceCache.expiresIn
    };
  } catch (error) {
    console.error('Get BTC price error:', error);
    // Return fallback price if API fails
    return {
      price: priceCache.price || 95000,
      cached: true,
      expiresIn: 60,
      error: 'Failed to fetch price'
    };
  }
}

/**
 * Convert USD to Sats based on current price
 */
async function usdToSats(usdAmount) {
  const priceData = await getBtcPrice();
  const btcAmount = usdAmount / priceData.price;
  const sats = Math.ceil(btcAmount * 100000000);

  return {
    sats,
    btcAmount,
    priceUsd: priceData.price,
    priceExpiresIn: priceData.expiresIn
  };
}

/**
 * Derive address from XPUB using bitcoinjs-lib
 */
async function deriveFromXpub(xpub, index) {
  try {
    const bitcoin = require('bitcoinjs-lib');
    const ecc = require('tiny-secp256k1');
    const { BIP32Factory } = require('bip32');

    const bip32 = BIP32Factory(ecc);
    let network = bitcoin.networks.bitcoin;

    // Handle zpub (BIP84 native segwit)
    let node;
    if (xpub.startsWith('zpub')) {
      // Convert zpub to standard format for parsing
      // zpub uses version bytes 0x04b24746, we need to convert to xpub format
      const bs58check = require('bs58check');
      const data = bs58check.decode(xpub);

      // Replace zpub version (04b24746) with xpub version (0488b21e)
      data[0] = 0x04;
      data[1] = 0x88;
      data[2] = 0xb2;
      data[3] = 0x1e;

      const convertedXpub = bs58check.encode(data);
      node = bip32.fromBase58(convertedXpub, network);
    } else {
      node = bip32.fromBase58(xpub, network);
    }

    // Derive child: m/0/index (receive addresses)
    const child = node.derive(0).derive(index);

    // Generate native segwit address (bc1...)
    const { address } = bitcoin.payments.p2wpkh({
      pubkey: child.publicKey,
      network
    });

    console.log(`Derived address #${index}: ${address}`);
    return address;

  } catch (error) {
    console.error('XPUB derivation error:', error);
    throw error;
  }
}

/**
 * Check if an address has received any satoshis (0 = unused)
 */
async function getAddressBalance(address) {
  try {
    const response = await fetch(`${MEMPOOL_API}/address/${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch address info');
    }
    const data = await response.json();
    // chain_stats.funded_txo_sum = total satoshis ever received
    return data.chain_stats?.funded_txo_sum || 0;
  } catch (error) {
    console.error('Get address balance error:', error);
    return 0; // Assume unused if we can't check
  }
}

/**
 * Generate a payment address for a user
 * Implements address reuse logic:
 * - Same user gets same address within 30 min if unpaid
 * - Only advance to next address when payment is received
 * - Reuse unused addresses (0 satoshis received)
 */
async function generatePaymentAddress(paymentId, email = null) {
  const xpub = process.env.XPUB;

  if (!xpub) {
    console.error('XPUB not configured');
    return { success: false, error: 'XPUB not configured' };
  }

  try {
    const now = Date.now();

    // Check if this user already has an active address assignment
    if (email) {
      const existingAssignment = addressAssignments.get(email);

      if (existingAssignment) {
        const timeSinceAssignment = now - existingAssignment.assignedAt;

        // If within 30 min window, reuse the same address
        if (timeSinceAssignment < ADDRESS_ASSIGNMENT_DURATION) {
          console.log(`Reusing existing address for ${email}: ${existingAssignment.address} (assigned ${Math.round(timeSinceAssignment / 60000)} min ago)`);

          // Update the assignment timestamp to extend the window
          existingAssignment.assignedAt = now;
          addressAssignments.set(email, existingAssignment);

          return {
            success: true,
            address: existingAssignment.address,
            index: existingAssignment.index,
            path: `m/84'/0'/0'/0/${existingAssignment.index}`,
            reused: true
          };
        } else {
          // Assignment expired, check if address was used
          const balance = await getAddressBalance(existingAssignment.address);

          if (balance === 0) {
            // Address still unused after 30 mins - reuse it
            console.log(`Address ${existingAssignment.address} still unused after 30 min, reusing for ${email}`);
            existingAssignment.assignedAt = now;
            addressAssignments.set(email, existingAssignment);

            return {
              success: true,
              address: existingAssignment.address,
              index: existingAssignment.index,
              path: `m/84'/0'/0'/0/${existingAssignment.index}`,
              reused: true
            };
          } else {
            // Address was used - remove assignment and generate new one
            console.log(`Address ${existingAssignment.address} received payment (${balance} sats), advancing to next`);
            addressAssignments.delete(email);
          }
        }
      }
    }

    // Check if last generated address is still unused (0 satoshis)
    // If unused, reuse it instead of advancing
    if (lastGeneratedAddress && lastGeneratedIndex !== null) {
      const balance = await getAddressBalance(lastGeneratedAddress);

      if (balance === 0) {
        console.log(`Last address #${lastGeneratedIndex} (${lastGeneratedAddress}) has 0 sats, reusing`);

        // Save assignment for this user
        if (email) {
          addressAssignments.set(email, {
            address: lastGeneratedAddress,
            index: lastGeneratedIndex,
            assignedAt: now
          });
        }

        return {
          success: true,
          address: lastGeneratedAddress,
          index: lastGeneratedIndex,
          path: `m/84'/0'/0'/0/${lastGeneratedIndex}`,
          reused: true
        };
      } else {
        // Last address received payment - advance to next
        console.log(`Last address #${lastGeneratedIndex} received payment (${balance} sats), advancing index`);
        addressIndex = lastGeneratedIndex + 1;
      }
    }

    // Generate new address at current index
    const currentIndex = addressIndex;
    const address = await deriveFromXpub(xpub, currentIndex);

    // Track this as the last generated address
    lastGeneratedAddress = address;
    lastGeneratedIndex = currentIndex;

    // Save assignment for this user
    if (email) {
      addressAssignments.set(email, {
        address,
        index: currentIndex,
        assignedAt: now
      });
    }

    return {
      success: true,
      address,
      index: currentIndex,
      path: `m/84'/0'/0'/0/${currentIndex}`,
      reused: false
    };

  } catch (error) {
    console.error('Generate address error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mark an address as used (when payment is confirmed)
 * This advances the index for the next address
 */
function markAddressUsed(address, email = null) {
  if (email) {
    const assignment = addressAssignments.get(email);
    if (assignment && assignment.address === address) {
      console.log(`Marking address ${address} as used for ${email}, removing assignment`);
      addressAssignments.delete(email);
    }
  }

  // If this was the last generated address, advance index
  if (lastGeneratedAddress === address && lastGeneratedIndex !== null) {
    console.log(`Address ${address} was used, advancing index from ${lastGeneratedIndex} to ${lastGeneratedIndex + 1}`);
    addressIndex = lastGeneratedIndex + 1;
    lastGeneratedAddress = null;
    lastGeneratedIndex = null;
  }
}

/**
 * Check if an address received the expected payment
 * With ±1% tolerance (both lower AND upper bounds)
 */
async function checkAddressPayment(address, expectedSats) {
  try {
    // Query mempool.space API for address transactions
    const response = await fetch(`${MEMPOOL_API}/address/${address}/txs`);

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const transactions = await response.json();

    // Check for incoming transactions
    for (const tx of transactions) {
      // Calculate amount received at this address
      let receivedSats = 0;

      for (const vout of tx.vout) {
        if (vout.scriptpubkey_address === address) {
          receivedSats += vout.value;
        }
      }

      // Calculate 1% tolerance bounds
      const tolerance = expectedSats * 0.01;
      const minAcceptable = expectedSats - tolerance;
      const maxAcceptable = expectedSats + tolerance;

      // Check if amount is within ±1% tolerance of expected
      if (receivedSats >= minAcceptable && receivedSats <= maxAcceptable) {
        return {
          paid: true,
          txid: tx.txid,
          receivedSats,
          expectedSats,
          withinTolerance: true,
          confirmations: tx.status.confirmed ? (tx.status.block_height ? 1 : 0) : 0,
          confirmedAt: tx.status.block_time ? new Date(tx.status.block_time * 1000).toISOString() : null
        };
      }

      // Log if payment was received but outside tolerance
      if (receivedSats > 0) {
        const percentDiff = ((receivedSats - expectedSats) / expectedSats * 100).toFixed(2);
        console.log(`Payment received but outside ±1% tolerance: got ${receivedSats} sats, expected ${expectedSats} sats (${percentDiff}% difference)`);

        return {
          paid: false,
          receivedSats,
          expectedSats,
          withinTolerance: false,
          percentDifference: parseFloat(percentDiff),
          message: `Payment of ${receivedSats} sats received but not within ±1% of expected ${expectedSats} sats`
        };
      }
    }

    // No payment found
    return { paid: false, receivedSats: 0 };

  } catch (error) {
    console.error('Check payment error:', error);
    return { paid: false, error: error.message };
  }
}

/**
 * Get address balance and transaction history
 */
async function getAddressInfo(address) {
  try {
    const response = await fetch(`${MEMPOOL_API}/address/${address}`);
    if (!response.ok) throw new Error('Failed to fetch address info');
    return await response.json();
  } catch (error) {
    console.error('Get address info error:', error);
    return null;
  }
}

/**
 * Clean up expired address assignments (run periodically)
 */
function cleanupExpiredAssignments() {
  const now = Date.now();
  let cleaned = 0;

  for (const [email, assignment] of addressAssignments.entries()) {
    if (now - assignment.assignedAt > ADDRESS_ASSIGNMENT_DURATION * 2) {
      // Only remove assignments that are way past expiry (2x duration)
      // This prevents removing assignments that might still be in use
      addressAssignments.delete(email);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} expired address assignments`);
  }

  return cleaned;
}

// Run cleanup every 10 minutes
setInterval(cleanupExpiredAssignments, 10 * 60 * 1000);

module.exports = {
  generatePaymentAddress,
  checkAddressPayment,
  getBtcPrice,
  usdToSats,
  getAddressInfo,
  markAddressUsed,
  getAddressBalance,
  cleanupExpiredAssignments
};
