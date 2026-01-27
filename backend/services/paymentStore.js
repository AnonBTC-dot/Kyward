// KYWARD PAYMENT STORE
// In-memory payment storage with provider tracking
// Supports: BTCPay (Lightning/Liquid), HD derivation (On-chain), NOWPayments (USDT)

const payments = new Map();

// Index for looking up payments by provider ID (invoiceId, nowpaymentsId, etc.)
const providerIndex = new Map();

/**
 * Save or update a payment
 * @param {object} payment - Payment object
 * @param {string} payment.id - Internal payment ID
 * @param {string} payment.provider - Provider: btcpay_lightning, direct_btc, nowpayments_*, etc.
 * @param {string} payment.method - Method: lightning, onchain, liquid, usdt
 * @param {string} payment.network - Network for liquid/usdt (optional)
 * @param {string} payment.email - User email
 * @param {string} payment.plan - Plan: essential, sentinel, consultation
 * @param {number} payment.amount - Amount in USD
 * @param {string} payment.status - Status: pending, confirmed, expired, failed
 * @param {string} payment.invoiceId - BTCPay invoice ID (for lightning/liquid)
 * @param {string} payment.nowpaymentsId - NOWPayments payment ID (for usdt)
 * @param {string} payment.address - Payment address (for onchain/liquid/usdt)
 * @param {number} payment.sats - Expected sats (for onchain)
 * @param {object} payment.paymentData - Full payment data for status checks
 */
function savePayment(payment) {
  const paymentRecord = {
    ...payment,
    updatedAt: new Date().toISOString(),
    createdAt: payment.createdAt || new Date().toISOString()
  };

  payments.set(payment.id, paymentRecord);

  // Index by provider IDs for webhook lookups
  if (payment.invoiceId) {
    providerIndex.set(`btcpay:${payment.invoiceId}`, payment.id);
  }
  if (payment.nowpaymentsId) {
    providerIndex.set(`nowpayments:${payment.nowpaymentsId}`, payment.id);
  }
  if (payment.address) {
    providerIndex.set(`address:${payment.address}`, payment.id);
  }

  console.log(`Payment saved: ${payment.id} - Provider: ${payment.provider} - Status: ${payment.status}`);
}

/**
 * Get a payment by ID
 */
function getPayment(paymentId) {
  return payments.get(paymentId) || null;
}

/**
 * Get payment by BTCPay invoice ID
 */
function getByInvoiceId(invoiceId) {
  const paymentId = providerIndex.get(`btcpay:${invoiceId}`);
  return paymentId ? payments.get(paymentId) : null;
}

/**
 * Get payment by NOWPayments payment ID
 */
function getByNowpaymentsId(nowpaymentsId) {
  const paymentId = providerIndex.get(`nowpayments:${nowpaymentsId}`);
  return paymentId ? payments.get(paymentId) : null;
}

/**
 * Get payment by address
 */
function getByAddress(address) {
  const paymentId = providerIndex.get(`address:${address}`);
  return paymentId ? payments.get(paymentId) : null;
}

/**
 * Get payment by provider ID (generic lookup)
 */
function getByProviderId(providerId, providerType = null) {
  if (providerType === 'btcpay') {
    return getByInvoiceId(providerId);
  }
  if (providerType === 'nowpayments') {
    return getByNowpaymentsId(providerId);
  }
  if (providerType === 'address') {
    return getByAddress(providerId);
  }

  // Try all types
  return getByInvoiceId(providerId) ||
         getByNowpaymentsId(providerId) ||
         getByAddress(providerId);
}

/**
 * Get all payments for an email
 */
function getPaymentsByEmail(email) {
  const results = [];
  for (const payment of payments.values()) {
    if (payment.email === email) {
      results.push(payment);
    }
  }
  return results;
}

/**
 * Get all pending payments (for background checking)
 * @param {string} provider - Optional: filter by provider
 */
function getPendingPayments(provider = null) {
  const results = [];
  for (const payment of payments.values()) {
    if (payment.status === 'pending') {
      if (!provider || payment.provider === provider) {
        results.push(payment);
      }
    }
  }
  return results;
}

/**
 * Get pending payments by method
 * @param {string} method - Payment method: lightning, onchain, liquid, usdt
 */
function getPendingByMethod(method) {
  const results = [];
  for (const payment of payments.values()) {
    if (payment.status === 'pending' && payment.method === method) {
      results.push(payment);
    }
  }
  return results;
}

/**
 * Update payment status
 */
function updateStatus(paymentId, status, additionalData = {}) {
  const payment = payments.get(paymentId);
  if (!payment) {
    return null;
  }

  const updated = {
    ...payment,
    ...additionalData,
    status,
    updatedAt: new Date().toISOString()
  };

  if (status === 'confirmed') {
    updated.confirmedAt = new Date().toISOString();
  }

  payments.set(paymentId, updated);
  console.log(`Payment ${paymentId} status updated to: ${status}`);

  return updated;
}

/**
 * Delete expired payments (cleanup)
 */
function cleanupExpired() {
  const now = new Date();
  let cleaned = 0;

  for (const [id, payment] of payments.entries()) {
    if (payment.status === 'expired' ||
        (payment.status === 'pending' && new Date(payment.expiresAt) < now)) {
      // Remove from indexes
      if (payment.invoiceId) {
        providerIndex.delete(`btcpay:${payment.invoiceId}`);
      }
      if (payment.nowpaymentsId) {
        providerIndex.delete(`nowpayments:${payment.nowpaymentsId}`);
      }
      if (payment.address) {
        providerIndex.delete(`address:${payment.address}`);
      }

      payments.delete(id);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} expired payments`);
  }

  return cleaned;
}

/**
 * Get payment statistics
 */
function getStats() {
  const stats = {
    pending: 0,
    confirmed: 0,
    expired: 0,
    failed: 0,
    total: payments.size,
    totalUsd: 0,
    byProvider: {},
    byMethod: {}
  };

  for (const payment of payments.values()) {
    // Count by status
    if (payment.status === 'pending') stats.pending++;
    if (payment.status === 'confirmed') {
      stats.confirmed++;
      stats.totalUsd += payment.amount || 0;
    }
    if (payment.status === 'expired') stats.expired++;
    if (payment.status === 'failed') stats.failed++;

    // Count by provider
    const provider = payment.provider || 'unknown';
    stats.byProvider[provider] = (stats.byProvider[provider] || 0) + 1;

    // Count by method
    const method = payment.method || 'unknown';
    stats.byMethod[method] = (stats.byMethod[method] || 0) + 1;
  }

  return stats;
}

/**
 * Get all payments (for debugging)
 */
function getAllPayments() {
  return Array.from(payments.values());
}

module.exports = {
  savePayment,
  getPayment,
  getByInvoiceId,
  getByNowpaymentsId,
  getByAddress,
  getByProviderId,
  getPaymentsByEmail,
  getPendingPayments,
  getPendingByMethod,
  updateStatus,
  cleanupExpired,
  getStats,
  getAllPayments
};
