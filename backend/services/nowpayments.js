// KYWARD NOWPAYMENTS SERVICE
// Handles USDT payments via NOWPayments API
// Supports: Tron (TRC20), Polygon (MATIC), BSC, Ethereum (ERC20)
// Includes invoice reuse logic to prevent spam and waste

const crypto = require('crypto');

// Configuration from environment
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

// Invoice assignment duration (30 minutes)
const INVOICE_ASSIGNMENT_DURATION = 30 * 60 * 1000;

// In-memory invoice assignments per user/email
// Structure: Map<email:plan:network, { paymentId, plan, network, assignedAt, amount, paymentData }>
const invoiceAssignments = new Map();

// Track used invoices (paid)
const usedInvoices = new Set();

// Network mapping for NOWPayments
const NETWORK_MAP = {
  'usdttrc20': { currency: 'usdttrc20', name: 'Tron (TRC20)', fee: '~$1' },
  'usdtmatic': { currency: 'usdtmatic', name: 'Polygon', fee: '< $0.01' },
  'usdtbsc': { currency: 'usdtbsc', name: 'BSC', fee: '~$0.10' },
  'usdterc20': { currency: 'usdterc20', name: 'Ethereum (ERC20)', fee: '~$5-20' }
};

/**
 * Check if NOWPayments is configured
 */
function isConfigured() {
  return !!(NOWPAYMENTS_API_KEY);
}

/**
 * Make authenticated request to NOWPayments API
 */
async function apiRequest(endpoint, options = {}) {
  if (!isConfigured()) {
    throw new Error('NOWPayments not configured');
  }

  const url = `${NOWPAYMENTS_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'x-api-key': NOWPAYMENTS_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`NOWPayments API error: ${response.status} - ${error}`);
    throw new Error(`NOWPayments API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Generate assignment key for invoice tracking
 */
function getAssignmentKey(email, plan, network) {
  return `${email}:${plan}:${network}`;
}

/**
 * Check if user has an active invoice assignment
 * Returns the existing invoice if valid, null otherwise
 */
async function getExistingInvoice(email, plan, network, amount) {
  const key = getAssignmentKey(email, plan, network);
  const assignment = invoiceAssignments.get(key);

  if (!assignment) {
    return null;
  }

  const now = Date.now();
  const timeSinceAssignment = now - assignment.assignedAt;

  // Check if assignment is still within window
  if (timeSinceAssignment >= INVOICE_ASSIGNMENT_DURATION) {
    // Assignment expired, check if invoice was used
    if (usedInvoices.has(assignment.paymentId)) {
      // Invoice was paid, remove assignment
      invoiceAssignments.delete(key);
      return null;
    }

    // Check invoice status from NOWPayments
    try {
      const status = await getPaymentStatus(assignment.paymentId);

      if (status.status === 'confirmed' || status.nowpaymentsStatus === 'finished') {
        // Invoice was paid, mark as used
        usedInvoices.add(assignment.paymentId);
        invoiceAssignments.delete(key);
        return null;
      }

      if (status.status === 'expired' || status.nowpaymentsStatus === 'expired') {
        // Invoice expired without payment, remove and create new
        invoiceAssignments.delete(key);
        return null;
      }

      // Invoice still pending, check if amount matches
      if (assignment.amount !== amount) {
        // Amount changed (price update), need new invoice
        invoiceAssignments.delete(key);
        return null;
      }

      // Still valid but expired assignment - reuse invoice if still pending
      console.log(`Reusing expired assignment payment ${assignment.paymentId} for ${email} (still pending)`);
      assignment.assignedAt = now; // Extend assignment
      invoiceAssignments.set(key, assignment);
      return assignment;
    } catch (error) {
      console.error('Error checking payment status:', error);
      invoiceAssignments.delete(key);
      return null;
    }
  }

  // Assignment still within window
  // Check if amount matches (in case price changed)
  if (assignment.amount !== amount) {
    // Amount changed, need new invoice
    invoiceAssignments.delete(key);
    return null;
  }

  console.log(`Reusing active payment ${assignment.paymentId} for ${email} (assigned ${Math.round(timeSinceAssignment / 60000)} min ago)`);

  // Extend assignment time
  assignment.assignedAt = now;
  invoiceAssignments.set(key, assignment);

  return assignment;
}

/**
 * Save invoice assignment for user
 */
function saveInvoiceAssignment(email, plan, network, paymentId, amount, paymentData) {
  const key = getAssignmentKey(email, plan, network);

  invoiceAssignments.set(key, {
    paymentId,
    plan,
    network,
    amount,
    assignedAt: Date.now(),
    paymentData // Store full payment data for reuse
  });

  console.log(`New payment ${paymentId} assigned to ${email} for ${plan} via USDT ${network}`);
}

/**
 * Mark invoice as used (paid)
 */
function markInvoiceUsed(paymentId, email = null) {
  usedInvoices.add(paymentId);

  // Remove from assignments
  if (email) {
    for (const [key, assignment] of invoiceAssignments.entries()) {
      if (assignment.paymentId === paymentId) {
        invoiceAssignments.delete(key);
        console.log(`Payment ${paymentId} marked as used, removed assignment`);
        break;
      }
    }
  }
}

/**
 * Create a USDT payment via NOWPayments
 * Includes reuse logic to prevent spam
 * @param {number} amount - Amount in USD
 * @param {string} network - Network: usdttrc20, usdtmatic, usdtbsc, usdterc20
 * @param {object} metadata - Payment metadata (email, plan, paymentId)
 * @returns {object} Payment details with address
 */
async function createUsdtPayment(amount, network = 'usdttrc20', metadata = {}) {
  const { email, plan, paymentId: orderId } = metadata;

  // Validate network
  if (!NETWORK_MAP[network]) {
    return {
      success: false,
      error: `Invalid network: ${network}. Valid options: ${Object.keys(NETWORK_MAP).join(', ')}`
    };
  }

  // Check for existing valid invoice
  const existing = await getExistingInvoice(email, plan, network, amount);
  if (existing && existing.paymentData) {
    console.log(`Returning existing USDT payment for ${email}`);
    return {
      ...existing.paymentData,
      reused: true
    };
  }

  // Create new payment
  const paymentData = {
    price_amount: amount,
    price_currency: 'usd',
    pay_currency: network,
    order_id: orderId,
    order_description: `Kyward ${plan} subscription`,
    ipn_callback_url: `${process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL}/api/webhooks/nowpayments`,
    success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment=cancelled`
  };

  try {
    const payment = await apiRequest('/payment', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });

    const networkInfo = NETWORK_MAP[network];

    const result = {
      success: true,
      paymentId: payment.payment_id,
      orderId: payment.order_id,
      status: 'pending',
      nowpaymentsStatus: payment.payment_status,
      amount: payment.price_amount,
      currency: payment.price_currency,
      network: network,
      networkName: networkInfo.name,
      networkFee: networkInfo.fee,
      // USDT specific
      address: payment.pay_address,
      payAmount: payment.pay_amount,
      payCurrency: payment.pay_currency,
      qrData: payment.pay_address, // For QR code generation
      expiresAt: payment.expiration_estimate_date || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      reused: false
    };

    // Save assignment for reuse
    saveInvoiceAssignment(email, plan, network, payment.payment_id, amount, result);

    return result;
  } catch (error) {
    console.error('Create USDT payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get payment status from NOWPayments
 * @param {string} paymentId - NOWPayments payment ID
 * @returns {object} Payment status details
 */
async function getPaymentStatus(paymentId) {
  try {
    const payment = await apiRequest(`/payment/${paymentId}`);

    // Map NOWPayments status to our status
    // NOWPayments statuses: waiting, confirming, confirmed, sending, partially_paid, finished, failed, refunded, expired
    const statusMap = {
      'waiting': 'pending',
      'confirming': 'pending',
      'confirmed': 'pending',
      'sending': 'pending',
      'partially_paid': 'partial',
      'finished': 'confirmed',
      'failed': 'failed',
      'refunded': 'refunded',
      'expired': 'expired'
    };

    return {
      success: true,
      paymentId: payment.payment_id,
      orderId: payment.order_id,
      status: statusMap[payment.payment_status] || 'pending',
      nowpaymentsStatus: payment.payment_status,
      amount: payment.price_amount,
      currency: payment.price_currency,
      payAmount: payment.pay_amount,
      payCurrency: payment.pay_currency,
      actuallyPaid: payment.actually_paid,
      address: payment.pay_address,
      network: payment.pay_currency,
      createdAt: payment.created_at,
      updatedAt: payment.updated_at
    };
  } catch (error) {
    console.error('Get payment status error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verify IPN (Instant Payment Notification) signature from NOWPayments
 * NOWPayments uses HMAC-SHA512 with the IPN secret
 * @param {object} body - Parsed request body
 * @param {string} signature - Value from x-nowpayments-sig header
 * @returns {boolean} Whether signature is valid
 */
function verifyIpnSignature(body, signature) {
  if (!NOWPAYMENTS_IPN_SECRET || !signature) {
    console.warn('NOWPayments IPN secret or signature missing');
    return false;
  }

  try {
    // NOWPayments signs the sorted JSON body
    const sortedBody = sortObject(body);
    const bodyString = JSON.stringify(sortedBody);

    const computedHash = crypto
      .createHmac('sha512', NOWPAYMENTS_IPN_SECRET)
      .update(bodyString)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedHash)
    );
  } catch (error) {
    console.error('IPN signature verification error:', error);
    return false;
  }
}

/**
 * Sort object keys alphabetically (required for NOWPayments signature)
 */
function sortObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = sortObject(obj[key]);
      return result;
    }, {});
}

/**
 * Process IPN event from NOWPayments
 * @param {object} event - Parsed IPN event
 * @returns {object} Processed event data
 */
function processIpnEvent(event) {
  const {
    payment_id,
    payment_status,
    order_id,
    price_amount,
    price_currency,
    pay_amount,
    pay_currency,
    actually_paid
  } = event;

  // Payment is complete when status is 'finished'
  const isPaymentComplete = payment_status === 'finished';
  const isExpired = payment_status === 'expired';
  const isFailed = payment_status === 'failed';
  const isPartial = payment_status === 'partially_paid';

  // Mark invoice as used if payment complete
  if (isPaymentComplete) {
    markInvoiceUsed(payment_id);
  }

  return {
    paymentId: payment_id,
    orderId: order_id,
    status: payment_status,
    priceAmount: price_amount,
    priceCurrency: price_currency,
    payAmount: pay_amount,
    payCurrency: pay_currency,
    actuallyPaid: actually_paid,
    isPaymentComplete,
    isExpired,
    isFailed,
    isPartial
  };
}

/**
 * Get minimum payment amount for a currency
 * Useful for validation
 */
async function getMinimumAmount(currency = 'usdttrc20') {
  try {
    const result = await apiRequest(`/min-amount?currency_from=usd&currency_to=${currency}`);
    return {
      success: true,
      minAmount: result.min_amount,
      currency: currency
    };
  } catch (error) {
    console.error('Get minimum amount error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get available currencies from NOWPayments
 * Useful for checking which networks are available
 */
async function getAvailableCurrencies() {
  try {
    const result = await apiRequest('/currencies');
    // Filter for USDT variants
    const usdtCurrencies = result.currencies.filter(c =>
      c.toLowerCase().includes('usdt')
    );
    return {
      success: true,
      currencies: usdtCurrencies,
      all: result.currencies
    };
  } catch (error) {
    console.error('Get currencies error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get NOWPayments API status (health check)
 */
async function getApiStatus() {
  try {
    const result = await apiRequest('/status');
    return {
      success: true,
      message: result.message
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Clean up expired invoice assignments (run periodically)
 */
function cleanupExpiredAssignments() {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, assignment] of invoiceAssignments.entries()) {
    // Remove assignments older than 2x the duration (1 hour)
    if (now - assignment.assignedAt > INVOICE_ASSIGNMENT_DURATION * 2) {
      invoiceAssignments.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`NOWPayments: Cleaned up ${cleaned} expired invoice assignments`);
  }

  return cleaned;
}

/**
 * Get assignment stats (for debugging/monitoring)
 */
function getAssignmentStats() {
  return {
    activeAssignments: invoiceAssignments.size,
    usedInvoices: usedInvoices.size
  };
}

// Run cleanup every 10 minutes
setInterval(cleanupExpiredAssignments, 10 * 60 * 1000);

module.exports = {
  isConfigured,
  createUsdtPayment,
  getPaymentStatus,
  verifyIpnSignature,
  processIpnEvent,
  markInvoiceUsed,
  getMinimumAmount,
  getAvailableCurrencies,
  getApiStatus,
  cleanupExpiredAssignments,
  getAssignmentStats,
  NETWORK_MAP
};
