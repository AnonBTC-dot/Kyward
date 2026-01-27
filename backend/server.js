// KYWARD BACKEND SERVER - FULL API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const bitcoinService = require('./services/bitcoin');
const emailService = require('./services/email');
const paymentStore = require('./services/paymentStore');
const db = require('./services/database');
const btcpayService = require('./services/btcpay');
const nowpaymentsService = require('./services/nowpayments');
const paymentRouter = require('./services/paymentRouter');

const app = express();
const PORT = process.env.PORT || 3001;

// 1. TRADUCTOR JSON (DEBE IR ANTES QUE LAS RUTAS)
// Increased limit to 10MB for PDF uploads via email
app.use(express.json({ limit: '10mb' }));

// Middleware de CORS mejorado
const allowedOrigins = [
  'https://www.kyward.com',
  'https://kyward.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Permitir peticiones sin origen (como apps móviles, Postman o servidores)
    if (!origin) return callback(null, true);

    // 2. Limpiar el origin de posibles barras finales para evitar errores de comparación
    const cleanOrigin = origin.replace(/\/$/, "");

    // 3. Check if origin is in the allowed list
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // 4. Allow all Vercel preview deployments (dynamic URLs)
    if (cleanOrigin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    console.log('CORS Blocked for origin:', origin);
    callback(new Error('CORS policy: This origin is not allowed'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = await db.validateSession(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  req.user = user;
  req.token = token;
  next();
};

// Pricing configuration (in USD)
// Nota: essential es pago único, sentinel es suscripción mensual recurrente
const PRICES = {
  essential: 9.99,               // one-time
  sentinel: 14.99,               // monthly subscription
  consultation: 99,              // primera sesión
  consultation_additional: 49    // sesiones adicionales
};

// ============================================
// ROOT & HEALTH
// ============================================

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding-top: 50px; background: #1a1a1a; color: white; min-height: 100vh;">
      <h1 style="color: #F7931A;">Kyward API is Online</h1>
      <p>Bitcoin Security Assessment Platform</p>
      <div style="margin-top: 20px;">
        <a href="/api/health" style="color: #F7931A; text-decoration: none; border: 1px solid #F7931A; padding: 10px 20px; border-radius: 5px;">
          Health Check
        </a>
      </div>
    </div>
  `);
});

app.get('/api/health', async (req, res) => {
  const providerHealth = await paymentRouter.healthCheck();

  res.json({
    status: 'ok',
    version: '1.1.0',
    timestamp: new Date().toISOString(),
    services: {
      database: !!process.env.SUPABASE_URL,
      email: !!process.env.SMTP_HOST,
      bitcoin: !!process.env.XPUB,
      btcpay: btcpayService.isConfigured(),
      nowpayments: nowpaymentsService.isConfigured()
    },
    paymentProviders: providerHealth
  });
});

// ============================================
// AUTH ENDPOINTS
// ============================================

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const result = await db.createUser(email.toLowerCase(), password);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    // Auto-login after signup
    const loginResult = await db.loginUser(email.toLowerCase(), password);

    res.json({
      success: true,
      user: loginResult.user,
      token: loginResult.token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await db.loginUser(email.toLowerCase(), password);

    if (!result.success) {
      return res.status(401).json({ error: result.message });
    }

    res.json({
      success: true,
      user: result.user,
      token: result.token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
app.post('/api/auth/logout', authMiddleware, async (req, res) => {
  try {
    await db.logout(req.token);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Validate session
app.get('/api/auth/validate', authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Check if email exists
app.post('/api/auth/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await db.userExists(email.toLowerCase());
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check email' });
  }
});

// Reset password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const exists = await db.userExists(email.toLowerCase());
    if (!exists) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    const result = await db.resetPassword(email.toLowerCase(), newPassword);
    res.json(result);

  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// ============================================
// USER ENDPOINTS
// ============================================

// Get current user
app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    console.log('/api/user - Fetching user:', req.user.email);
    const user = await db.getUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('/api/user - Returning user with subscription:', user.subscriptionLevel);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error en /api/user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Get user usage status
app.get('/api/user/usage', authMiddleware, async (req, res) => {
  try {
    const result = await db.canTakeAssessment(req.user.email);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get usage status' });
  }
});

// Update email preferences
app.post('/api/user/preferences', authMiddleware, async (req, res) => {
  try {
    const { dailyTips, securityAlerts, monthlyReviews } = req.body;

    const result = await db.updateEmailPreferences(req.user.email, {
      dailyTips,
      securityAlerts,
      monthlyReviews
    });

    if (result.success) {
      res.json({ success: true, user: result.user });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Check premium access
app.get('/api/user/premium', authMiddleware, async (req, res) => {
  try {
    const hasPremium = await db.hasPremiumAccess(req.user.email);
    res.json({ hasPremium });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check premium status' });
  }
});

// ============================================
// ASSESSMENT ENDPOINTS
// ============================================

// Save assessment
app.post('/api/assessments', authMiddleware, async (req, res) => {
  try {
    const { score, responses, timestamp } = req.body;

    console.log('POST /api/assessments - Body recibido:', req.body);
    console.log('Usuario autenticado:', req.user.email, req.user.id);

    if (score === undefined || !responses) {
      return res.status(400).json({ error: 'Score and responses are required' });
    }

    const canTake = await db.canTakeAssessment(req.user.email);
    if (!canTake.canTake) {
      return res.status(403).json({ error: 'Monthly assessment limit reached. Upgrade to premium.' });
    }

    const success = await db.saveAssessment(req.user.id, score, responses, timestamp || new Date().toISOString());

    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to save assessment' });
    }
  } catch (error) {
    console.error('Save assessment error:', error);
    res.status(500).json({ error: error.message || 'Failed to save assessment' });
  }
});

// Get user assessments
app.get('/api/assessments', authMiddleware, async (req, res) => {
  try {
    const assessments = await db.getUserAssessments(req.user.email);
    res.json({ success: true, assessments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get assessments' });
  }
});

// ============================================
// COMMUNITY STATS
// ============================================

// Get community stats
app.get('/api/stats/community', async (req, res) => {
  try {
    const stats = await db.getCommunityStats();
    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get community stats' });
  }
});

// Compare score to community
app.get('/api/stats/compare/:score', async (req, res) => {
  try {
    const score = parseInt(req.params.score);
    if (isNaN(score) || score < 0 || score > 100) {
      return res.status(400).json({ error: 'Invalid score' });
    }

    const comparison = await db.compareToAverage(score);
    res.json({ success: true, ...comparison });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compare score' });
  }
});

// ============================================
// PRICE ENDPOINTS
// ============================================

app.get('/api/pricing', (req, res) => {
  res.json({
    success: true,
    plans: {
      free: {
        price: 0,
        period: 'forever',
        type: 'free',
        currency: 'USD'
      },
      essential: {
        price: PRICES.essential,
        period: 'one-time',
        type: 'one_time',
        currency: 'USD'
      },
      sentinel: {
        price: PRICES.sentinel,
        period: 'month',
        type: 'subscription',
        currency: 'USD'
      },
      consultation: {
        firstSession: PRICES.consultation,
        additionalSession: PRICES.consultation_additional,
        type: 'consultation',
        currency: 'USD'
      }
    }
  });
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

// Get available payment methods
app.get('/api/payments/methods', (req, res) => {
  try {
    const methods = paymentRouter.getAvailablePaymentMethods();
    res.json({
      success: true,
      methods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to get payment methods' });
  }
});

// Create payment request (unified endpoint)
app.post('/api/payments/create', async (req, res) => {
  try {
    const { email, plan, paymentMethod, network } = req.body;

    // Validate plan
    if (!PRICES[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Note: Essential repurchase is always allowed - users can buy Essential again
    // after using their one-time assessment to get another assessment

    const paymentId = uuidv4();

    // If no payment method specified, default to 'onchain' for backwards compatibility
    const method = paymentMethod || 'onchain';

    // Use the unified payment router
    const result = await paymentRouter.createPayment({
      method,
      network,
      plan,
      email,
      paymentId
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Store payment request with provider info
    const payment = {
      id: paymentId,
      email,
      plan,
      amount: PRICES[plan],
      provider: result.provider,
      method: result.method,
      network: result.network,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: result.expiresAt || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      // Provider-specific data
      invoiceId: result.invoiceId,
      nowpaymentsId: result.nowpaymentsId,
      address: result.address,
      sats: result.sats,
      // Full payment data for status checks
      paymentData: result
    };

    paymentStore.savePayment(payment);

    // Return unified response
    res.json({
      success: true,
      paymentId,
      provider: result.provider,
      method: result.method,
      network: result.network,
      // Payment details
      address: result.address,
      invoice: result.invoice,
      qrData: result.qrData,
      amount: result.amount,
      currency: result.currency,
      // BTC-specific
      btcAmount: result.btcAmount,
      sats: result.sats,
      priceUsd: result.priceUsd,
      // USDT-specific
      payAmount: result.payAmount,
      payCurrency: result.payCurrency,
      networkName: result.networkName,
      networkFee: result.networkFee,
      // Links
      checkoutLink: result.checkoutLink,
      paymentLink: result.paymentLink,
      // Timing
      expiresAt: result.expiresAt,
      reused: result.reused
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Refresh payment price
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

    const priceData = await bitcoinService.usdToSats(payment.usdAmount);

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

// Check payment status (unified endpoint for all providers)
app.get('/api/payments/:paymentId/status', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = paymentStore.getPayment(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status === 'confirmed') {
      return res.json({
        success: true,
        status: 'confirmed',
        txid: payment.txid,
        provider: payment.provider,
        method: payment.method
      });
    }

    // Check payment status based on provider
    const statusResult = await paymentRouter.checkPaymentStatus(
      paymentId,
      payment.provider,
      payment.paymentData || payment
    );

    if (!statusResult.success) {
      // Fall back to checking expired status
      if (new Date() > new Date(payment.expiresAt)) {
        paymentStore.updateStatus(paymentId, 'expired');
        return res.json({ success: true, status: 'expired' });
      }
      return res.json({
        success: true,
        status: 'pending',
        error: statusResult.error
      });
    }

    // Payment confirmed
    if (statusResult.status === 'confirmed' || statusResult.paid) {
      paymentStore.updateStatus(paymentId, 'confirmed', {
        txid: statusResult.txid,
        confirmedAt: new Date().toISOString()
      });

      // Mark payment as used in provider
      paymentRouter.markPaymentUsed(payment.provider, payment.paymentData || payment, payment.email);

      // Upgrade user subscription
      const upgradeResult = await db.upgradeSubscription(payment.email, payment.plan);
      const pdfPassword = upgradeResult.pdfPassword;

      if (!upgradeResult.success) {
        console.error('Upgrade failed after payment confirmed:', upgradeResult);
      }

      // Get user's language preference for email
      const user = await db.getUserByEmail(payment.email);
      const userLanguage = user?.language_preference || user?.preferred_language || 'en';

      // Send confirmation email (plan-specific, translated)
      await emailService.sendPaymentConfirmation(payment.email, payment.plan, userLanguage);

      return res.json({
        success: true,
        status: 'confirmed',
        txid: statusResult.txid,
        pdfPassword,
        plan: payment.plan,
        provider: payment.provider,
        method: payment.method
      });
    }

    // On-chain specific: check for invalid amount
    if (payment.method === 'onchain' && statusResult.receivedSats > 0 && statusResult.status !== 'confirmed') {
      return res.json({
        success: true,
        status: 'invalid_amount',
        receivedSats: statusResult.receivedSats,
        expectedSats: statusResult.expectedSats,
        message: 'Payment received but amount does not match'
      });
    }

    // Check if expired
    if (statusResult.status === 'expired' || new Date() > new Date(payment.expiresAt)) {
      paymentStore.updateStatus(paymentId, 'expired');
      return res.json({ success: true, status: 'expired' });
    }

    // Still pending
    res.json({
      success: true,
      status: 'pending',
      provider: payment.provider,
      method: payment.method,
      providerStatus: statusResult.providerStatus,
      confirmations: statusResult.confirmations || 0
    });

  } catch (error) {
    console.error('Check payment error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// Simulate payment (demo mode)
app.post('/api/payments/:paymentId/simulate', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = paymentStore.getPayment(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Only allow in demo mode
    if (process.env.NODE_ENV === 'production' && !process.env.DEMO_MODE) {
      return res.status(403).json({ error: 'Simulation not allowed in production' });
    }

    // Simulate confirmation
    paymentStore.updateStatus(paymentId, 'confirmed', {
      txid: 'demo_' + uuidv4(),
      confirmedAt: new Date().toISOString()
    });

    // Mark payment as used in provider
    paymentRouter.markPaymentUsed(payment.provider, payment.paymentData || payment, payment.email);

    // Upgrade user
    const upgradeResult = await db.upgradeSubscription(payment.email, payment.plan);
    const pdfPassword = upgradeResult.pdfPassword;

    res.json({
      success: true,
      status: 'confirmed',
      txid: 'demo_' + paymentId,
      pdfPassword
    });

  } catch (error) {
    console.error('Simulate payment error:', error);
    res.status(500).json({ error: 'Failed to simulate payment' });
  }
});

// ============================================
// PAYMENT WEBHOOKS
// ============================================

// BTCPay Server webhook (Lightning + Liquid)
// IMPORTANT: This must be before express.json() middleware OR use raw body
app.post('/api/webhooks/btcpay', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    const signature = req.headers['btcpay-sig'];
    const rawBody = req.body;

    // Verify webhook signature
    if (!btcpayService.verifyWebhookSignature(rawBody, signature)) {
      console.warn('BTCPay webhook: Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody.toString());
    console.log(`BTCPay webhook received: ${event.type} for invoice ${event.invoiceId}`);

    // Process the event
    const processed = btcpayService.processWebhookEvent(event);

    if (processed.isPaymentComplete) {
      // Find payment by invoice ID
      const payment = paymentStore.getByInvoiceId(processed.invoiceId);

      if (payment) {
        // Update payment status
        paymentStore.updateStatus(payment.id, 'confirmed', {
          confirmedAt: new Date().toISOString()
        });

        // Upgrade user subscription
        const upgradeResult = await db.upgradeSubscription(payment.email, payment.plan);

        if (upgradeResult.success) {
          console.log(`BTCPay webhook: Upgraded ${payment.email} to ${payment.plan}`);

          // Get user's language preference for email
          const user = await db.getUserByEmail(payment.email);
          const userLanguage = user?.language_preference || user?.preferred_language || 'en';

          // Send confirmation email (plan-specific, translated)
          await emailService.sendPaymentConfirmation(payment.email, payment.plan, userLanguage);
        } else {
          console.error('BTCPay webhook: Upgrade failed:', upgradeResult);
        }
      } else {
        console.warn(`BTCPay webhook: No payment found for invoice ${processed.invoiceId}`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('BTCPay webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// NOWPayments IPN webhook (USDT)
app.post('/api/webhooks/nowpayments', async (req, res) => {
  try {
    const signature = req.headers['x-nowpayments-sig'];

    // Verify IPN signature
    if (!nowpaymentsService.verifyIpnSignature(req.body, signature)) {
      console.warn('NOWPayments IPN: Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log(`NOWPayments IPN received: ${req.body.payment_status} for payment ${req.body.payment_id}`);

    // Process the event
    const processed = nowpaymentsService.processIpnEvent(req.body);

    if (processed.isPaymentComplete) {
      // Find payment by order_id (our internal paymentId)
      const payment = paymentStore.getPayment(processed.orderId) ||
                      paymentStore.getByNowpaymentsId(processed.paymentId);

      if (payment) {
        // Update payment status
        paymentStore.updateStatus(payment.id, 'confirmed', {
          confirmedAt: new Date().toISOString(),
          actuallyPaid: processed.actuallyPaid
        });

        // Upgrade user subscription
        const upgradeResult = await db.upgradeSubscription(payment.email, payment.plan);

        if (upgradeResult.success) {
          console.log(`NOWPayments IPN: Upgraded ${payment.email} to ${payment.plan}`);

          // Get user's language preference for email
          const user = await db.getUserByEmail(payment.email);
          const userLanguage = user?.language_preference || user?.preferred_language || 'en';

          // Send confirmation email (plan-specific, translated)
          await emailService.sendPaymentConfirmation(payment.email, payment.plan, userLanguage);
        } else {
          console.error('NOWPayments IPN: Upgrade failed:', upgradeResult);
        }
      } else {
        console.warn(`NOWPayments IPN: No payment found for order ${processed.orderId}`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('NOWPayments IPN error:', error);
    res.status(500).json({ error: 'IPN processing failed' });
  }
});

// ============================================
// EMAIL ENDPOINTS
// ============================================

// Check email configuration status
app.get('/api/email/status', async (req, res) => {
  try {
    const provider = process.env.RESEND_API_KEY ? 'resend' :
                     process.env.SMTP_HOST ? 'smtp' : 'none';

    const status = {
      provider,
      configured: provider !== 'none'
    };

    if (provider === 'resend') {
      status.apiKey = process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 8)}...` : null;
      status.from = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'default';
    } else if (provider === 'smtp') {
      status.host = process.env.SMTP_HOST ? `${process.env.SMTP_HOST.substring(0, 10)}...` : null;
      status.port = process.env.SMTP_PORT || '587';
      status.user = process.env.SMTP_USER ? `${process.env.SMTP_USER.substring(0, 5)}...` : null;
      status.from = process.env.SMTP_FROM || 'default';
    }

    if (status.configured) {
      const verifyResult = await emailService.verifySmtpConnection();
      status.verified = verifyResult.success;
      status.verifyError = verifyResult.error || null;
    }

    res.json(status);
  } catch (error) {
    console.error('Email status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send security plan email with PDF attachment
app.post('/api/email/send-plan', authMiddleware, async (req, res) => {
  try {
    const { pdfBase64, score } = req.body;

    const hasPremium = await db.hasPremiumAccess(req.user.email);
    if (!hasPremium) {
      return res.status(403).json({ error: 'Premium access required' });
    }

    if (!req.user.pdfPassword) {
      return res.status(400).json({ error: 'No PDF password found. Please contact support.' });
    }

    if (!pdfBase64) {
      return res.status(400).json({ error: 'PDF data is required' });
    }

    console.log('📧 Sending security plan with PDF to:', req.user.email);

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    const result = await emailService.sendEmailWithPdfAttachment(
      req.user.email,
      req.user.pdfPassword,
      score || 0,
      pdfBuffer
    );

    if (result.success) {
      res.json({ success: true, message: 'Email with PDF sent successfully' });
    } else {
      res.status(500).json({ error: result.error });
    }

  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ============================================
// TELEGRAM BOT INTEGRATION ENDPOINTS
// ============================================

// Start Telegram linking process (dashboard initiates this)
app.post('/api/telegram/link/start', authMiddleware, async (req, res) => {
  try {
    const result = await db.initiateTelegramLink(req.user.id);

    if (!result.success) {
      if (result.alreadyLinked) {
        return res.status(400).json({ error: 'Telegram already linked to this account' });
      }
      return res.status(500).json({ error: result.message });
    }

    res.json({
      success: true,
      verificationCode: result.verificationCode,
      expiresAt: result.expiresAt,
      instructions: `Send this code to @BTCGuardianBot: /link ${result.verificationCode}`
    });
  } catch (error) {
    console.error('Telegram link start error:', error);
    res.status(500).json({ error: 'Failed to start Telegram linking' });
  }
});

// Verify Telegram link (called by the bot)
app.post('/api/telegram/link/verify', async (req, res) => {
  try {
    const { verificationCode, telegramUserId, telegramUsername, telegramFirstName } = req.body;

    if (!verificationCode || !telegramUserId) {
      return res.status(400).json({ error: 'Verification code and Telegram user ID are required' });
    }

    const result = await db.verifyTelegramLink(
      verificationCode.toUpperCase(),
      telegramUserId,
      telegramUsername || null,
      telegramFirstName || null
    );

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.json({
      success: true,
      email: result.email,
      subscriptionLevel: result.subscriptionLevel,
      subscriptionEnd: result.subscriptionEnd,
      message: 'Telegram account linked successfully!'
    });
  } catch (error) {
    console.error('Telegram verify error:', error);
    res.status(500).json({ error: 'Failed to verify Telegram link' });
  }
});

// Check subscription status (called by bot before allowing features)
app.get('/api/telegram/subscription/:telegram_user_id', async (req, res) => {
  try {
    const telegramUserId = parseInt(req.params.telegram_user_id);

    if (isNaN(telegramUserId)) {
      return res.status(400).json({ error: 'Invalid Telegram user ID' });
    }

    const result = await db.checkSentinelSubscription(telegramUserId);

    res.json(result);
  } catch (error) {
    console.error('Telegram subscription check error:', error);
    res.status(500).json({ error: 'Failed to check subscription' });
  }
});

// Get Telegram link status for dashboard
app.get('/api/telegram/status', authMiddleware, async (req, res) => {
  try {
    const link = await db.getTelegramLink(req.user.id);

    if (!link) {
      return res.json({
        linked: false,
        canLink: req.user.subscriptionLevel === 'sentinel' || req.user.subscriptionLevel === 'consultation'
      });
    }

    res.json({
      linked: link.is_verified,
      telegramUsername: link.telegram_username,
      telegramFirstName: link.telegram_first_name,
      linkedAt: link.linked_at,
      canLink: req.user.subscriptionLevel === 'sentinel' || req.user.subscriptionLevel === 'consultation',
      pendingVerification: !link.is_verified && link.verification_code
    });
  } catch (error) {
    console.error('Telegram status error:', error);
    res.status(500).json({ error: 'Failed to get Telegram status' });
  }
});

// Unlink Telegram account
app.post('/api/telegram/unlink', authMiddleware, async (req, res) => {
  try {
    const result = await db.unlinkTelegram(req.user.id);

    if (!result.success) {
      return res.status(500).json({ error: result.message });
    }

    res.json({ success: true, message: 'Telegram unlinked successfully' });
  } catch (error) {
    console.error('Telegram unlink error:', error);
    res.status(500).json({ error: 'Failed to unlink Telegram' });
  }
});

// ============================================
// BTC GUARDIAN WALLET MANAGEMENT ENDPOINTS
// ============================================

// Get all monitored wallets for a Telegram user
app.get('/api/wallets/:telegram_user_id', async (req, res) => {
  try {
    const telegramUserId = parseInt(req.params.telegram_user_id);
    if (isNaN(telegramUserId)) {
      return res.status(400).json({ error: 'Invalid Telegram user ID' });
    }

    const wallets = await db.getMonitoredWallets(telegramUserId);
    res.json({ success: true, wallets });
  } catch (error) {
    console.error('Get wallets error:', error);
    res.status(500).json({ error: 'Failed to get wallets' });
  }
});

// Add a monitored wallet
app.post('/api/wallets', async (req, res) => {
  try {
    const { telegramUserId, address, label, addressType } = req.body;

    if (!telegramUserId || !address) {
      return res.status(400).json({ error: 'Telegram user ID and address are required' });
    }

    const result = await db.addMonitoredWallet(
      telegramUserId,
      address,
      label || '',
      addressType || 'single'
    );

    if (!result.success) {
      if (result.duplicate) {
        return res.status(409).json({ error: result.message, duplicate: true });
      }
      return res.status(400).json({ error: result.message });
    }

    res.json({ success: true, wallet: result.wallet });
  } catch (error) {
    console.error('Add wallet error:', error);
    res.status(500).json({ error: 'Failed to add wallet' });
  }
});

// Remove a monitored wallet
app.delete('/api/wallets/:telegram_user_id/:address', async (req, res) => {
  try {
    const telegramUserId = parseInt(req.params.telegram_user_id);
    const address = req.params.address;

    if (isNaN(telegramUserId)) {
      return res.status(400).json({ error: 'Invalid Telegram user ID' });
    }

    const result = await db.removeMonitoredWallet(telegramUserId, address);

    if (!result.success) {
      return res.status(500).json({ error: result.message });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Remove wallet error:', error);
    res.status(500).json({ error: 'Failed to remove wallet' });
  }
});

// Update wallet balance
app.put('/api/wallets/:telegram_user_id/:address/balance', async (req, res) => {
  try {
    const telegramUserId = parseInt(req.params.telegram_user_id);
    const address = req.params.address;
    const { btcBalance, usdBalance } = req.body;

    if (isNaN(telegramUserId)) {
      return res.status(400).json({ error: 'Invalid Telegram user ID' });
    }

    const success = await db.updateWalletBalance(telegramUserId, address, btcBalance, usdBalance);

    if (!success) {
      return res.status(500).json({ error: 'Failed to update balance' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update balance error:', error);
    res.status(500).json({ error: 'Failed to update balance' });
  }
});

// ============================================
// BTC GUARDIAN BOT PREFERENCES ENDPOINTS
// ============================================

// Get bot preferences
app.get('/api/bot/preferences/:telegram_user_id', async (req, res) => {
  try {
    const telegramUserId = parseInt(req.params.telegram_user_id);
    if (isNaN(telegramUserId)) {
      return res.status(400).json({ error: 'Invalid Telegram user ID' });
    }

    const preferences = await db.getBotPreferences(telegramUserId);
    res.json({ success: true, preferences });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Failed to get preferences' });
  }
});

// Update bot preferences
app.put('/api/bot/preferences/:telegram_user_id', async (req, res) => {
  try {
    const telegramUserId = parseInt(req.params.telegram_user_id);
    if (isNaN(telegramUserId)) {
      return res.status(400).json({ error: 'Invalid Telegram user ID' });
    }

    const result = await db.updateBotPreferences(telegramUserId, req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get all active bot users (for monitoring)
app.get('/api/bot/active-users', async (req, res) => {
  try {
    // Verify bot API key
    const apiKey = req.headers['x-bot-api-key'];
    const expectedKey = process.env.BOT_API_KEY;

    if (!apiKey || apiKey !== expectedKey) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const users = await db.getActiveBotUsers();
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get active users error:', error);
    res.status(500).json({ error: 'Failed to get active users' });
  }
});

// ============================================
// BTC GUARDIAN TRANSACTION TRACKING ENDPOINTS
// ============================================

// Check if transaction was seen
app.get('/api/transactions/seen/:txid', async (req, res) => {
  try {
    const seen = await db.isTransactionSeen(req.params.txid);
    res.json({ success: true, seen });
  } catch (error) {
    console.error('Check transaction error:', error);
    res.status(500).json({ error: 'Failed to check transaction' });
  }
});

// Mark transaction as seen
app.post('/api/transactions/seen', async (req, res) => {
  try {
    const { txid, walletAddress, amountBtc, txType } = req.body;

    if (!txid) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const success = await db.markTransactionSeen(txid, null, walletAddress, amountBtc, txType);
    res.json({ success });
  } catch (error) {
    console.error('Mark transaction error:', error);
    res.status(500).json({ error: 'Failed to mark transaction' });
  }
});

// ============================================
// BTC GUARDIAN HISTORICAL BALANCES ENDPOINTS
// ============================================

// Save historical balance
app.post('/api/balances/history', async (req, res) => {
  try {
    const { telegramUserId, walletAddress, btcBalance, usdBalance } = req.body;

    if (!telegramUserId || !walletAddress) {
      return res.status(400).json({ error: 'Telegram user ID and wallet address are required' });
    }

    const success = await db.saveHistoricalBalance(telegramUserId, walletAddress, btcBalance, usdBalance);
    res.json({ success });
  } catch (error) {
    console.error('Save history error:', error);
    res.status(500).json({ error: 'Failed to save balance history' });
  }
});

// Get historical balances for charts
app.get('/api/balances/history/:telegram_user_id', async (req, res) => {
  try {
    const telegramUserId = parseInt(req.params.telegram_user_id);
    const days = parseInt(req.query.days) || 30;

    if (isNaN(telegramUserId)) {
      return res.status(400).json({ error: 'Invalid Telegram user ID' });
    }

    const history = await db.getHistoricalBalances(telegramUserId, days);
    res.json({ success: true, ...history });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get balance history' });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║          KYWARD BACKEND SERVER            ║
╠═══════════════════════════════════════════╣
║  Status: Running                          ║
║  Port: ${PORT}                                ║
║  API: http://localhost:${PORT}/api/health           ║
╚═══════════════════════════════════════════╝
  `);

  // Validate configuration
  console.log('\n📋 Configuration Status:');

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    console.log('✅ Supabase: Configured');
  } else {
    console.log('⚠️  Supabase: Not configured (using in-memory fallback)');
  }

  if (process.env.XPUB) {
    console.log('✅ Bitcoin XPUB (On-chain): Configured');
  } else {
    console.log('⚠️  Bitcoin XPUB: Not configured');
  }

  if (btcpayService.isConfigured()) {
    console.log('✅ BTCPay Server (Lightning/Liquid): Configured');
  } else {
    console.log('⚠️  BTCPay Server: Not configured');
  }

  if (nowpaymentsService.isConfigured()) {
    console.log('✅ NOWPayments (USDT): Configured');
  } else {
    console.log('⚠️  NOWPayments: Not configured');
  }

  if (process.env.SMTP_HOST || process.env.RESEND_API_KEY) {
    console.log('✅ Email: Configured');
  } else {
    console.log('⚠️  Email: Not configured (emails logged to console)');
  }

  // Show available payment methods
  const methods = paymentRouter.getAvailablePaymentMethods();
  console.log(`\n💳 Available Payment Methods: ${methods.map(m => m.name).join(', ') || 'None'}`);

  console.log('\n');
});
