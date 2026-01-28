// KYWARD ETHEREUM USDT SERVICE
// Handles USDT ERC20 payments via Etherscan API
// No third-party payment processor required - direct blockchain monitoring

// USDT ERC20 contract address on Ethereum mainnet
const USDT_CONTRACT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

// Configuration
const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';
const ETH_USDT_ADDRESS = process.env.ETH_USDT_ADDRESS;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY; // Required for Etherscan

// In-memory payment tracking
// Structure: Map<paymentId, { address, expectedAmount, email, plan, createdAt, txid, status }>
const pendingPayments = new Map();

// Track used transactions to prevent double-crediting
const usedTransactions = new Set();

/**
 * Check if Ethereum USDT is configured
 */
function isConfigured() {
  return !!(ETH_USDT_ADDRESS && ETHERSCAN_API_KEY);
}

/**
 * Make request to Etherscan API
 */
async function apiRequest(params) {
  const queryString = new URLSearchParams({
    ...params,
    apikey: ETHERSCAN_API_KEY
  }).toString();

  const url = `${ETHERSCAN_API_URL}?${queryString}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Etherscan API error: ${response.status}`);
  }

  const data = await response.json();

  // Etherscan returns status "0" for errors
  if (data.status === '0' && data.message !== 'No transactions found') {
    throw new Error(data.result || data.message || 'Etherscan API error');
  }

  return data;
}

/**
 * Create a USDT ERC20 payment request
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
      error: 'Ethereum USDT payments not configured. Set ETH_USDT_ADDRESS and ETHERSCAN_API_KEY in environment.'
    };
  }

  const { email, plan, paymentId } = metadata;

  // Store pending payment
  const payment = {
    paymentId,
    address: ETH_USDT_ADDRESS,
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
    address: ETH_USDT_ADDRESS,
    amount: amount,
    payAmount: amount.toFixed(2), // USDT is 1:1 with USD
    payCurrency: 'USDT',
    network: 'usdterc20',
    networkName: 'Ethereum (ERC20)',
    networkFee: '~$5-20',
    qrData: ETH_USDT_ADDRESS, // Simple address for QR
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    reused: false
  };
}

/**
 * Get ERC20 USDT transfers for our address
 * Etherscan returns token transfers where our address is the recipient
 */
async function getRecentTransfers() {
  if (!isConfigured()) {
    return { success: false, transfers: [] };
  }

  try {
    // Get ERC20 token transfers for our address
    const response = await apiRequest({
      module: 'account',
      action: 'tokentx',
      contractaddress: USDT_CONTRACT,
      address: ETH_USDT_ADDRESS,
      page: 1,
      offset: 50,
      sort: 'desc'
    });

    if (!response.result || !Array.isArray(response.result)) {
      return { success: true, transfers: [] };
    }

    // Parse transfers - filter only incoming transfers
    const transfers = response.result
      .filter(tx => tx.to.toLowerCase() === ETH_USDT_ADDRESS.toLowerCase())
      .map(tx => ({
        txid: tx.hash,
        from: tx.from,
        to: tx.to,
        amount: parseFloat(tx.value) / 1e6, // USDT has 6 decimals
        timestamp: parseInt(tx.timeStamp) * 1000, // Convert to milliseconds
        blockNumber: parseInt(tx.blockNumber),
        confirmations: parseInt(tx.confirmations),
        confirmed: parseInt(tx.confirmations) >= 1
      }));

    return { success: true, transfers };
  } catch (error) {
    console.error('Get Ethereum transfers error:', error);
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
        payment.confirmations = transfer.confirmations;

        console.log(`Ethereum USDT payment confirmed: ${transfer.txid} for $${transfer.amount} (expected $${expectedAmount})`);

        return {
          success: true,
          status: 'confirmed',
          txid: transfer.txid,
          amount: transfer.amount,
          from: transfer.from,
          confirmations: transfer.confirmations
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
    console.error('Check Ethereum payment error:', error);
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
    createdAt: payment.createdAt,
    confirmations: payment.confirmations || 0
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
    console.log(`Ethereum: Cleaned up ${cleaned} old pending payments`);
  }

  return cleaned;
}

/**
 * Get stats for debugging
 */
function getStats() {
  return {
    configured: isConfigured(),
    address: ETH_USDT_ADDRESS ? `${ETH_USDT_ADDRESS.substring(0, 10)}...` : null,
    pendingPayments: pendingPayments.size,
    usedTransactions: usedTransactions.size,
    hasApiKey: !!ETHERSCAN_API_KEY
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
