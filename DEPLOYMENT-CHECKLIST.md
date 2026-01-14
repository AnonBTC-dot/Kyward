# Kyward Complete Deployment Guide

## Project Overview

**Kyward** - Bitcoin Security Assessment Platform
- Multi-language support (English/Spanish)
- Bitcoin payment processing with real-time BTC pricing
- Supabase PostgreSQL database
- Subscription plans: Complete ($7.99/month), Consultation ($99 first / $49 additional)

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend       │────▶│   Supabase      │
│   (Vercel)      │     │   (Railway)     │     │   (Database)    │
│   React + Vite  │     │   Express.js    │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────────┐
                        │   mempool.space │
                        │   (BTC Price)   │
                        └─────────────────┘
```

---

## Quick Start (Local Development)

### Terminal 1 - Frontend:
```bash
cd C:\Users\Leonardo\Desktop\Kyward
npm install
cp .env.example .env
npm run dev
```
Opens at: http://localhost:3000 (or 5173 for Vite)

### Terminal 2 - Backend:
```bash
cd C:\Users\Leonardo\Desktop\Kyward\backend
npm install
cp .env.example .env
npm run dev
```
Opens at: http://localhost:3001

---

## Step-by-Step Deployment

### 1. Supabase Database Setup

1. Go to **supabase.com** and create account
2. Create new project (choose a region close to your users)
3. Wait for project to initialize (~2 minutes)
4. Go to **SQL Editor** and run this schema:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  subscription_level TEXT DEFAULT 'free',
  subscription_start TIMESTAMPTZ,
  subscription_end TIMESTAMPTZ,
  pdf_password TEXT,
  consultation_count INTEGER DEFAULT 0,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  responses JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session tokens table
CREATE TABLE session_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_id TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL,
  amount_usd DECIMAL(10,2) NOT NULL,
  amount_btc DECIMAL(16,8),
  btc_address TEXT,
  status TEXT DEFAULT 'pending',
  txid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ
);

-- Community stats table (aggregated data)
CREATE TABLE community_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_assessments INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 50,
  score_distribution JSONB DEFAULT '{"0-20": 10, "21-40": 20, "41-60": 35, "61-80": 25, "81-100": 10}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial community stats
INSERT INTO community_stats (total_assessments, average_score)
VALUES (0, 50);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_session_tokens_token ON session_tokens(token);
CREATE INDEX idx_payments_payment_id ON payments(payment_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
```

5. Go to **Settings → API** and copy:
   - **Project URL** (e.g., `https://xxxx.supabase.co`)
   - **service_role key** (secret, for backend only)

---

### 2. Get Your Bitcoin XPUB

Choose ONE wallet for receiving payments:

**Sparrow Wallet (Recommended):**
1. Download from sparrowwallet.com
2. Create new wallet or open existing
3. Settings → View Extended Public Key
4. Copy the `zpub...` key

**Electrum:**
1. Open Electrum
2. Wallet → Information
3. Copy Master Public Key

**BlueWallet:**
1. Open your wallet
2. Wallet → Export/Backup → Watch-only
3. Copy the xpub/zpub

---

### 3. Email Setup (Gmail SMTP)

1. Go to myaccount.google.com
2. Security → 2-Step Verification (enable if not done)
3. Security → App passwords
4. Create new app password for "Mail"
5. Copy the 16-character password

**Alternative: Brevo (free, recommended for production)**
1. Sign up at brevo.com
2. Get SMTP credentials from Settings → SMTP & API

---

### 4. GitHub Repository

```bash
cd C:\Users\Leonardo\Desktop\Kyward
git init
git add .
git commit -m "Initial Kyward commit"
git remote add origin https://github.com/YOUR-USERNAME/kyward.git
git push -u origin main
```

---

### 5. Deploy Backend (Railway)

1. Go to **railway.app** and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your Kyward repository
4. **Important:** Set root directory to `backend`
5. Add environment variables:

```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Security
PASSWORD_SALT=generate-a-32-character-random-string

# Bitcoin
XPUB=your-bitcoin-xpub-key
ADDRESS_START_INDEX=0

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=Kyward <your-email@gmail.com>

# Pricing
PRICE_COMPLETE=7.99
PRICE_CONSULTATION=99
PRICE_CONSULTATION_ADDITIONAL=49
```

6. Deploy and copy your backend URL (e.g., `https://kyward-production.up.railway.app`)

---

### 6. Deploy Frontend (Vercel)

1. Go to **vercel.com** and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Vite**
   - Root Directory: `.` (main folder)
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables:
```
VITE_API_URL=https://your-railway-url.up.railway.app/api
REACT_APP_API_URL=https://your-railway-url.up.railway.app/api
```
6. Deploy

---

### 7. Update Backend CORS

Go back to Railway and update:
```
FRONTEND_URL=https://your-project.vercel.app
```

---

### 8. Custom Domain Setup

**Buy Domain:**
- Cloudflare Registrar: cloudflare.com/products/registrar (~$10/year)
- Namecheap: namecheap.com

**Connect to Vercel:**
1. Vercel → Your Project → Settings → Domains
2. Add your domain (e.g., kyward.io)
3. Copy the DNS records shown
4. Add them to your domain registrar
5. Wait 5-30 minutes for SSL

**Update Backend Environment:**
```
FRONTEND_URL=https://kyward.io
```

---

## Testing Checklist

### Local Testing
- [ ] Frontend loads at localhost
- [ ] Backend health check: `curl http://localhost:3001/api/health`
- [ ] Can create account (signup)
- [ ] Can login with created account
- [ ] Can complete questionnaire (all 15 questions)
- [ ] Report shows score and comparison
- [ ] Language toggle works (EN/ES)
- [ ] Payment modal opens with QR code
- [ ] Demo payment simulation works

### New Features Testing (v2.0)
- [ ] Spanish translation complete for all pages
- [ ] Report shows "How You Compare" section
- [ ] Distribution chart displays correctly
- [ ] Premium password box shows animated blur
- [ ] Daily tips rotate in Dashboard
- [ ] Complete Plan price shows $7.99
- [ ] Consultation shows $99/$49 pricing
- [ ] BTC price refreshes every 2 minutes

### Production Testing
- [ ] Site loads on custom domain with HTTPS
- [ ] Can create account and login
- [ ] Questionnaire works end-to-end
- [ ] Payment modal shows real BTC address
- [ ] Real small payment works (~$1 equivalent)
- [ ] Email received after payment
- [ ] User data persists (Supabase working)

---

## Feature Checklist

### Core Features
- [x] User authentication (signup/login/logout)
- [x] Password reset flow
- [x] 15-question security assessment
- [x] Score calculation and report generation
- [x] PDF password protection
- [x] Session management (30-day tokens)

### Subscription Features
- [x] Free tier (1 assessment/month)
- [x] Complete Plan ($7.99/month) - unlimited assessments
- [x] Consultation Plan ($99 first, $49 additional)
- [x] Premium content unlock (detailed tips)

### Payment Features
- [x] Bitcoin payment with HD wallet (XPUB)
- [x] Real-time BTC/USD price from mempool.space
- [x] QR code generation
- [x] 2-minute price refresh countdown
- [x] 30-minute payment expiry
- [x] Payment confirmation polling
- [x] Demo mode for testing

### Internationalization
- [x] English (default)
- [x] Spanish translation
- [x] Language toggle component
- [x] Persistent language preference

### UI/UX Features
- [x] Dark theme design
- [x] Bitcoin orange accents
- [x] Telegram-style blur effects
- [x] Animated score display
- [x] Community comparison chart
- [x] Daily tips rotation
- [x] Responsive design

---

## Pricing Summary

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 1 assessment/month, basic tips |
| **Complete** | $7.99/month | Unlimited assessments, all tips, PDF download |
| **Consultation** | $99 first / $49 additional | Personal expert consultation + everything above |

---

## Services & Costs

| Service | Purpose | Estimated Cost |
|---------|---------|----------------|
| **Supabase** | Database | Free (up to 500MB) |
| **Vercel** | Frontend hosting | Free |
| **Railway** | Backend hosting | ~$5/month |
| **Cloudflare** | Domain + DNS | ~$10/year |
| **Gmail SMTP** | Email sending | Free |

**Total: ~$6/month + domain**

---

## Troubleshooting

### "Failed to fetch" error
- Backend not running or wrong API URL
- Check CORS settings (FRONTEND_URL must match)
- Check browser console for detailed error

### Login not working
- Check Supabase connection
- Verify PASSWORD_SALT matches between deployments
- Check session_tokens table has entries

### Payment not detecting
- Verify XPUB is correct format (zpub recommended)
- Check mempool.space is accessible
- Wait 10-30 seconds for mempool to see transaction

### Emails not sending
- Use App Password, not regular Gmail password
- Check SMTP credentials
- Check spam folder
- Try Brevo if Gmail doesn't work

### Database errors
- Check Supabase URL and service key
- Verify tables exist with correct schema
- Check Row Level Security policies

### Language not switching
- Clear browser localStorage
- Check translations.js for missing keys
- Verify LanguageProvider wraps App

---

## File Structure

```
kyward/
├── .env.example              # Frontend environment template
├── package.json              # Frontend dependencies
├── DEPLOYMENT-CHECKLIST.md   # This file
├── src/
│   ├── App.jsx              # Main app component
│   ├── components/
│   │   ├── AuthForm.jsx     # Login/Signup
│   │   ├── Dashboard.jsx    # User dashboard
│   │   ├── Questionnaire.jsx # 15-question assessment
│   │   ├── Report.jsx       # Score report
│   │   ├── PaymentModal.jsx # BTC payment
│   │   └── LandingPage.jsx  # Public landing
│   ├── services/
│   │   ├── Database.js      # API client
│   │   └── PaymentService.js # Payment logic
│   ├── i18n/
│   │   ├── translations.js  # EN/ES translations
│   │   └── LanguageContext.jsx # i18n provider
│   └── styles/
│       └── Theme.js         # Design tokens
├── backend/
│   ├── .env.example         # Backend environment template
│   ├── package.json         # Backend dependencies
│   ├── server.js            # Express API server
│   └── services/
│       └── database.js      # Supabase integration
└── supabase-schema.sql      # Database schema
```

---

## Support

- **Supabase Docs:** supabase.com/docs
- **Vercel Docs:** vercel.com/docs
- **Railway Docs:** docs.railway.app
- **Bitcoin Address Check:** mempool.space
- **SMTP Testing:** mailtrap.io

---

*Last updated: January 2026*
