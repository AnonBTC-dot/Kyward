// KYWARD PAYMENT STORE
// In-memory payment storage (use Redis or database in production)

const payments = new Map();

/**
 * Save or update a payment
 */
function savePayment(payment) {
  payments.set(payment.id, { ...payment, updatedAt: new Date().toISOString() });
  console.log(`Payment saved: ${payment.id} - Status: ${payment.status}`);
}

/**
 * Get a payment by ID
 */
function getPayment(paymentId) {
  return payments.get(paymentId) || null;
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
 */
function getPendingPayments() {
  const results = [];
  for (const payment of payments.values()) {
    if (payment.status === 'pending') {
      results.push(payment);
    }
  }
  return results;
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
  let pending = 0;
  let confirmed = 0;
  let expired = 0;
  let totalSats = 0;

  for (const payment of payments.values()) {
    if (payment.status === 'pending') pending++;
    if (payment.status === 'confirmed') {
      confirmed++;
      totalSats += payment.amountSats;
    }
    if (payment.status === 'expired') expired++;
  }

  return { pending, confirmed, expired, totalSats, total: payments.size };
}

module.exports = {
  savePayment,
  getPayment,
  getPaymentsByEmail,
  getPendingPayments,
  cleanupExpired,
  getStats
};
