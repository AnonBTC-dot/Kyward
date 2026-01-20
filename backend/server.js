// KYWARD BACKEND SERVER - FULL API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const bitcoinService = require('./services/bitcoin');
const emailService = require('./services/email');
const paymentStore = require('./services/paymentStore');
const db = require('./services/database');

const app = express();
const PORT = process.env.PORT || 3001;

// 1. TRADUCTOR JSON (DEBE IR ANTES QUE LAS RUTAS)
app.use(express.json());

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
  essential: 7.99,               // one-time
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

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      database: !!process.env.SUPABASE_URL,
      email: !!process.env.SMTP_HOST,
      bitcoin: !!process.env.XPUB
    }
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
    const user = await db.getUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: db.sanitizeUser(user)  // ← Usa esta función corregida
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

// Create payment request
app.post('/api/payments/create', async (req, res) => {
  try {
    const { email, plan } = req.body;

    // Validate plan
    if (!PRICES[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Note: Essential repurchase is always allowed - users can buy Essential again
    // after using their one-time assessment to get another assessment

    const usdAmount = PRICES[plan];

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
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
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

// Check payment status
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
        txid: payment.txid
      });
    }

    // Check blockchain for payment
    const txStatus = await bitcoinService.checkAddressPayment(
      payment.address,
      payment.amountSats
    );

    if (txStatus.paid) {
      payment.status = 'confirmed';
      payment.txid = txStatus.txid;
      payment.confirmedAt = new Date().toISOString();
      paymentStore.savePayment(payment);

      // Upgrade user subscription
      const upgradeResult = await db.upgradeSubscription(payment.email, payment.plan);
      const pdfPassword = upgradeResult.pdfPassword;

      if (!upgradeResult.success) {
        console.error('Upgrade falló después de pago confirmado:', upgradeResult);
        // Podrías implementar rollback o notificación manual aquí en producción
      }

      // Send confirmation email
      await emailService.sendPaymentConfirmation(payment.email, payment.plan, pdfPassword);

      return res.json({
        success: true,
        status: 'confirmed',
        txid: txStatus.txid,
        pdfPassword,
        plan: payment.plan
      });
    }

    if (new Date() > new Date(payment.expiresAt)) {
      payment.status = 'expired';
      paymentStore.savePayment(payment);
      return res.json({ success: true, status: 'expired' });
    }

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
    payment.status = 'confirmed';
    payment.txid = 'demo_' + uuidv4();
    payment.confirmedAt = new Date().toISOString();
    paymentStore.savePayment(payment);

    // Upgrade user
    const upgradeResult = await db.upgradeSubscription(payment.email, payment.plan);
    const pdfPassword = upgradeResult.pdfPassword;

    res.json({
      success: true,
      status: 'confirmed',
      txid: payment.txid,
      pdfPassword
    });

  } catch (error) {
    console.error('Simulate payment error:', error);
    res.status(500).json({ error: 'Failed to simulate payment' });
  }
});

// ============================================
// EMAIL ENDPOINTS
// ============================================

// Send security plan email
app.post('/api/email/send-plan', authMiddleware, async (req, res) => {
  try {
    const { htmlContent } = req.body;

    const hasPremium = await db.hasPremiumAccess(req.user.email);
    if (!hasPremium) {
      return res.status(403).json({ error: 'Premium access required' });
    }

    const result = await emailService.sendSecurityPlan(
      req.user.email,
      req.user.pdfPassword,
      htmlContent
    );

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
    console.log('✅ Bitcoin XPUB: Configured');
  } else {
    console.log('⚠️  Bitcoin XPUB: Not configured');
  }

  if (process.env.SMTP_HOST) {
    console.log('✅ Email SMTP: Configured');
  } else {
    console.log('⚠️  Email SMTP: Not configured (emails logged to console)');
  }

  console.log('\n');
});
