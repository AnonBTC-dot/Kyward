# Kyward - Complete Platform Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend (React)](#frontend-react)
4. [Backend (Node.js)](#backend-nodejs)
5. [Database (Supabase)](#database-supabase)
6. [BTC Guardian Integration](#btc-guardian-integration)
7. [Subscription Plans](#subscription-plans)
8. [API Reference](#api-reference)
9. [Deployment](#deployment)
10. [Security](#security)

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
└───────────────────────────┬─────────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                    │
│                   Node.js + Express (Render)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │    Auth     │  │  Payments   │  │ Assessments │  │  Telegram  │  │
│  │  Endpoints  │  │  (OpenNode) │  │    API      │  │    API     │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│       SUPABASE          │   │     BTC GUARDIAN        │
│    (PostgreSQL DB)      │   │    (Telegram Bot)       │
│                         │   │                         │
│  • Users                │   │  • Wallet monitoring    │
│  • Assessments          │   │  • Balance alerts       │
│  • Payments             │   │  • Price milestones     │
│  • Telegram Links       │   │  • Transaction alerts   │
└─────────────────────────┘   └─────────────────────────┘
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
│   ├── LandingPage.jsx      # Marketing page with pricing
│   ├── Dashboard.jsx        # User dashboard
│   ├── Assessment.jsx       # Quiz flow
│   ├── Report.jsx           # Results viewer
│   ├── PaymentModal.jsx     # Bitcoin payment UI
│   ├── AuthForm.jsx         # Login/signup
│   ├── TelegramBlur.jsx     # Premium content blur
│   └── Footer.jsx           # Site footer
├── services/
│   ├── Database.js          # API client (kywardDB)
│   ├── PdfGenerator.js      # PDF report creation
│   └── Recommendations.js   # Security recommendations engine
├── i18n/
│   └── translations.js      # EN/ES translations
├── styles/
│   └── Theme.js             # Global styles
├── App.jsx                  # Main app + routing
└── main.jsx                 # Entry point
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
- **Payments**: OpenNode (Bitcoin Lightning)

### Directory Structure
```
backend/
├── server.js                # Main Express server
├── services/
│   └── database.js          # Supabase client & functions
├── .env                     # Environment variables
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
PORT=3001
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=your-secret-key
OPENNODE_API_KEY=xxx
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

### Essential ($7.99 one-time)
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

#### POST /api/payments/create
```json
Headers: Authorization: Bearer {token}

Request:
{
  "plan": "sentinel"
}

Response:
{
  "success": true,
  "paymentId": "xxx",
  "lightningInvoice": "lnbc...",
  "bitcoinAddress": "bc1...",
  "amount": 0.00015,
  "expiresAt": "..."
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
2. Set environment variable: `VITE_API_URL`
3. Deploy

### Backend (Render)
1. Create new Web Service
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### BTC Guardian (Railway/VPS)
See `BTC Guardian/DEPLOYMENT_PLAN.md` for detailed instructions.

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
