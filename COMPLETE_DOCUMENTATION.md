# Kyward - Complete Platform Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend (React)](#frontend-react)
4. [Backend (Node.js)](#backend-nodejs)
5. [Database (Supabase)](#database-supabase)
6. [Payment System](#payment-system)
7. [BTC Guardian Integration](#btc-guardian-integration)
8. [Subscription Plans](#subscription-plans)
9. [API Reference](#api-reference)
10. [Deployment](#deployment)
11. [Security](#security)

---

## Overview

Kyward is a Bitcoin security assessment platform that helps users evaluate and improve their Bitcoin storage practices through personalized questionnaires, security scores, and actionable recommendations.

### Key Features
- **Security Assessment**: 15-question questionnaire evaluating Bitcoin security practices
- **Personalized Scoring**: 0-100 security score with detailed breakdown
- **PDF Reports**: Downloadable security reports with recommendations
- **Inheritance Planning**: Guides for passing Bitcoin to heirs
- **BTC Guardian Bot**: Telegram bot for wallet monitoring (Sentinel only)
- **Multi-language**: English and Spanish support

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
│                     React + Vite (Vercel)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │  Landing    │  │  Dashboard  │  │  Assessment │  │   Report   │  │
│  │    Page     │  │             │  │    Flow     │  │  Viewer    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │
│                      │                                              │
│              ┌───────┴───────┐                                      │
│              │ PaymentModal  │ ◄── PaymentMethodSelector           │
│              └───────────────┘                                      │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                    │
│                   Node.js + Express (Render)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │    Auth     │  │  Payments   │  │ Assessments │  │  Telegram  │  │
│  │  Endpoints  │  │   Router    │  │    API      │  │    API     │  │
│  └─────────────┘  └──────┬──────┘  └─────────────┘  └────────────┘  │
│                          │                                          │
│         ┌────────────────┼────────────────┐                        │
│         ▼                ▼                ▼                        │
│  ┌────────────┐   ┌────────────┐   ┌────────────┐                  │
│  │  bitcoin   │   │  btcpay    │   │nowpayments │                  │
│  │ (HD/XPUB)  │   │ (LN/Liquid)│   │  (USDT)    │                  │
│  └────────────┘   └────────────┘   └────────────┘                  │
│       ✅              🔜              🔜                            │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    SUPABASE     │  │  BTC GUARDIAN   │  │   EXTERNAL      │
│  (PostgreSQL)   │  │  (Telegram Bot) │  │   SERVICES      │
│                 │  │                 │  │                 │
│ • Users         │  │ • Monitoring    │  │ • BTCPay Server │
│ • Assessments   │  │ • Alerts        │  │ • NOWPayments   │
│ • Payments      │  │ • Charts        │  │ • Mempool.space │
│ • Telegram      │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘

Legend: ✅ Active  🔜 Coming Soon
```

---

## Frontend (React)

### Technology Stack
- **Framework**: React 18 with Vite
- **Styling**: CSS-in-JS (inline styles)
- **State**: React hooks (useState, useEffect)
- **i18n**: Custom translation system
- **PDF**: jsPDF for report generation

### Directory Structure
```
src/
├── components/
│   ├── LandingPage.jsx           # Marketing page with pricing
│   ├── Dashboard.jsx             # User dashboard
│   ├── Assessment.jsx            # Quiz flow
│   ├── Report.jsx                # Results viewer
│   ├── PaymentModal.jsx          # Multi-provider payment UI
│   ├── PaymentMethodSelector.jsx # Payment method selection (NEW)
│   ├── AuthForm.jsx              # Login/signup
│   ├── TelegramBlur.jsx          # Premium content blur
│   └── Footer.jsx                # Site footer
├── services/
│   ├── Database.js               # API client (kywardDB)
│   ├── PaymentService.js         # Multi-provider payment client (NEW)
│   ├── PdfGenerator.js           # PDF report creation
│   └── Recommendations.js        # Security recommendations engine
├── i18n/
│   └── translations.js           # EN/ES translations
├── styles/
│   └── Theme.js                  # Global styles
├── App.jsx                       # Main app + routing
└── main.jsx                      # Entry point
```

### Key Components

#### Dashboard.jsx
Main user interface showing:
- Security score overview
- Subscription status
- Assessment history
- BTC Guardian linking (Sentinel)
- Quick actions

#### PdfGenerator.js
Generates encrypted PDF reports with:
- Security score breakdown
- Personalized recommendations
- Inheritance planning guide
- Category-by-category analysis

#### Recommendations.js
Security recommendation engine:
- `getRecommendations(answers, score)` - Main recommendations
- `generateInheritancePlan(answers, score, email, lang)` - Inheritance guide

### Environment Variables
```env
VITE_API_URL=https://kyward.onrender.com/api
```

---

## Backend (Node.js)

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT tokens
- **Payments**: Multi-provider system (HD derivation, BTCPay, NOWPayments)

### Directory Structure
```
backend/
├── server.js                    # Main Express server + webhooks
├── services/
│   ├── database.js              # Supabase client & functions
│   ├── bitcoin.js               # HD wallet derivation (XPUB/ZPUB)
│   ├── btcpay.js                # BTCPay Server (Lightning/Liquid) 🔜
│   ├── nowpayments.js           # NOWPayments (USDT) 🔜
│   ├── paymentRouter.js         # Unified payment routing
│   ├── paymentStore.js          # In-memory payment tracking
│   └── email.js                 # Email notifications
├── .env                         # Environment variables
├── .env.example                 # Environment template
└── package.json
```

### Key Functions (database.js)

#### Authentication
```javascript
createUser(email, password)     // Register new user
loginUser(email, password)      // Login, returns JWT
validateSession(token)          // Verify JWT token
logout(token)                   // Invalidate session
resetPassword(email, newPass)   // Password reset
```

#### User Management
```javascript
getUserByEmail(email)           // Fetch user data
upgradeSubscription(userId, plan, paymentType)
updateEmailPreferences(userId, prefs)
hasPremiumAccess(userId)        // Check subscription
canTakeAssessment(userId)       // Check assessment limits
```

#### Assessments
```javascript
saveAssessment(userId, score, responses)
getUserAssessments(userId)
getCommunityStats()             // Aggregate stats
compareToAverage(score)         // Percentile comparison
```

#### Telegram Integration
```javascript
initiateTelegramLink(userId)    // Generate verification code
verifyTelegramLink(code, telegramId, username, firstName)
getTelegramLink(userId)         // Get link status
checkSentinelSubscription(telegramUserId)
unlinkTelegram(userId)
```

### Environment Variables
```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=https://kyward.com

# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...

# Security
PASSWORD_SALT=your-secure-salt

# Bitcoin On-chain (Active)
XPUB=zpub6rFR7y4Q2AijBEqTUquh...
ADDRESS_START_INDEX=0

# BTCPay Server - Lightning/Liquid (Coming Soon)
BTCPAY_HOST=https://btcpay.yourdomain.com
BTCPAY_STORE_ID=your-store-id
BTCPAY_API_KEY=your-api-key
BTCPAY_WEBHOOK_SECRET=your-webhook-secret

# NOWPayments - USDT (Coming Soon)
NOWPAYMENTS_API_KEY=your-api-key
NOWPAYMENTS_IPN_SECRET=your-ipn-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Kyward <noreply@kyward.io>
```

---

## Database (Supabase)

### Schema Overview

#### users
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | User email (unique) |
| password_hash | VARCHAR(255) | Bcrypt hash |
| subscription_level | VARCHAR(50) | free/essential/sentinel/consultation |
| subscription_start | TIMESTAMP | Subscription start date |
| subscription_end | TIMESTAMP | Subscription end date |
| assessments_taken | INTEGER | Total assessments count |
| pdf_password | VARCHAR(50) | PDF encryption password |
| payment_type | VARCHAR(50) | none/one-time/subscription |
| language_preference | VARCHAR(5) | en/es |

#### assessments
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| score | INTEGER | 0-100 score |
| responses | JSONB | Quiz answers |
| created_at | TIMESTAMP | Assessment date |

#### payments
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| payment_id | VARCHAR(255) | OpenNode payment ID |
| plan | VARCHAR(50) | Plan purchased |
| amount_usd | DECIMAL | USD amount |
| amount_btc | DECIMAL | BTC amount |
| status | VARCHAR(50) | pending/completed/failed |

#### telegram_links
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| telegram_user_id | BIGINT | Telegram user ID |
| telegram_username | VARCHAR(255) | @username |
| is_verified | BOOLEAN | Link verified |
| verification_code | VARCHAR(10) | 6-char code |
| verification_expires_at | TIMESTAMP | Code expiry |

---

## Payment System

### Overview

Kyward supports multiple payment methods through a unified payment router:

| Method | Provider | Status | Speed | Fees |
|--------|----------|--------|-------|------|
| Bitcoin On-chain | HD Derivation (XPUB) | **Active** | 10-60 min | Network fee |
| Lightning Network | BTCPay Server | Coming Soon | Instant | ~1 sat |
| Liquid (L-BTC) | BTCPay Server | Coming Soon | 1-2 min | ~$0.01 |
| Liquid (L-USDT) | BTCPay Server | Coming Soon | 1-2 min | ~$0.01 |
| USDT (Tron) | NOWPayments | Coming Soon | 1-10 min | ~$1 |
| USDT (Polygon) | NOWPayments | Coming Soon | 1-10 min | < $0.01 |
| USDT (BSC) | NOWPayments | Coming Soon | 1-10 min | ~$0.10 |

### Payment Flow

```
User selects plan → Payment Method Selector → Create Payment
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    On-chain BTC      Lightning/Liquid      USDT
    (HD derivation)    (BTCPay Server)   (NOWPayments)
         │                 │                 │
         ▼                 ▼                 ▼
    Poll mempool.space   Webhook         IPN Callback
         │                 │                 │
         └─────────────────┼─────────────────┘
                           ▼
              Upgrade Subscription + Send Email
```

### Backend Services

#### bitcoin.js (Active)
HD wallet address derivation from XPUB/ZPUB (BIP84):
- Generates unique addresses per payment
- 30-minute address reuse window per user (anti-spam)
- Payment verification via mempool.space API
- ±1% payment amount tolerance

```javascript
generatePaymentAddress(paymentId, email)  // Derive or reuse address
checkAddressPayment(address, expectedSats) // Check for payment
markAddressUsed(address, email)            // Advance index after payment
```

#### btcpay.js (Coming Soon)
BTCPay Server Greenfield API integration:
- Lightning Network (BOLT11 invoices)
- Liquid Network (L-BTC, L-USDT)
- Same 30-minute invoice reuse logic
- Webhook signature verification (HMAC-SHA256)

```javascript
createLightningInvoice(amount, metadata)   // Create LN invoice
createLiquidInvoice(amount, asset, metadata) // Create Liquid invoice
verifyWebhookSignature(payload, signature) // Verify BTCPay webhook
```

#### nowpayments.js (Coming Soon)
NOWPayments API integration:
- USDT on multiple networks (Tron, Polygon, BSC, Ethereum)
- Same invoice reuse logic
- IPN signature verification (HMAC-SHA512)

```javascript
createUsdtPayment(amount, network, metadata) // Create USDT payment
verifyIpnSignature(body, signature)          // Verify IPN callback
```

#### paymentRouter.js
Unified payment interface:
```javascript
getAvailablePaymentMethods()                // List configured methods
createPayment({ method, network, plan, email, paymentId })
checkPaymentStatus(paymentId, provider, paymentData)
markPaymentUsed(provider, paymentData, email)
```

### Frontend Components

#### PaymentMethodSelector.jsx
Visual payment method selection with:
- Active methods (Bitcoin on-chain)
- Coming Soon overlay for BTCPay/NOWPayments methods
- Network sub-selection (for Liquid/USDT)
- Animated badges and effects

#### PaymentModal.jsx
Multi-stage payment flow:
1. **Selecting** - Choose payment method
2. **Loading** - Create payment request
3. **Payment** - Show QR code and address/invoice
4. **Success** - Display PDF password

### Webhooks

| Endpoint | Provider | Purpose |
|----------|----------|---------|
| `POST /api/webhooks/btcpay` | BTCPay Server | Lightning/Liquid confirmations |
| `POST /api/webhooks/nowpayments` | NOWPayments | USDT payment notifications |

---

## BTC Guardian Integration

### Overview
BTC Guardian is a Telegram bot exclusively for Sentinel subscribers that provides:
- Real-time wallet balance monitoring
- Transaction alerts (incoming/outgoing)
- BTC price milestone notifications
- Historical balance charts

### Linking Flow
```
1. User subscribes to Sentinel ($14.99/month)
2. User clicks "Link Telegram" in Dashboard
3. Backend generates 6-character verification code
4. Code valid for 10 minutes
5. User opens @GuardianBTCBot on Telegram
6. User sends: /link CODE
7. Bot verifies code via Kyward API
8. Accounts are linked
9. User can now use all bot features
```

### Bot Commands
| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/link CODE` | Link Kyward account |
| `/dashboard` | Main menu |
| `/balance` | Current wallet balances |
| `/add` | Add wallet address |
| `/delete` | Remove wallet |
| `/daily` | Toggle daily updates |
| `/price` | Current BTC price |
| `/help` | Help message |

### API Endpoints for Bot
```
POST /api/telegram/link/start     - Generate verification code
POST /api/telegram/link/verify    - Verify link (called by bot)
GET  /api/telegram/subscription/  - Check subscription status
GET  /api/telegram/status         - Link status for dashboard
POST /api/telegram/unlink         - Unlink account
```

### Subscription Check
Before allowing any premium feature, the bot calls:
```
GET /api/telegram/subscription/{telegram_user_id}

Response:
{
  "hasAccess": true,
  "email": "user@example.com",
  "subscriptionLevel": "sentinel",
  "subscriptionEnd": "2025-02-15T00:00:00Z",
  "daysRemaining": 30
}
```

---

## Subscription Plans

### Free ($0)
- 1 assessment per month
- Basic security score
- 1 critical recommendation

### Essential ($9.99 one-time)
- 1 assessment (repurchase to retake)
- Full PDF report download
- All personalized recommendations
- Inheritance planning guide

### Sentinel ($14.99/month)
- Unlimited assessments
- All Essential features
- **BTC Guardian Telegram Bot**
- Real-time wallet alerts
- Transaction notifications
- Price milestone alerts
- Cancel anytime

### Consultation ($99 + $49/hr)
- 1-hour private video audit
- Personalized deep-dive recommendations
- Priority support
- Unlimited assessments
- Full PDF reports
- **Does NOT include BTC Guardian bot**

---

## API Reference

### Authentication

#### POST /api/auth/register
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "token": "eyJ...",
  "user": { ... }
}
```

#### POST /api/auth/login
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "token": "eyJ...",
  "user": { ... }
}
```

### User

#### GET /api/user
```
Headers: Authorization: Bearer {token}

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "subscriptionLevel": "sentinel",
  "assessmentsTaken": 5,
  ...
}
```

### Assessments

#### POST /api/assessments
```json
Headers: Authorization: Bearer {token}

Request:
{
  "score": 75,
  "responses": { ... }
}

Response:
{
  "success": true,
  "assessment": { ... }
}
```

#### GET /api/assessments
```
Headers: Authorization: Bearer {token}

Response:
{
  "assessments": [
    { "id": "uuid", "score": 75, "created_at": "..." },
    ...
  ]
}
```

### Payments

#### GET /api/payments/methods
Get available payment methods based on server configuration.
```json
Response:
{
  "success": true,
  "methods": [
    {
      "id": "onchain",
      "name": "Bitcoin",
      "badge": "Private",
      "description": "Direct to wallet",
      "time": "10-60 minutes"
    }
  ]
}
```

#### POST /api/payments/create
Create a new payment request.
```json
Request:
{
  "email": "user@example.com",
  "plan": "essential",
  "paymentMethod": "onchain",    // lightning, onchain, liquid, usdt
  "network": null                 // For liquid: lbtc/lusdt, for usdt: usdttrc20/usdtmatic/etc
}

Response (On-chain):
{
  "success": true,
  "paymentId": "uuid",
  "provider": "direct_btc",
  "method": "onchain",
  "address": "bc1q...",
  "qrData": "bitcoin:bc1q...?amount=0.0001",
  "amount": 9.99,
  "btcAmount": 0.0001,
  "sats": 10000,
  "priceUsd": 100000,
  "expiresAt": "2025-01-27T12:00:00Z",
  "reused": false
}

Response (Lightning - Coming Soon):
{
  "success": true,
  "paymentId": "uuid",
  "provider": "btcpay_lightning",
  "method": "lightning",
  "invoice": "lnbc...",
  "qrData": "lightning:lnbc...",
  "amount": 9.99,
  "checkoutLink": "https://btcpay.../i/xxx",
  "expiresAt": "..."
}

Response (USDT - Coming Soon):
{
  "success": true,
  "paymentId": "uuid",
  "provider": "nowpayments_usdttrc20",
  "method": "usdt",
  "network": "usdttrc20",
  "networkName": "Tron (TRC20)",
  "address": "T...",
  "payAmount": 9.99,
  "payCurrency": "usdttrc20",
  "expiresAt": "..."
}
```

#### GET /api/payments/:paymentId/status
Check payment status (unified for all providers).
```json
Response:
{
  "success": true,
  "status": "pending" | "confirmed" | "expired",
  "provider": "direct_btc",
  "method": "onchain",
  "txid": "abc123...",           // On confirmation
  "pdfPassword": "XyZ123...",    // On confirmation
  "plan": "essential"
}
```

### Telegram

#### POST /api/telegram/link/start
```
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "verificationCode": "ABC123",
  "expiresAt": "2025-01-23T12:30:00Z"
}
```

#### POST /api/telegram/link/verify
```json
Request:
{
  "verificationCode": "ABC123",
  "telegramUserId": 123456789,
  "telegramUsername": "johndoe",
  "telegramFirstName": "John"
}

Response:
{
  "success": true,
  "email": "user@example.com",
  "subscriptionLevel": "sentinel"
}
```

---

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set environment variable: `VITE_API_URL=https://kyward.onrender.com/api`
3. Deploy

### Backend (Render)
1. Create new Web Service
2. Connect GitHub repository
3. Set environment variables (see below)
4. Deploy

**Required Environment Variables for Render:**
```env
NODE_ENV=production
FRONTEND_URL=https://kyward.com
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
PASSWORD_SALT=your-secure-salt
XPUB=zpub6rFR7y4Q2AijBEqTUquh...
ADDRESS_START_INDEX=0
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Kyward <noreply@kyward.io>
```

### BTC Guardian (Railway/VPS)
See `BTC Guardian/DEPLOYMENT_PLAN.md` for detailed instructions.

### Payment Providers Deployment (Future)

#### BTCPay Server (Self-Hosted)
When ready to enable Lightning/Liquid payments:

1. **Provision VPS** (DigitalOcean, Hetzner, or Lunanode)
   - Minimum: 2GB RAM, 80GB SSD (~$5-15/month)
   - Recommended: 4GB RAM for Lightning

2. **Deploy BTCPay Server**
   ```bash
   git clone https://github.com/btcpayserver/btcpayserver-docker
   cd btcpayserver-docker

   export BTCPAY_HOST="btcpay.kyward.com"
   export NBITCOIN_NETWORK="mainnet"
   export BTCPAYGEN_CRYPTO1="btc"
   export BTCPAYGEN_LIGHTNING="lnd"
   export BTCPAYGEN_ADDITIONAL_FRAGMENTS="opt-add-liquidd"

   ./btcpay-setup.sh -i
   ```

3. **Configure DNS**
   - Point `btcpay.kyward.com` to your VPS IP

4. **Create Store & API Key**
   - Access BTCPay at your domain
   - Create store, generate API key
   - Create webhook pointing to `/api/webhooks/btcpay`

5. **Add to Render Environment**
   ```env
   BTCPAY_HOST=https://btcpay.kyward.com
   BTCPAY_STORE_ID=your-store-id
   BTCPAY_API_KEY=your-api-key
   BTCPAY_WEBHOOK_SECRET=your-webhook-secret
   ```

6. **Remove Coming Soon flag**
   - Edit `src/components/PaymentMethodSelector.jsx`
   - Set `comingSoon: false` for `lightning` and `liquid`

#### NOWPayments
When ready to enable USDT payments:

1. **Create NOWPayments Account**
   - Sign up at [nowpayments.io](https://nowpayments.io)
   - Complete KYC if processing >$1000/day

2. **Configure IPN**
   - Set IPN callback URL: `https://kyward.onrender.com/api/webhooks/nowpayments`
   - Copy IPN secret

3. **Add to Render Environment**
   ```env
   NOWPAYMENTS_API_KEY=your-api-key
   NOWPAYMENTS_IPN_SECRET=your-ipn-secret
   ```

4. **Remove Coming Soon flag**
   - Edit `src/components/PaymentMethodSelector.jsx`
   - Set `comingSoon: false` for `usdt`

---

## Security

### Authentication
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiry
- Session tokens stored in database

### Data Protection
- Row Level Security (RLS) enabled on all tables
- Service role key used only server-side
- No sensitive data in frontend

### Payment Security
- **HD Derivation**: XPUB stored server-side, private keys never exposed
- **Address Reuse Prevention**: 30-minute assignment window per user/email
- **Anti-Spam**: Same address/invoice reused within window to prevent waste
- **Amount Tolerance**: ±1% tolerance for on-chain payments (price volatility)
- **Webhook Verification**:
  - BTCPay: HMAC-SHA256 signature verification
  - NOWPayments: HMAC-SHA512 signature verification
- **Timing-Safe Comparison**: Used for all signature verifications

### Telegram Linking
- Verification codes: 6 characters, alphanumeric
- Codes expire after 10 minutes
- One-time use (deleted after verification)

### PDF Reports
- Encrypted with user-specific password
- Password generated server-side
- Never transmitted in plaintext

---

## Support

- Website: https://kyward.com
- Telegram Bot: @GuardianBTCBot
- Issues: https://github.com/anthropics/claude-code/issues

---

*Built by Bitcoiners, for Bitcoiners.*
