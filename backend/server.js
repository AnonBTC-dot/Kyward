// KYWARD BACKEND SERVER
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const bitcoinService = require('./services/bitcoin');
const emailService = require('./services/email');
const paymentStore = require('./services/paymentStore');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Pricing configuration (in USD)
const PRICES = {
  complete: 10,
  consultation: 100
};

// Root route - Mensaje de bienvenida y estado rápido
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding-top: 50px; background: #1a1a1a; color: white; height: 100vh;">
      <h1 style="color: #F7931A;">Kyward API is Online 🚀</h1>
      <p>El backend está funcionando correctamente.</p>
      <div style="margin-top: 20px;">
        <a href="/api/health" style="color: #F7931A; text-decoration: none; border: 1px solid #F7931A; padding: 10px 20px; border-radius: 5px;">
          Verificar Estado del Sistema (Health Check)
        </a>
      </div>
    </div>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get current BTC price
app.get('/api/price', async (req, res) => {
  try {
    const priceData = await bitcoinService.getBtcPrice();
    res.json({
      success: true,
      priceUsd: priceData.price,
      cached: priceData.cached,
      expiresIn: priceData.expiresIn
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get price' });
  }
});

// ============================================
// PAYMENT ENDPOINTS
// ============================================

// Create a new payment request
app.post('/api/payments/create', async (req, res) => {
  try {
    const { email, plan } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ error: 'Email and plan are required' });
    }

    const usdAmount = PRICES[plan];
    if (!usdAmount) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Get real BTC price and calculate amount
    const priceData = await bitcoinService.usdToSats(usdAmount);

    // Generate unique payment address from XPUB
    const paymentId = uuidv4();
    const addressData = await bitcoinService.generatePaymentAddress(paymentId);

    if (!addressData.success) {
      return res.status(500).json({ error: 'Failed to generate payment address: ' + addressData.error });
    }

    // Store payment request
    const payment = {
      id: paymentId,
      email,
      plan,
      usdAmount,
      amountSats: priceData.sats,
      amountBTC: priceData.btcAmount,
      btcPriceUsd: priceData.priceUsd,
      address: addressData.address,
      addressIndex: addressData.index,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min expiry
      priceExpiresAt: new Date(Date.now() + priceData.priceExpiresIn * 1000).toISOString()
    };

    paymentStore.savePayment(payment);

    res.json({
      success: true,
      paymentId,
      address: addressData.address,
      amountBTC: priceData.btcAmount,
      amountSats: priceData.sats,
      usdAmount,
      btcPriceUsd: priceData.priceUsd,
      qrData: `bitcoin:${addressData.address}?amount=${priceData.btcAmount.toFixed(8)}`,
      expiresAt: payment.expiresAt,
      priceExpiresIn: priceData.priceExpiresIn
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Refresh payment amount (recalculate based on new BTC price)
app.post('/api/payments/:paymentId/refresh-price', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = paymentStore.getPayment(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({ error: 'Payment is no longer pending' });
    }

    // Recalculate amount with fresh price
    const priceData = await bitcoinService.usdToSats(payment.usdAmount);

    // Update payment
    payment.amountSats = priceData.sats;
    payment.amountBTC = priceData.btcAmount;
    payment.btcPriceUsd = priceData.priceUsd;
    payment.priceExpiresAt = new Date(Date.now() + priceData.priceExpiresIn * 1000).toISOString();

    paymentStore.savePayment(payment);

    res.json({
      success: true,
      amountBTC: priceData.btcAmount,
      amountSats: priceData.sats,
      btcPriceUsd: priceData.priceUsd,
      qrData: `bitcoin:${payment.address}?amount=${priceData.btcAmount.toFixed(8)}`,
      priceExpiresIn: priceData.priceExpiresIn
    });

  } catch (error) {
    console.error('Refresh price error:', error);
    res.status(500).json({ error: 'Failed to refresh price' });
  }
});

// Check payment status
app.get('/api/payments/:paymentId/status', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = paymentStore.getPayment(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if already confirmed
    if (payment.status === 'confirmed') {
      return res.json({
        success: true,
        status: 'confirmed',
        txid: payment.txid
      });
    }

    // Check blockchain for payment
    const txStatus = await bitcoinService.checkAddressPayment(
      payment.address,
      payment.amountSats
    );

    if (txStatus.paid) {
      // Update payment status
      payment.status = 'confirmed';
      payment.txid = txStatus.txid;
      payment.confirmedAt = new Date().toISOString();
      paymentStore.savePayment(payment);

      // Generate PDF password
      const pdfPassword = generatePdfPassword();

      // Send confirmation email
      await emailService.sendPaymentConfirmation(payment.email, payment.plan, pdfPassword);

      return res.json({
        success: true,
        status: 'confirmed',
        txid: txStatus.txid,
        pdfPassword
      });
    }

    // Check if expired
    if (new Date() > new Date(payment.expiresAt)) {
      payment.status = 'expired';
      paymentStore.savePayment(payment);
      return res.json({ success: true, status: 'expired' });
    }

    // Calculate price expiration
    const priceExpiresAt = new Date(payment.priceExpiresAt);
    const now = new Date();
    const priceExpiresIn = Math.max(0, Math.ceil((priceExpiresAt - now) / 1000));

    res.json({
      success: true,
      status: 'pending',
      confirmations: txStatus.confirmations || 0,
      priceExpiresIn,
      amountBTC: payment.amountBTC,
      amountSats: payment.amountSats
    });

  } catch (error) {
    console.error('Check payment error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// Get payment details
app.get('/api/payments/:paymentId', (req, res) => {
  const { paymentId } = req.params;
  const payment = paymentStore.getPayment(paymentId);

  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  res.json({
    success: true,
    payment: {
      id: payment.id,
      plan: payment.plan,
      usdAmount: payment.usdAmount,
      amountBTC: payment.amountBTC,
      amountSats: payment.amountSats,
      btcPriceUsd: payment.btcPriceUsd,
      address: payment.address,
      status: payment.status,
      createdAt: payment.createdAt,
      expiresAt: payment.expiresAt
    }
  });
});

// ============================================
// EMAIL ENDPOINTS
// ============================================

// Send security plan email
app.post('/api/email/send-plan', async (req, res) => {
  try {
    const { email, pdfPassword, htmlContent } = req.body;

    if (!email || !pdfPassword) {
      return res.status(400).json({ error: 'Email and pdfPassword are required' });
    }

    const result = await emailService.sendSecurityPlan(email, pdfPassword, htmlContent);

    if (result.success) {
      res.json({ success: true, message: 'Email sent successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }

  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generatePdfPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║         KYWARD BACKEND SERVER         ║
╠═══════════════════════════════════════╣
║  Status: Running                      ║
║  Port: ${PORT}                            ║
║  API: http://localhost:${PORT}/api       ║
╚═══════════════════════════════════════╝
  `);

  // Validate configuration
  if (!process.env.XPUB) {
    console.warn('⚠️  WARNING: XPUB not configured in .env file');
    console.warn('   Payment addresses will not be generated correctly.');
  } else {
    console.log('✅ XPUB configured:', process.env.XPUB.substring(0, 20) + '...');
  }

  if (!process.env.SMTP_HOST) {
    console.warn('⚠️  WARNING: Email (SMTP) not configured - emails will be logged to console');
  }
});
