// Stripe FIAT Payment Service
// Docs: https://stripe.com/docs/api

const crypto = require('crypto');

function getStripe() {
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
}

function isConfigured() {
  return !!process.env.STRIPE_SECRET_KEY;
}

const PLAN_NAMES = {
  essential: 'Kyward Essential',
  sentinel: 'Kyward Sentinel',
  consultation: 'Bitcoin Security Consultation (1hr)',
  consultation_additional: 'Bitcoin Security Consultation (additional session)'
};

/**
 * Create a Stripe Checkout Session
 */
async function createPayment(amount, metadata) {
  if (!isConfigured()) {
    return { success: false, error: 'Stripe not configured' };
  }

  const { email, plan, paymentId } = metadata;
  const stripe = getStripe();

  try {
    const frontendUrl = process.env.FRONTEND_URL || 'https://kyward.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: PLAN_NAMES[plan] || plan,
            description: 'kyward.com'
          },
          unit_amount: Math.round(amount * 100)
        },
        quantity: 1
      }],
      metadata: {
        payment_id: paymentId,
        plan,
        email
      },
      payment_intent_data: {
        metadata: {
          payment_id: paymentId,
          plan,
          email
        }
      },
      success_url: `${frontendUrl}?payment_success=true&payment_id=${paymentId}`,
      cancel_url: frontendUrl,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60
    });

    console.log(`[Stripe] Created checkout session for ${email}, plan: ${plan}, amount: $${amount}`);

    return {
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      expiresAt: new Date(session.expires_at * 1000).toISOString(),
      amount,
      currency: 'USD'
    };

  } catch (error) {
    console.error('[Stripe] Create payment error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check payment status (Stripe confirms via webhook — this just returns cached status)
 */
function checkPayment(paymentId, sessionStore) {
  const session = sessionStore.get(paymentId);
  if (!session) return { status: 'not_found' };
  return { status: session.status, sessionId: session.sessionId, amount: session.amount };
}

/**
 * Handle Stripe webhook event
 */
function handleWebhook(event) {
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const paymentId = session.metadata?.payment_id;
      const sessionId = session.id;

      if (paymentId) {
        console.log(`[Stripe] checkout.session.completed: paymentId=${paymentId}, sessionId=${sessionId}`);
        return { success: true, paymentId, sessionId, status: 'confirmed' };
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const email = subscription.metadata?.email;
      console.log(`[Stripe] subscription.deleted: email=${email}`);
      return { success: true, email, status: 'cancelled' };
    }

    return { success: true, handled: false };

  } catch (error) {
    console.error('[Stripe] Webhook handling error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify Stripe webhook signature
 */
function verifyWebhookSignature(rawBody, signature) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('[Stripe] No webhook secret configured — skipping verification');
    return true;
  }
  if (!signature) {
    console.warn('[Stripe] Missing stripe-signature header');
    return false;
  }

  try {
    const stripe = getStripe();
    stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
    return true;
  } catch (err) {
    console.warn('[Stripe] Webhook signature invalid:', err.message);
    return false;
  }
}

function getStats() {
  return {
    configured: isConfigured(),
    hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
    hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET
  };
}

module.exports = {
  isConfigured,
  createPayment,
  checkPayment,
  handleWebhook,
  verifyWebhookSignature,
  getStats
};
