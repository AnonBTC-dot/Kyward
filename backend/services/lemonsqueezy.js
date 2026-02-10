// Lemon Squeezy FIAT Payment Service
// API Docs: https://docs.lemonsqueezy.com/
// Deployment Guide: See LEMONSQUEEZY_DEPLOYMENT.md in project root

const crypto = require('crypto');

// Configuration
const LEMONSQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

// In-memory store for payment sessions (mirrors tron.js pattern)
const paymentSessions = new Map();

/**
 * Check if Lemon Squeezy is configured
 */
function isConfigured() {
  return !!(
    process.env.LEMONSQUEEZY_API_KEY &&
    process.env.LEMONSQUEEZY_STORE_ID
  );
}

/**
 * Make authenticated API request to Lemon Squeezy
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${LEMONSQUEEZY_API_URL}${endpoint}`;

  const options = {
    method,
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lemon Squeezy API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Create a checkout session for payment
 * @param {number} amount - Amount in USD
 * @param {object} metadata - Payment metadata (email, plan, paymentId)
 * @returns {object} Checkout session details
 */
async function createPayment(amount, metadata) {
  if (!isConfigured()) {
    return { success: false, error: 'Lemon Squeezy not configured' };
  }

  const { email, plan, paymentId } = metadata;

  try {
    // Get the variant ID for this plan (you'll need to set these in env)
    const variantId = getVariantIdForPlan(plan);

    if (!variantId) {
      return { success: false, error: `No Lemon Squeezy variant configured for plan: ${plan}` };
    }

    // Create checkout session
    const checkoutData = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: email,
            custom: {
              payment_id: paymentId,
              plan: plan
            }
          },
          checkout_options: {
            embed: false,
            media: true,
            logo: true,
            desc: true,
            discount: true,
            button_color: '#7c3aed' // Purple to match Kyward theme
          },
          product_options: {
            enabled_variants: [parseInt(variantId)],
            redirect_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?payment_id=${paymentId}`,
            receipt_button_text: 'Return to Kyward',
            receipt_thank_you_note: 'Thank you for your purchase! Your report is now available.'
          },
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min expiry
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: process.env.LEMONSQUEEZY_STORE_ID
            }
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId
            }
          }
        }
      }
    };

    const response = await apiRequest('/checkouts', 'POST', checkoutData);

    const checkoutUrl = response.data.attributes.url;
    const expiresAt = response.data.attributes.expires_at;

    // Store session for status checking
    paymentSessions.set(paymentId, {
      checkoutId: response.data.id,
      amount,
      email,
      plan,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt
    });

    console.log(`[LemonSqueezy] Created checkout for ${email}, plan: ${plan}, amount: $${amount}`);

    return {
      success: true,
      checkoutUrl,
      checkoutId: response.data.id,
      expiresAt,
      amount,
      currency: 'USD'
    };

  } catch (error) {
    console.error('[LemonSqueezy] Create payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get the Lemon Squeezy variant ID for a plan
 * Variants must be created in your Lemon Squeezy dashboard
 */
function getVariantIdForPlan(plan) {
  const variantMap = {
    essential: process.env.LEMONSQUEEZY_VARIANT_ESSENTIAL,
    sentinel: process.env.LEMONSQUEEZY_VARIANT_SENTINEL,
    consultation: process.env.LEMONSQUEEZY_VARIANT_CONSULTATION,
    consultation_additional: process.env.LEMONSQUEEZY_VARIANT_CONSULTATION_ADDITIONAL
  };
  return variantMap[plan];
}

/**
 * Check payment status
 * @param {string} paymentId - Internal payment ID
 * @returns {object} Payment status
 */
async function checkPayment(paymentId) {
  const session = paymentSessions.get(paymentId);

  if (!session) {
    return { status: 'not_found' };
  }

  // If already confirmed, return cached status
  if (session.status === 'confirmed' || session.status === 'paid') {
    return {
      status: 'confirmed',
      orderId: session.orderId,
      amount: session.amount
    };
  }

  // Check if expired
  if (new Date(session.expiresAt) < new Date()) {
    session.status = 'expired';
    return { status: 'expired' };
  }

  // Payment confirmation is handled by webhook
  // This just returns the current cached status
  return {
    status: session.status,
    amount: session.amount
  };
}

/**
 * Handle webhook from Lemon Squeezy
 * Called when payment is completed
 */
function handleWebhook(event, payload) {
  try {
    const eventName = event;

    if (eventName === 'order_created') {
      const customData = payload.meta?.custom_data || {};
      const paymentId = customData.payment_id;

      if (paymentId && paymentSessions.has(paymentId)) {
        const session = paymentSessions.get(paymentId);
        session.status = 'confirmed';
        session.orderId = payload.data?.id;
        session.confirmedAt = new Date().toISOString();

        console.log(`[LemonSqueezy] Payment confirmed: ${paymentId}, Order: ${session.orderId}`);

        return { success: true, paymentId, status: 'confirmed' };
      }
    }

    return { success: true, handled: false };

  } catch (error) {
    console.error('[LemonSqueezy] Webhook error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(payload, signature) {
  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    console.warn('[LemonSqueezy] No webhook secret configured, skipping verification');
    return true;
  }

  const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/**
 * Mark payment as used/completed
 */
function markPaymentUsed(paymentId, orderId) {
  const session = paymentSessions.get(paymentId);
  if (session) {
    session.status = 'used';
    session.usedAt = new Date().toISOString();
    console.log(`[LemonSqueezy] Marked payment as used: ${paymentId}`);
  }
}

/**
 * Get stats about Lemon Squeezy configuration
 */
function getStats() {
  return {
    configured: isConfigured(),
    hasApiKey: !!process.env.LEMONSQUEEZY_API_KEY,
    hasStoreId: !!process.env.LEMONSQUEEZY_STORE_ID,
    hasWebhookSecret: !!process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    variants: {
      essential: !!process.env.LEMONSQUEEZY_VARIANT_ESSENTIAL,
      sentinel: !!process.env.LEMONSQUEEZY_VARIANT_SENTINEL,
      consultation: !!process.env.LEMONSQUEEZY_VARIANT_CONSULTATION,
      consultationAdditional: !!process.env.LEMONSQUEEZY_VARIANT_CONSULTATION_ADDITIONAL
    },
    activeSessions: paymentSessions.size
  };
}

/**
 * Test API connection
 */
async function testConnection() {
  if (!isConfigured()) {
    return { success: false, error: 'Not configured' };
  }

  try {
    const response = await apiRequest('/users/me');
    return {
      success: true,
      user: response.data.attributes.name,
      email: response.data.attributes.email
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  isConfigured,
  createPayment,
  checkPayment,
  handleWebhook,
  verifyWebhookSignature,
  markPaymentUsed,
  getStats,
  testConnection
};
