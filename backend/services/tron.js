// KYWARD TRON USDT SERVICE
// Handles USDT TRC20 payments via TronGrid API
// No third-party payment processor required - direct blockchain monitoring

// USDT TRC20 contract address on Tron mainnet
const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

// Configuration
const TRONGRID_API_URL = 'https://api.trongrid.io';
const TRON_USDT_ADDRESS = process.env.TRON_USDT_ADDRESS;
const TRONGRID_API_KEY = process.env.TRONGRID_API_KEY; // Optional, increases rate limits

// In-memory payment tracking
// Structure: Map<paymentId, { address, expectedAmount, email, plan, createdAt, txid, status }>
const pendingPayments = new Map();

// Track used transactions to prevent double-crediting
const usedTransactions = new Set();

/**
 * Check if Tron USDT is configured
 */
function isConfigured() {
  return !!TRON_USDT_ADDRESS;
}

/**
 * Make request to TronGrid API
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${TRONGRID_API_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Add API key if configured (increases rate limits)
  if (TRONGRID_API_KEY) {
    headers['TRON-PRO-API-KEY'] = TRONGRID_API_KEY;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`TronGrid API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Create a USDT TRC20 payment request
 * Returns the receiving address and expected amount
 *
 * @param {number} amount - Amount in USD (USDT is pegged 1:1)
 * @param {object} metadata - Payment metadata (email, plan, paymentId)
 * @returns {object} Payment details
 */
async function createPayment(amount, metadata = {}) {
  if (!isConfigured()) {
    return {
      success: false,
      error: 'Tron USDT payments not configured. Set TRON_USDT_ADDRESS in environment.'
    };
  }

  const { email, plan, paymentId } = metadata;

  // Store pending payment
  const payment = {
    paymentId,
    address: TRON_USDT_ADDRESS,
    expectedAmount: amount,
    email,
    plan,
    createdAt: Date.now(),
    status: 'pending',
    txid: null
  };

  pendingPayments.set(paymentId, payment);

  return {
    success: true,
    paymentId,
    address: TRON_USDT_ADDRESS,
    amount: amount,
    payAmount: amount.toFixed(2), // USDT is 1:1 with USD
    payCurrency: 'USDT',
    network: 'usdttrc20',
    networkName: 'Tron (TRC20)',
    networkFee: '~$1',
    qrData: TRON_USDT_ADDRESS, // Simple address for QR
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    reused: false
  };
}

/**
 * Get TRC20 token transfers for our address
 * TronGrid returns transfers TO our address
 */
async function getRecentTransfers() {
  if (!isConfigured()) {
    return { success: false, transfers: [] };
  }

  try {
    // Get TRC20 transfers for our address
    // This endpoint returns token transfers where our address is the recipient
    const response = await apiRequest(
      `/v1/accounts/${TRON_USDT_ADDRESS}/transactions/trc20?only_to=true&limit=50&contract_address=${USDT_CONTRACT}`
    );

    if (!response.data) {
      return { success: true, transfers: [] };
    }

    // Parse transfers
    const transfers = response.data.map(tx => ({
      txid: tx.transaction_id,
      from: tx.from,
      to: tx.to,
      amount: parseFloat(tx.value) / 1e6, // USDT has 6 decimals
      timestamp: tx.block_timestamp,
      confirmed: true // TronGrid returns confirmed transactions
    }));

    return { success: true, transfers };
  } catch (error) {
    console.error('Get Tron transfers error:', error);
    return { success: false, error: error.message, transfers: [] };
  }
}

/**
 * Check if a specific payment was received
 * Looks for a USDT transfer matching the expected amount
 *
 * @param {string} paymentId - Our internal payment ID
 * @param {number} expectedAmount - Expected USDT amount
 * @returns {object} Payment status
 */
async function checkPayment(paymentId, expectedAmount) {
  if (!isConfigured()) {
    return { success: false, status: 'pending', error: 'Not configured' };
  }

  const payment = pendingPayments.get(paymentId);
  if (!payment) {
    return { success: false, status: 'not_found', error: 'Payment not found' };
  }

  // If already confirmed, return cached result
  if (payment.status === 'confirmed') {
    return {
      success: true,
      status: 'confirmed',
      txid: payment.txid,
      amount: payment.confirmedAmount
    };
  }

  try {
    const { success, transfers, error } = await getRecentTransfers();

    if (!success) {
      return { success: true, status: 'pending', error };
    }

    // Look for a matching transfer
    // We check for transfers within a reasonable time window and amount tolerance
    const paymentTime = payment.createdAt;
    const tolerance = 0.01; // Allow 1 cent tolerance for rounding

    for (const transfer of transfers) {
      // Skip if already used
      if (usedTransactions.has(transfer.txid)) {
        continue;
      }

      // Check if transfer is after payment was created (with 5 min buffer for block time)
      if (transfer.timestamp < paymentTime - 5 * 60 * 1000) {
        continue;
      }

      // Check if amount matches (with tolerance)
      const amountDiff = Math.abs(transfer.amount - expectedAmount);
      if (amountDiff <= tolerance) {
        // Found matching payment!
        usedTransactions.add(transfer.txid);

        payment.status = 'confirmed';
        payment.txid = transfer.txid;
        payment.confirmedAmount = transfer.amount;
        payment.confirmedAt = new Date().toISOString();

        console.log(`Tron USDT payment confirmed: ${transfer.txid} for $${transfer.amount} (expected $${expectedAmount})`);

        return {
          success: true,
          status: 'confirmed',
          txid: transfer.txid,
          amount: transfer.amount,
          from: transfer.from
        };
      }
    }

    // Check if expired (30 minutes)
    if (Date.now() - paymentTime > 30 * 60 * 1000) {
      payment.status = 'expired';
      return { success: true, status: 'expired' };
    }

    return { success: true, status: 'pending' };
  } catch (error) {
    console.error('Check Tron payment error:', error);
    return { success: true, status: 'pending', error: error.message };
  }
}

/**
 * Get payment status by payment ID
 */
function getPaymentStatus(paymentId) {
  const payment = pendingPayments.get(paymentId);
  if (!payment) {
    return { success: false, error: 'Payment not found' };
  }

  return {
    success: true,
    status: payment.status,
    txid: payment.txid,
    address: payment.address,
    expectedAmount: payment.expectedAmount,
    createdAt: payment.createdAt
  };
}

/**
 * Mark a payment as used (processed)
 */
function markPaymentUsed(paymentId, txid = null) {
  const payment = pendingPayments.get(paymentId);
  if (payment) {
    payment.status = 'used';
    if (txid) {
      usedTransactions.add(txid);
    }
  }
}

/**
 * Clean up old pending payments (run periodically)
 */
function cleanupOldPayments() {
  const now = Date.now();
  const maxAge = 2 * 60 * 60 * 1000; // 2 hours

  let cleaned = 0;
  for (const [paymentId, payment] of pendingPayments.entries()) {
    if (now - payment.createdAt > maxAge && payment.status === 'pending') {
      pendingPayments.delete(paymentId);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`Tron: Cleaned up ${cleaned} old pending payments`);
  }

  return cleaned;
}

/**
 * Get stats for debugging
 */
function getStats() {
  return {
    configured: isConfigured(),
    address: TRON_USDT_ADDRESS ? `${TRON_USDT_ADDRESS.substring(0, 8)}...` : null,
    pendingPayments: pendingPayments.size,
    usedTransactions: usedTransactions.size,
    hasApiKey: !!TRONGRID_API_KEY
  };
}

// Run cleanup every 30 minutes
setInterval(cleanupOldPayments, 30 * 60 * 1000);

module.exports = {
  isConfigured,
  createPayment,
  checkPayment,
  getPaymentStatus,
  markPaymentUsed,
  getRecentTransfers,
  cleanupOldPayments,
  getStats,
  USDT_CONTRACT
};
