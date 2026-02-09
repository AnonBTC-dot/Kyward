# Lemon Squeezy Deployment Guide

This guide walks you through setting up Lemon Squeezy as a FIAT payment method for Kyward.

## Current Status

**Coming Soon** - The integration is built but marked as `comingSoon: true` in the frontend. Once you complete the setup below, change `comingSoon: false` in `src/components/PaymentMethodSelector.jsx` to enable it.

---

## Step 1: Create Lemon Squeezy Account

1. Go to [https://lemonsqueezy.com](https://lemonsqueezy.com)
2. Sign up for an account
3. Complete the onboarding process (requires NIT/Tax ID)
4. Verify your identity and payment details

---

## Step 2: Create Your Store

1. Go to **Dashboard > Settings > Stores**
2. Create a new store or use the default one
3. **Copy your Store ID** - you'll need this for `LEMONSQUEEZY_STORE_ID`

---

## Step 3: Create Products and Variants

You need to create a product for each plan with the correct pricing:

### Product 1: Essential Report
- **Name**: Essential Report
- **Price**: $9.99 USD (one-time)
- **Description**: Complete exposure report with PDF password protection
- After creating, go to **Variants** and copy the **Variant ID**

### Product 2: Sentinel Subscription
- **Name**: Sentinel Monthly
- **Price**: $14.99 USD/month (subscription)
- **Description**: Monthly monitoring and alerts
- Copy the **Variant ID**

### Product 3: Consultation
- **Name**: Security Consultation
- **Price**: $99 USD (one-time)
- **Description**: 1-hour expert consultation session
- Copy the **Variant ID**

### Product 4: Additional Consultation Hours
- **Name**: Additional Consultation
- **Price**: $49 USD (one-time)
- **Description**: Extra consultation hours
- Copy the **Variant ID**

---

## Step 4: Get API Key

1. Go to **Dashboard > Settings > API**
2. Click **Create API Key**
3. Give it a name (e.g., "Kyward Production")
4. **Copy the API key** - save it securely, you won't see it again!

---

## Step 5: Set Up Webhook

1. Go to **Dashboard > Settings > Webhooks**
2. Click **Create Webhook**
3. Configure:
   - **URL**: `https://your-backend-domain.com/api/payments/webhook/lemonsqueezy`
   - **Events**: Select `order_created`
4. Click **Create**
5. **Copy the Signing Secret** - you'll need this for `LEMONSQUEEZY_WEBHOOK_SECRET`

---

## Step 6: Configure Environment Variables

Add these to your `backend/.env` file:

```env
# ===========================================
# LEMON SQUEEZY (FIAT PAYMENTS)
# ===========================================
LEMONSQUEEZY_API_KEY=your-api-key-here
LEMONSQUEEZY_STORE_ID=your-store-id-here
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret-here

# Product Variant IDs (from Step 3)
LEMONSQUEEZY_VARIANT_ESSENTIAL=123456
LEMONSQUEEZY_VARIANT_SENTINEL=123457
LEMONSQUEEZY_VARIANT_CONSULTATION=123458
LEMONSQUEEZY_VARIANT_CONSULTATION_ADDITIONAL=123459
```

---

## Step 7: Add Webhook Endpoint to Backend

Add this endpoint to your `backend/server.js`:

```javascript
// Lemon Squeezy Webhook
app.post('/api/payments/webhook/lemonsqueezy', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-signature'];
  const payload = req.body.toString();

  // Verify signature
  const lemonsqueezy = require('./services/lemonsqueezy');
  if (!lemonsqueezy.verifyWebhookSignature(payload, signature)) {
    console.error('[Webhook] Invalid Lemon Squeezy signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  try {
    const event = JSON.parse(payload);
    const eventName = event.meta?.event_name;

    console.log(`[Webhook] Lemon Squeezy event: ${eventName}`);

    const result = lemonsqueezy.handleWebhook(eventName, event);

    if (result.success && result.status === 'confirmed') {
      // Payment confirmed - upgrade user subscription
      const paymentId = result.paymentId;
      // Add your subscription upgrade logic here
      // Similar to how you handle other payment confirmations
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Lemon Squeezy error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});
```

---

## Step 8: Enable the Payment Method

Once everything is configured:

1. Open `src/components/PaymentMethodSelector.jsx`
2. Find the `lemonsqueezy` entry in `PAYMENT_METHODS` array
3. Change `comingSoon: true` to `comingSoon: false`

```javascript
{
  id: 'lemonsqueezy',
  name: 'Credit/Debit Card',
  icon: 'card',
  badge: 'Secure',
  description: 'Visa, Mastercard, PayPal & more',
  time: '< 1 minute',
  color: '#7c3aed',
  comingSoon: false  // <-- Change this to false
}
```

---

## Step 9: Test the Integration

1. Restart your backend server
2. Visit your payment page
3. The "Credit/Debit Card" option should now be available
4. Click it and verify you're redirected to Lemon Squeezy checkout
5. Complete a test payment using Lemon Squeezy test mode

---

## Troubleshooting

### Payment method not showing
- Check that all environment variables are set
- Verify `lemonsqueezy.isConfigured()` returns `true`
- Check backend logs for errors

### Webhook not receiving events
- Verify webhook URL is publicly accessible (not localhost)
- Check webhook secret is correct
- Look at Lemon Squeezy webhook logs in dashboard

### Checkout not creating
- Verify variant IDs are correct
- Check API key has proper permissions
- Look at backend logs for API errors

---

## API Reference

### Check configuration status
```javascript
const lemonsqueezy = require('./services/lemonsqueezy');
console.log(lemonsqueezy.getStats());
```

### Test API connection
```javascript
const result = await lemonsqueezy.testConnection();
console.log(result);
// { success: true, user: 'Your Name', email: 'your@email.com' }
```

---

## Files Modified

- `backend/services/lemonsqueezy.js` - Main service file
- `backend/services/paymentRouter.js` - Added provider and routing
- `src/components/PaymentMethodSelector.jsx` - Added UI option
- `src/components/PaymentModal.jsx` - Added redirect flow handling
- `backend/.env.example` - Added configuration template

---

## Security Notes

- Never commit your API key to version control
- Use environment variables for all sensitive data
- Always verify webhook signatures
- Use HTTPS for webhook endpoints in production
