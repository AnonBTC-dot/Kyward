// KYWARD BTCPAY SERVER SERVICE
// Handles Lightning Network and Liquid payments via BTCPay Server Greenfield API v1
// Includes invoice reuse logic to prevent spam and waste

const crypto = require('crypto');

// Configuration from environment
const BTCPAY_HOST = process.env.BTCPAY_HOST;
const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID;
const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY;
const BTCPAY_WEBHOOK_SECRET = process.env.BTCPAY_WEBHOOK_SECRET;

// Invoice assignment duration (30 minutes)
const INVOICE_ASSIGNMENT_DURATION = 30 * 60 * 1000;

// In-memory invoice assignments per user/email
// Structure: Map<email, { invoiceId, plan, paymentMethod, assignedAt, amount }>
const invoiceAssignments = new Map();

// Track used invoices (paid)
const usedInvoices = new Set();

// API base URL
const getApiUrl = () => `${BTCPAY_HOST}/api/v1`;

/**
 * Check if BTCPay is configured
 */
function isConfigured() {
  return !!(BTCPAY_HOST && BTCPAY_STORE_ID && BTCPAY_API_KEY);
}

/**
 * Make authenticated request to BTCPay Greenfield API
 */
async function apiRequest(endpoint, options = {}) {
  if (!isConfigured()) {
    throw new Error('BTCPay Server not configured');
  }

  const url = `${getApiUrl()}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `token ${BTCPAY_API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`BTCPay API error: ${response.status} - ${error}`);
    throw new Error(`BTCPay API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Generate assignment key for invoice tracking
 */
function getAssignmentKey(email, plan, paymentMethod) {
  return `${email}:${plan}:${paymentMethod}`;
}

/**
 * Check if user has an active invoice assignment
 * Returns the existing invoice if valid, null otherwise
 */
async function getExistingInvoice(email, plan, paymentMethod, amount) {
  const key = getAssignmentKey(email, plan, paymentMethod);
  const assignment = invoiceAssignments.get(key);

  if (!assignment) {
    return null;
  }

  const now = Date.now();
  const timeSinceAssignment = now - assignment.assignedAt;

  // Check if assignment is still within window
  if (timeSinceAssignment >= INVOICE_ASSIGNMENT_DURATION) {
    // Assignment expired, check if invoice was used
    if (usedInvoices.has(assignment.invoiceId)) {
      // Invoice was paid, remove assignment
      invoiceAssignments.delete(key);
      return null;
    }

    // Check invoice status from BTCPay
    try {
      const status = await getInvoiceStatus(assignment.invoiceId);

      if (status.status === 'confirmed' || status.btcpayStatus === 'Settled') {
        // Invoice was paid, mark as used
        usedInvoices.add(assignment.invoiceId);
        invoiceAssignments.delete(key);
        return null;
      }

      if (status.status === 'expired' || status.btcpayStatus === 'Expired') {
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
      console.log(`Reusing expired assignment invoice ${assignment.invoiceId} for ${email} (still pending)`);
      assignment.assignedAt = now; // Extend assignment
      invoiceAssignments.set(key, assignment);
      return assignment;
    } catch (error) {
      console.error('Error checking invoice status:', error);
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

  console.log(`Reusing active invoice ${assignment.invoiceId} for ${email} (assigned ${Math.round(timeSinceAssignment / 60000)} min ago)`);

  // Extend assignment time
  assignment.assignedAt = now;
  invoiceAssignments.set(key, assignment);

  return assignment;
}

/**
 * Save invoice assignment for user
 */
function saveInvoiceAssignment(email, plan, paymentMethod, invoiceId, amount, invoiceData) {
  const key = getAssignmentKey(email, plan, paymentMethod);

  invoiceAssignments.set(key, {
    invoiceId,
    plan,
    paymentMethod,
    amount,
    assignedAt: Date.now(),
    invoiceData // Store full invoice data for reuse
  });

  console.log(`New invoice ${invoiceId} assigned to ${email} for ${plan} via ${paymentMethod}`);
}

/**
 * Mark invoice as used (paid)
 */
function markInvoiceUsed(invoiceId, email = null) {
  usedInvoices.add(invoiceId);

  // Remove from assignments
  if (email) {
    for (const [key, assignment] of invoiceAssignments.entries()) {
      if (assignment.invoiceId === invoiceId) {
        invoiceAssignments.delete(key);
        console.log(`Invoice ${invoiceId} marked as used, removed assignment`);
        break;
      }
    }
  }
}

/**
 * Create a Lightning Network invoice
 * Includes reuse logic to prevent spam
 * @param {number} amount - Amount in USD
 * @param {object} metadata - Payment metadata (email, plan, paymentId)
 * @returns {object} Invoice details with BOLT11 invoice string
 */
async function createLightningInvoice(amount, metadata = {}) {
  const { email, plan, paymentId } = metadata;

  // Check for existing valid invoice
  const existing = await getExistingInvoice(email, plan, 'lightning', amount);
  if (existing && existing.invoiceData) {
    console.log(`Returning existing Lightning invoice for ${email}`);
    return {
      ...existing.invoiceData,
      reused: true
    };
  }

  // Create new invoice
  const invoiceData = {
    amount: amount.toString(),
    currency: 'USD',
    metadata: {
      orderId: paymentId,
      buyerEmail: email,
      plan: plan,
      provider: 'btcpay_lightning'
    },
    checkout: {
      paymentMethods: ['BTC-LN'],
      expirationMinutes: 30,
      monitoringMinutes: 60,
      speedPolicy: 'MediumSpeed',
      redirectURL: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      redirectAutomatically: false
    },
    receipt: {
      enabled: true,
      showQR: true
    }
  };

  try {
    const invoice = await apiRequest(`/stores/${BTCPAY_STORE_ID}/invoices`, {
      method: 'POST',
      body: JSON.stringify(invoiceData)
    });

    // Get the Lightning payment method details
    const paymentMethods = await apiRequest(
      `/stores/${BTCPAY_STORE_ID}/invoices/${invoice.id}/payment-methods`
    );

    const lightningMethod = paymentMethods.find(pm => pm.paymentMethod === 'BTC-LN');

    const result = {
      success: true,
      invoiceId: invoice.id,
      status: invoice.status,
      amount: invoice.amount,
      currency: invoice.currency,
      // Lightning specific
      lightningInvoice: lightningMethod?.destination || null,
      paymentLink: `${BTCPAY_HOST}/i/${invoice.id}`,
      qrData: lightningMethod?.destination ? `lightning:${lightningMethod.destination}` : null,
      expiresAt: invoice.expirationTime,
      checkoutLink: invoice.checkoutLink,
      reused: false
    };

    // Save assignment for reuse
    saveInvoiceAssignment(email, plan, 'lightning', invoice.id, amount, result);

    return result;
  } catch (error) {
    console.error('Create Lightning invoice error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create a Liquid Network invoice (L-BTC or L-USDT)
 * Includes reuse logic to prevent spam
 * @param {number} amount - Amount in USD
 * @param {string} asset - 'lbtc' or 'lusdt'
 * @param {object} metadata - Payment metadata
 * @returns {object} Invoice details with Liquid address
 */
async function createLiquidInvoice(amount, asset = 'lbtc', metadata = {}) {
  const { email, plan, paymentId } = metadata;
  const paymentMethodKey = `liquid_${asset}`;

  // Check for existing valid invoice
  const existing = await getExistingInvoice(email, plan, paymentMethodKey, amount);
  if (existing && existing.invoiceData) {
    console.log(`Returning existing Liquid invoice for ${email}`);
    return {
      ...existing.invoiceData,
      reused: true
    };
  }

  // Map asset to BTCPay payment method
  const paymentMethodMap = {
    'lbtc': 'LBTC',
    'lusdt': 'USDt-Liquid'  // BTCPay uses this format for Liquid USDT
  };

  const paymentMethod = paymentMethodMap[asset] || 'LBTC';

  const invoiceData = {
    amount: amount.toString(),
    currency: 'USD',
    metadata: {
      orderId: paymentId,
      buyerEmail: email,
      plan: plan,
      provider: 'btcpay_liquid',
      asset: asset
    },
    checkout: {
      paymentMethods: [paymentMethod],
      expirationMinutes: 30,
      monitoringMinutes: 60,
      speedPolicy: 'MediumSpeed',
      redirectURL: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
      redirectAutomatically: false
    },
    receipt: {
      enabled: true,
      showQR: true
    }
  };

  try {
    const invoice = await apiRequest(`/stores/${BTCPAY_STORE_ID}/invoices`, {
      method: 'POST',
      body: JSON.stringify(invoiceData)
    });

    // Get the Liquid payment method details
    const paymentMethods = await apiRequest(
      `/stores/${BTCPAY_STORE_ID}/invoices/${invoice.id}/payment-methods`
    );

    const liquidMethod = paymentMethods.find(pm =>
      pm.paymentMethod === paymentMethod ||
      pm.paymentMethod.includes('LBTC') ||
      pm.paymentMethod.includes('Liquid')
    );

    const result = {
      success: true,
      invoiceId: invoice.id,
      status: invoice.status,
      amount: invoice.amount,
      currency: invoice.currency,
      asset: asset,
      // Liquid specific
      address: liquidMethod?.destination || null,
      paymentLink: `${BTCPAY_HOST}/i/${invoice.id}`,
      qrData: liquidMethod?.destination ? `liquidnetwork:${liquidMethod.destination}` : null,
      expiresAt: invoice.expirationTime,
      checkoutLink: invoice.checkoutLink,
      // Amount in the actual asset
      assetAmount: liquidMethod?.due || null,
      reused: false
    };

    // Save assignment for reuse
    saveInvoiceAssignment(email, plan, paymentMethodKey, invoice.id, amount, result);

    return result;
  } catch (error) {
    console.error('Create Liquid invoice error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get invoice status
 * @param {string} invoiceId - BTCPay invoice ID
 * @returns {object} Invoice status details
 */
async function getInvoiceStatus(invoiceId) {
  try {
    const invoice = await apiRequest(`/stores/${BTCPAY_STORE_ID}/invoices/${invoiceId}`);

    // Map BTCPay status to our status
    const statusMap = {
      'New': 'pending',
      'Processing': 'pending',
      'Expired': 'expired',
      'Invalid': 'failed',
      'Settled': 'confirmed',
      'Complete': 'confirmed'
    };

    return {
      success: true,
      invoiceId: invoice.id,
      status: statusMap[invoice.status] || 'pending',
      btcpayStatus: invoice.status,
      amount: invoice.amount,
      currency: invoice.currency,
      paidAmount: invoice.additionalStatus?.paidAmount || 0,
      expiresAt: invoice.expirationTime,
      settledAt: invoice.monitoringExpiration
    };
  } catch (error) {
    console.error('Get invoice status error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get invoice payment methods (for getting addresses/invoices)
 * @param {string} invoiceId - BTCPay invoice ID
 */
async function getInvoicePaymentMethods(invoiceId) {
  try {
    const methods = await apiRequest(
      `/stores/${BTCPAY_STORE_ID}/invoices/${invoiceId}/payment-methods`
    );
    return {
      success: true,
      methods
    };
  } catch (error) {
    console.error('Get payment methods error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verify webhook signature from BTCPay Server
 * BTCPay uses HMAC-SHA256 with the webhook secret
 * @param {Buffer|string} payload - Raw request body
 * @param {string} signature - Value from BTCPAY-SIG header
 * @returns {boolean} Whether signature is valid
 */
function verifyWebhookSignature(payload, signature) {
  if (!BTCPAY_WEBHOOK_SECRET || !signature) {
    console.warn('BTCPay webhook secret or signature missing');
    return false;
  }

  try {
    // BTCPay signature format: sha256=HASH
    const expectedSignature = signature.startsWith('sha256=')
      ? signature
      : `sha256=${signature}`;

    const body = typeof payload === 'string' ? payload : payload.toString();

    const computedHash = crypto
      .createHmac('sha256', BTCPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    const computedSignature = `sha256=${computedHash}`;

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(computedSignature)
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}

/**
 * Process webhook event from BTCPay Server
 * @param {object} event - Parsed webhook event
 * @returns {object} Processed event data
 */
function processWebhookEvent(event) {
  const { type, invoiceId, storeId, metadata } = event;

  // Relevant event types:
  // - InvoiceCreated
  // - InvoiceReceivedPayment
  // - InvoicePaymentSettled
  // - InvoiceProcessing
  // - InvoiceExpired
  // - InvoiceSettled (final - payment complete)
  // - InvoiceInvalid

  const isPaymentComplete = ['InvoiceSettled', 'InvoicePaymentSettled'].includes(type);
  const isExpired = type === 'InvoiceExpired';
  const isFailed = type === 'InvoiceInvalid';

  // Mark invoice as used if payment complete
  if (isPaymentComplete) {
    markInvoiceUsed(invoiceId, metadata?.buyerEmail);
  }

  return {
    type,
    invoiceId,
    storeId,
    metadata: metadata || {},
    paymentId: metadata?.orderId || null,
    email: metadata?.buyerEmail || null,
    plan: metadata?.plan || null,
    isPaymentComplete,
    isExpired,
    isFailed
  };
}

/**
 * Get store information (for health check)
 */
async function getStoreInfo() {
  try {
    const store = await apiRequest(`/stores/${BTCPAY_STORE_ID}`);
    return {
      success: true,
      storeId: store.id,
      storeName: store.name,
      defaultCurrency: store.defaultCurrency
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
    console.log(`BTCPay: Cleaned up ${cleaned} expired invoice assignments`);
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
  createLightningInvoice,
  createLiquidInvoice,
  getInvoiceStatus,
  getInvoicePaymentMethods,
  verifyWebhookSignature,
  processWebhookEvent,
  markInvoiceUsed,
  getStoreInfo,
  cleanupExpiredAssignments,
  getAssignmentStats
};
