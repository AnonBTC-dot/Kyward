// KYWARD BITCOIN SERVICE
// Handles XPUB address derivation and payment verification

const MEMPOOL_API = 'https://mempool.space/api';

// In-memory address index counter (in production, persist this to database)
let addressIndex = parseInt(process.env.ADDRESS_START_INDEX || '0');

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
 * Generate a payment address for a new order
 */
async function generatePaymentAddress(paymentId) {
  const xpub = process.env.XPUB;

  if (!xpub) {
    console.error('XPUB not configured');
    return { success: false, error: 'XPUB not configured' };
  }

  try {
    // Get next address index
    const currentIndex = addressIndex++;

    // Derive address from XPUB
    const address = await deriveFromXpub(xpub, currentIndex);

    return {
      success: true,
      address,
      index: currentIndex,
      path: `m/84'/0'/0'/0/${currentIndex}`
    };

  } catch (error) {
    console.error('Generate address error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if an address received the expected payment
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

      // Check if amount matches or exceeds expected (allow 1% tolerance for fee variations)
      const tolerance = expectedSats * 0.01;
      if (receivedSats >= expectedSats - tolerance) {
        return {
          paid: true,
          txid: tx.txid,
          receivedSats,
          confirmations: tx.status.confirmed ? (tx.status.block_height ? 1 : 0) : 0,
          confirmedAt: tx.status.block_time ? new Date(tx.status.block_time * 1000).toISOString() : null
        };
      }
    }

    // No matching payment found
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

module.exports = {
  generatePaymentAddress,
  checkAddressPayment,
  getBtcPrice,
  usdToSats,
  getAddressInfo
};
