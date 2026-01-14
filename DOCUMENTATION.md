# Kyward Documentation

**Version 2.0** | **Last Updated: January 2026**

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Features](#3-features)
4. [Tech Stack](#4-tech-stack)
5. [Project Structure](#5-project-structure)
6. [Installation](#6-installation)
7. [Configuration](#7-configuration)
8. [API Reference](#8-api-reference)
9. [Database Schema](#9-database-schema)
10. [Frontend Components](#10-frontend-components)
11. [Services](#11-services)
12. [Internationalization (i18n)](#12-internationalization-i18n)
13. [Payment System](#13-payment-system)
14. [Security](#14-security)
15. [Deployment](#15-deployment)
16. [Troubleshooting](#16-troubleshooting)
17. [Changelog](#17-changelog)

---

## 1. Overview

### What is Kyward?

**Kyward** is a Bitcoin Security Assessment Platform that helps Bitcoin holders evaluate their security practices through a comprehensive 15-question questionnaire. Users receive personalized scores, recommendations, and can compare their results with the community.

### The Problem It Solves

Many Bitcoin holders:
- Don't know if they're storing their Bitcoin safely
- Have no inheritance plan (their Bitcoin could be lost forever)
- Don't understand complex security concepts like multi-signature or hardware wallets
- Are overwhelmed by technical jargon

Kyward solves this by asking simple questions and providing easy-to-understand recommendations.

### Key Value Propositions

| Value | Description |
|-------|-------------|
| **Security Assessment** | 15-question evaluation covering all Bitcoin security areas |
| **Personalized Reports** | Detailed recommendations based on user responses |
| **Community Comparison** | See how your practices compare to other Bitcoiners |
| **Premium Features** | Detailed tips, unlimited assessments, expert consultations |
| **Bitcoin-Native Payments** | Accept payments in Bitcoin with real-time pricing |
| **Multi-Language Support** | English and Spanish translations |

---

## 2. Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   React + Vite Frontend                        │  │
│  │  ├── LandingPage (public marketing page)                       │  │
│  │  ├── AuthForm (login/signup/password reset)                    │  │
│  │  ├── Dashboard (user home with daily tips)                     │  │
│  │  ├── Questionnaire (15 security questions)                     │  │
│  │  ├── Report (score + recommendations + comparison)             │  │
│  │  └── PaymentModal (Bitcoin payment with QR code)               │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ HTTPS / REST API
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                            API LAYER                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   Express.js Backend                           │  │
│  │  ├── /api/auth/* ──────── Authentication endpoints            │  │
│  │  ├── /api/user/* ──────── User profile & management           │  │
│  │  ├── /api/assessments ─── Assessment CRUD operations          │  │
│  │  ├── /api/stats/* ─────── Community statistics                │  │
│  │  └── /api/payments/* ──── Bitcoin payment processing          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│      Supabase        │  │   mempool.space  │  │   SMTP Server    │
│     PostgreSQL       │  │    BTC Price     │  │      Email       │
│                      │  │    Blockchain    │  │                  │
└──────────────────────┘  └──────────────────┘  └──────────────────┘
```

### Data Flow Diagrams

#### Authentication Flow
```
User ──► Frontend ──► POST /api/auth/login ──► Backend
                                                  │
                                                  ▼
                                            Supabase (verify)
                                                  │
                                                  ▼
                                         Generate Session Token
                                                  │
                                                  ▼
User ◄── Store Token ◄── Return User + Token ◄───┘
```

#### Assessment Flow
```
User ──► Answer 15 Questions ──► Calculate Score ──► POST /api/assessments
                                                            │
                                                            ▼
                                                      Save to Supabase
                                                            │
                                                            ▼
                                                   Update Community Stats
                                                            │
                                                            ▼
User ◄── Show Report with Comparison ◄──────────────────────┘
```

#### Payment Flow
```
User ──► Click Upgrade ──► POST /api/payments/create
                                     │
                                     ▼
                           Fetch BTC Price (mempool.space)
                                     │
                                     ▼
                           Derive Address (XPUB + BIP32)
                                     │
                                     ▼
User ◄── Display QR + Address ◄──────┘
         │
         ▼
User ──► Send Bitcoin
         │
         ▼
Frontend ──► Poll /api/payments/:id/status (every 5s)
                          │
                          ▼
               Backend checks mempool.space
                          │
                          ▼
               Transaction detected?
                    │         │
                   YES        NO
                    │         │
                    ▼         └──► Continue polling
              Upgrade user
              Generate PDF password
                    │
                    ▼
User ◄── Success + Password ◄───┘
```

---

## 3. Features

### Feature Matrix

| Feature | Free | Complete ($7.99/mo) | Consultation ($99) |
|---------|------|---------------------|-------------------|
| 15-Question Assessment | 1/month | Unlimited | Unlimited |
| Basic Score & Tips | 3 tips | All 15+ tips | All tips |
| Community Comparison | Yes | Yes | Yes |
| PDF Report Download | No | Yes | Yes |
| Email Report Delivery | No | Yes | Yes |
| Personal Expert Session | No | No | 1 hour |
| Custom Security Audit | No | No | Yes |

### Core Features

| Feature | Description |
|---------|-------------|
| **Security Assessment** | 15-question evaluation covering key Bitcoin security areas |
| **Score Calculation** | Weighted scoring algorithm (0-100 scale) |
| **Community Comparison** | See how your score compares to other Bitcoiners |
| **Session Management** | 30-day persistent login sessions |
| **Password Reset** | Email-based password recovery |

### Premium Features

| Feature | Description |
|---------|-------------|
| **Detailed Tips** | 15+ in-depth security recommendations |
| **PDF Export** | Password-protected downloadable report |
| **Progress Tracking** | Historical assessment data |
| **Unlimited Assessments** | No monthly limits |

### Technical Features

| Feature | Description |
|---------|-------------|
| **Multi-Language** | English and Spanish support with easy extensibility |
| **Real-time BTC Pricing** | Live rates from mempool.space API |
| **HD Wallet Payments** | BIP32 XPUB-based address derivation |
| **Auto-updating Stats** | Database triggers for community statistics |

---

## 4. Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.x |
| Vite | Build Tool & Dev Server | 5.x |
| React Context | State Management (Language, Auth) | - |
| CSS-in-JS | Styling (inline styles object) | - |
| qrcode | QR Code Generation | 1.x |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| Node.js | JavaScript Runtime | 18+ |
| Express.js | Web Framework | 4.18.x |
| @supabase/supabase-js | Database Client | 2.39.x |
| bitcoinjs-lib | Bitcoin Address Derivation | 6.x |
| bip32 | HD Wallet Key Derivation | 4.x |
| nodemailer | Email Sending | 6.x |
| uuid | Unique ID Generation | 9.x |
| cors | Cross-Origin Resource Sharing | 2.8.x |
| dotenv | Environment Variables | 16.x |

### Database

| Technology | Purpose |
|------------|---------|
| Supabase | Managed PostgreSQL Database |
| Row Level Security (RLS) | Data Access Control |
| Database Triggers | Auto-update Statistics |
| UUID Extension | Primary Key Generation |

### External Services

| Service | Purpose | URL |
|---------|---------|-----|
| mempool.space | BTC/USD Price & Blockchain Data | mempool.space |
| Gmail / Brevo | SMTP Email Delivery | - |
| Vercel | Frontend Hosting | vercel.com |
| Railway | Backend Hosting | railway.app |

---

## 5. Project Structure

```
kyward/
│
├── .env.example                 # Frontend environment template
├── package.json                 # Frontend dependencies & scripts
├── vite.config.js              # Vite build configuration
├── index.html                  # HTML entry point
│
├── DOCUMENTATION.md            # This file
├── DEPLOYMENT-CHECKLIST.md     # Step-by-step deployment guide
│
├── src/                        # ═══════════ FRONTEND SOURCE ═══════════
│   │
│   ├── App.jsx                 # Main application router & state
│   ├── main.jsx               # React DOM entry point
│   │
│   ├── components/            # ──────── React Components ────────
│   │   ├── LandingPage.jsx    # Public marketing page
│   │   ├── AuthForm.jsx       # Login/Signup/Reset forms
│   │   ├── Dashboard.jsx      # User dashboard with tips
│   │   ├── Questionnaire.jsx  # 15-question assessment
│   │   ├── Report.jsx         # Score report & recommendations
│   │   └── PaymentModal.jsx   # Bitcoin payment interface
│   │
│   ├── services/              # ──────── Business Logic ────────
│   │   ├── Database.js        # API client for backend
│   │   └── PaymentService.js  # Payment processing logic
│   │
│   ├── i18n/                  # ──────── Internationalization ────────
│   │   ├── translations.js    # EN/ES translation strings
│   │   └── LanguageContext.jsx # Language provider & hook
│   │
│   └── styles/                # ──────── Styling ────────
│       └── Theme.js           # Design tokens & shared styles
│
├── backend/                   # ═══════════ BACKEND SOURCE ═══════════
│   │
│   ├── .env.example          # Backend environment template
│   ├── package.json          # Backend dependencies & scripts
│   ├── server.js             # Express API server & routes
│   │
│   └── services/             # ──────── Backend Services ────────
│       └── database.js       # Supabase database operations
│
├── database/                 # ═══════════ DATABASE ═══════════
│   └── schema.sql           # PostgreSQL schema for Supabase
│
└── public/                  # ═══════════ STATIC ASSETS ═══════════
    └── favicon.ico
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main router - controls which page shows based on auth state |
| `src/services/Database.js` | API client - all backend communication goes through here |
| `src/i18n/translations.js` | All text strings in English and Spanish |
| `backend/server.js` | Express server with all API route definitions |
| `backend/services/database.js` | Supabase operations (users, assessments, etc.) |
| `database/schema.sql` | Complete database schema to run in Supabase SQL Editor |

---

## 6. Installation

### Prerequisites

- **Node.js** 18.x or higher ([download](https://nodejs.org))
- **npm** 9.x or higher (comes with Node.js)
- **Supabase** account (free tier available at [supabase.com](https://supabase.com))
- **Bitcoin wallet** with XPUB export capability (Sparrow, Electrum, or BlueWallet)

### Quick Start (Local Development)

**Step 1: Clone and Install Frontend**
```bash
cd C:\Users\Leonardo\Desktop\Kyward
npm install
```

**Step 2: Install Backend**
```bash
cd backend
npm install
cd ..
```

**Step 3: Set Up Supabase Database**

1. Go to [supabase.com](https://supabase.com) and create a project
2. Wait for project initialization (~2 minutes)
3. Go to **SQL Editor**
4. Open `database/schema.sql` and run the entire script
5. Go to **Settings → API** and copy:
   - **Project URL** (e.g., `https://xxxx.supabase.co`)
   - **service_role key** (the secret one, not anon)

**Step 4: Configure Environment**

Create frontend `.env`:
```bash
copy .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:3001/api
VITE_API_URL=http://localhost:3001/api
```

Create backend `.env`:
```bash
cd backend
copy .env.example .env
```

Edit `backend/.env`:
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

PASSWORD_SALT=generate-a-random-32-character-string

XPUB=your-bitcoin-xpub-key
DEMO_ADDRESS=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
```

**Step 5: Start Development Servers**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
cd backend
npm run dev
```

**Step 6: Test**

- Frontend: http://localhost:3000 (or 5173)
- Backend health check: http://localhost:3001/api/health

---

## 7. Configuration

### Frontend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `REACT_APP_API_URL` | Yes | Backend API base URL | `http://localhost:3001/api` |
| `VITE_API_URL` | Yes | Same as above (Vite) | `http://localhost:3001/api` |
| `REACT_APP_NAME` | No | Application name | `Kyward` |
| `REACT_APP_DEFAULT_LANGUAGE` | No | Default language | `en` |

### Backend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | Yes | Server port | `3001` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |
| `FRONTEND_URL` | Yes | Allowed CORS origin | `http://localhost:3000` |
| `SUPABASE_URL` | Yes | Supabase project URL | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Yes | Supabase service role key | `eyJhbG...` |
| `PASSWORD_SALT` | Yes | Salt for password hashing | Random 32+ char string |
| `XPUB` | Yes* | Bitcoin extended public key | `zpub6r...` |
| `DEMO_ADDRESS` | No | Static address for demo mode | `bc1q...` |
| `ADDRESS_START_INDEX` | No | HD derivation start index | `0` |
| `SMTP_HOST` | No | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | No | Email server port | `587` |
| `SMTP_USER` | No | Email username | `you@gmail.com` |
| `SMTP_PASS` | No | Email password/app password | App password |
| `SMTP_FROM` | No | From address | `Kyward <noreply@kyward.io>` |
| `PRICE_COMPLETE` | No | Complete plan price USD | `7.99` |
| `PRICE_CONSULTATION` | No | First consultation price | `99` |
| `PRICE_CONSULTATION_ADDITIONAL` | No | Additional session price | `49` |

*Required for production; use `DEMO_ADDRESS` for development.

---

## 8. API Reference

### Base URL

- **Development:** `http://localhost:3001/api`
- **Production:** `https://your-backend.railway.app/api`

### Authentication

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <session-token>
```

---

### Authentication Endpoints

#### POST /api/auth/signup

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (201):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "subscriptionLevel": "free",
    "createdAt": "2026-01-14T10:30:00Z"
  },
  "token": "64-character-hex-token"
}
```

**Errors:**
- `400` - Email already exists
- `400` - Invalid email format
- `400` - Password too weak

---

#### POST /api/auth/login

Authenticate existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "subscriptionLevel": "complete",
    "pdfPassword": "AbC123XyZ",
    "lastLogin": "2026-01-14T10:30:00Z"
  },
  "token": "64-character-hex-token"
}
```

**Errors:**
- `401` - User not found
- `401` - Incorrect password

---

#### GET /api/auth/validate

Validate session token and get user data.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "subscriptionLevel": "complete"
  }
}
```

**Errors:**
- `401` - Invalid or expired token

---

#### POST /api/auth/logout

End user session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true
}
```

---

#### POST /api/auth/reset-password

Reset user password.

**Request:**
```json
{
  "email": "user@example.com",
  "newPassword": "NewSecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully."
}
```

---

### User Endpoints

#### GET /api/user

Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "subscriptionLevel": "complete",
    "subscriptionDate": "2026-01-01T00:00:00Z",
    "subscriptionEnd": "2026-02-01T00:00:00Z",
    "pdfPassword": "AbC123XyZ",
    "consultationCount": 0,
    "createdAt": "2025-12-15T10:30:00Z",
    "lastLogin": "2026-01-14T08:00:00Z",
    "languagePreference": "en"
  }
}
```

---

#### GET /api/user/usage

Get assessment usage status.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "canTake": true,
  "remaining": 1,
  "isPremium": false
}
```

For premium users:
```json
{
  "success": true,
  "canTake": true,
  "remaining": "Infinity",
  "isPremium": true
}
```

---

#### GET /api/user/premium

Check if user has premium access.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "hasPremium": true
}
```

---

### Assessment Endpoints

#### POST /api/assessments

Save a new assessment.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "score": 75,
  "responses": {
    "q1": 3,
    "q2": 2,
    "q3": 4,
    "q4": 1,
    "q5": 3,
    "q6": 2,
    "q7": 4,
    "q8": 3,
    "q9": 2,
    "q10": 4,
    "q11": 1,
    "q12": 3,
    "q13": 2,
    "q14": 4,
    "q15": 3
  }
}
```

**Response (201):**
```json
{
  "success": true
}
```

---

#### GET /api/assessments

Get user's assessment history.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "assessments": [
    {
      "id": "uuid-here",
      "score": 75,
      "responses": { ... },
      "createdAt": "2026-01-14T10:30:00Z"
    },
    {
      "id": "uuid-here-2",
      "score": 68,
      "responses": { ... },
      "createdAt": "2025-12-15T14:00:00Z"
    }
  ]
}
```

---

### Statistics Endpoints

#### GET /api/stats/community

Get community-wide statistics.

**Response (200):**
```json
{
  "success": true,
  "totalAssessments": 1547,
  "averageScore": 62,
  "distribution": {
    "excellent": 15,
    "moderate": 55,
    "needsWork": 30
  }
}
```

---

#### GET /api/stats/compare/:score

Compare a score to community.

**URL Parameter:** `score` (integer 0-100)

**Response (200):**
```json
{
  "success": true,
  "userScore": 75,
  "averageScore": 62,
  "difference": 13,
  "percentile": 78,
  "isAboveAverage": true,
  "isBelowAverage": false,
  "comparison": "above",
  "distribution": {
    "excellent": 15,
    "moderate": 55,
    "needsWork": 30
  }
}
```

Comparison values: `"well above"`, `"above"`, `"at"`, `"below"`, `"well below"`

---

### Payment Endpoints

#### POST /api/payments/create

Create a new Bitcoin payment request.

**Request:**
```json
{
  "email": "user@example.com",
  "plan": "complete",
  "amount": 7.99
}
```

**Response (200):**
```json
{
  "success": true,
  "paymentId": "pay_abc123def456",
  "address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "amountBTC": 0.00008234,
  "amountSats": 8234,
  "usdAmount": 7.99,
  "btcPriceUsd": 97012.45,
  "qrData": "bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh?amount=0.00008234",
  "expiresAt": "2026-01-14T11:00:00Z",
  "priceExpiresIn": 120
}
```

---

#### GET /api/payments/:id/status

Check payment status.

**Response (200) - Pending:**
```json
{
  "success": true,
  "status": "pending",
  "confirmations": 0
}
```

**Response (200) - Confirmed:**
```json
{
  "success": true,
  "status": "confirmed",
  "confirmations": 1,
  "txid": "abc123def456...",
  "pdfPassword": "AbC123XyZ"
}
```

---

#### POST /api/payments/:id/refresh-price

Refresh BTC amount based on current price.

**Response (200):**
```json
{
  "success": true,
  "amountBTC": 0.00008300,
  "amountSats": 8300,
  "btcPriceUsd": 96200.00,
  "qrData": "bitcoin:bc1q...?amount=0.00008300",
  "priceExpiresIn": 120
}
```

---

## 9. Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │   assessments   │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │──────<│ user_id (FK)    │
│ email           │       │ id (PK)         │
│ password_hash   │       │ score           │
│ subscription_*  │       │ responses       │
│ pdf_password    │       │ created_at      │
│ ...             │       └─────────────────┘
└────────┬────────┘
         │
         │         ┌─────────────────┐
         └────────<│ session_tokens  │
         │         ├─────────────────┤
         │         │ user_id (FK)    │
         │         │ id (PK)         │
         │         │ token           │
         │         │ expires_at      │
         │         └─────────────────┘
         │
         │         ┌─────────────────┐
         └────────<│    payments     │
                   ├─────────────────┤
                   │ user_id (FK)    │
                   │ id (PK)         │
                   │ payment_id      │
                   │ amount_*        │
                   │ status          │
                   │ bitcoin_address │
                   └─────────────────┘

┌─────────────────┐
│ community_stats │  (Single row, auto-updated by trigger)
├─────────────────┤
│ id = 1          │
│ total_assess... │
│ average_score   │
│ score_distri... │
└─────────────────┘
```

### Table Definitions

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_level VARCHAR(50) DEFAULT 'free',  -- 'free', 'complete', 'consultation'
  subscription_start TIMESTAMPTZ,
  subscription_end TIMESTAMPTZ,
  pdf_password VARCHAR(50),
  consultation_count INTEGER DEFAULT 0,
  language_preference VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);
```

#### assessments
```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  responses JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### session_tokens
```sql
CREATE TABLE session_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### payments
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_id VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL,
  amount_usd DECIMAL(10,2) NOT NULL,
  amount_btc DECIMAL(18,8),
  btc_price_usd DECIMAL(10,2),
  bitcoin_address VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  confirmations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);
```

#### community_stats
```sql
CREATE TABLE community_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_assessments INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0,
  score_distribution JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);
```

### Database Triggers

**Auto-update community stats after assessment:**
```sql
CREATE TRIGGER trigger_update_community_stats
AFTER INSERT OR DELETE ON assessments
FOR EACH STATEMENT
EXECUTE FUNCTION update_community_stats();
```

**Auto-update user timestamp:**
```sql
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

---

## 10. Frontend Components

### Component Hierarchy

```
App.jsx
├── LandingPage.jsx (when not authenticated)
├── AuthForm.jsx (login/signup/reset)
└── (when authenticated)
    ├── Dashboard.jsx
    ├── Questionnaire.jsx
    ├── Report.jsx
    └── PaymentModal.jsx
```

### LandingPage.jsx

**Purpose:** Public marketing page with value proposition and pricing.

**Key Sections:**
- Hero with headline and CTA
- Feature highlights
- Pricing plans (Free, Complete, Consultation)
- FAQ section

**Dependencies:** `useLanguage` hook, `LanguageToggle` component

---

### AuthForm.jsx

**Purpose:** Handles all authentication flows.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `initialMode` | `'login'` \| `'signup'` | Starting mode |
| `onAuthSuccess` | `(user, token) => void` | Success callback |
| `onBack` | `() => void` | Navigation callback |

**Modes:**
- `login` - Email/password login
- `signup` - New account with password requirements
- `forgot` - Email verification for reset
- `reset` - New password entry

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

### Dashboard.jsx

**Purpose:** User home page showing account status and daily tips.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `user` | `object` | Current user data |
| `onStartAssessment` | `() => void` | Navigate to questionnaire |
| `onLogout` | `() => void` | Handle logout |

**Features:**
- Daily rotating security tips (15 tips, one per day)
- Subscription status display
- Quick action buttons
- Assessment history

---

### Questionnaire.jsx

**Purpose:** 15-question security assessment.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `user` | `object` | Current user data |
| `onComplete` | `(score, responses) => void` | Completion callback |
| `onBack` | `() => void` | Navigation callback |

**Question Categories:**
1. Seed phrase storage
2. Hardware wallet usage
3. Software wallet security
4. Exchange practices
5. Network security
6. Backup strategies
7. Privacy practices
8. Physical security
9. Inheritance planning
10-15. Advanced security practices

---

### Report.jsx

**Purpose:** Score report with recommendations and community comparison.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `user` | `object` | Current user data |
| `score` | `number` | Assessment score (0-100) |
| `responses` | `object` | Question responses |
| `onUpgrade` | `(plan) => void` | Open payment modal |
| `onBack` | `() => void` | Navigation callback |

**Sections:**
- Animated score display
- Score label (Excellent/Good/Fair/Needs Work)
- Community comparison chart
- Distribution bar with "You're here" indicator
- Personalized recommendations (blurred for free users)
- Upgrade CTA

---

### PaymentModal.jsx

**Purpose:** Bitcoin payment interface with QR code.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `plan` | `'complete'` \| `'consultation'` | Selected plan |
| `user` | `object` | Current user data |
| `onSuccess` | `(pdfPassword) => void` | Success callback |
| `onClose` | `() => void` | Close modal |

**Stages:**
- `loading` - Generating payment address
- `payment` - QR code with countdown
- `success` - Confirmation with PDF password
- `expired` - Payment timeout
- `error` - Error display

**Features:**
- Real-time BTC price display
- 2-minute price refresh countdown
- 30-minute payment window
- Copy address button
- Demo mode simulation button

---

## 11. Services

### Database.js (Frontend API Client)

**Location:** `src/services/Database.js`

**Purpose:** Handles all communication with the backend API.

#### Authentication Methods

```javascript
// Create new user
await kywardDB.createUser({ email, password })
// Returns: { success, user, token } or { success: false, message }

// Login
await kywardDB.login(email, password)
// Returns: { success, user, token } or { success: false, message }

// Validate session
await kywardDB.validateSession(token)
// Returns: email string or null

// Logout
await kywardDB.logout()

// Reset password
await kywardDB.resetPassword(email, newPassword)
// Returns: { success, message }
```

#### User Methods

```javascript
// Get user data
await kywardDB.getUser(email)
// Returns: user object or null

// Check if can take assessment
await kywardDB.canTakeAssessment(email)
// Returns: { canTake, remaining, isPremium }

// Check premium access
await kywardDB.hasPremiumAccess(email)
// Returns: boolean

// Upgrade subscription
await kywardDB.upgradeSubscription(email, level)
// Returns: { success, pdfPassword, user }
```

#### Assessment Methods

```javascript
// Save assessment
await kywardDB.saveAssessment(email, { score, responses })
// Returns: boolean

// Get assessment history
await kywardDB.getUserAssessments(email)
// Returns: array of assessments
```

#### Statistics Methods

```javascript
// Get community stats
await kywardDB.getGlobalStats()
// Returns: { totalAssessments, averageScore, distribution }

// Compare score to community
await kywardDB.compareToAverage(userScore)
// Returns: { userScore, averageScore, difference, percentile, comparison, distribution }
```

---

### PaymentService.js

**Location:** `src/services/PaymentService.js`

**Purpose:** Handles Bitcoin payment processing.

#### Configuration

```javascript
const PAYMENT_CONFIG = {
  prices: {
    complete: 7.99,
    consultation: 99,
    consultationAdditional: 49
  },
  pollInterval: 5000,      // 5 seconds
  maxPollAttempts: 360     // 30 minutes
};
```

#### Functions

```javascript
// Get price display
getPriceDisplay(plan)
// Returns: { amount, description, isSubscription?, additionalPrice? }

// Create payment
await createPayment(plan, userEmail)
// Returns: { success, paymentId, address, amountBTC, qrData, ... }

// Refresh price
await refreshPaymentPrice(paymentId)
// Returns: { success, amountBTC, amountSats, btcPriceUsd, qrData, priceExpiresIn }

// Check status
await checkPaymentStatus(paymentId)
// Returns: { success, status, confirmations, txid?, pdfPassword? }

// Poll for confirmation
pollPaymentStatus(paymentId, onStatusChange, onConfirmed, onExpired)
// Returns: stopPolling function

// Simulate payment (demo mode)
await simulatePayment(paymentId, plan, userEmail)
// Returns: { success, status, pdfPassword }
```

---

### database.js (Backend Service)

**Location:** `backend/services/database.js`

**Purpose:** Supabase database operations.

#### Key Functions

```javascript
// Initialize Supabase client
initSupabase()

// User operations
createUser(email, password)
loginUser(email, password)
validateSession(token)
logout(token)
getUserByEmail(email)
userExists(email)
resetPassword(email, newPassword)

// Subscription operations
upgradeSubscription(email, plan)
hasPremiumAccess(email)

// Assessment operations
canTakeAssessment(email)
saveAssessment(email, assessmentData)
getUserAssessments(email)

// Statistics
getCommunityStats()
compareToAverage(userScore)

// Utilities
generatePdfPassword()
```

---

## 12. Internationalization (i18n)

### Supported Languages

| Code | Language | Coverage |
|------|----------|----------|
| `en` | English | 100% |
| `es` | Spanish | 100% |

### Translation Structure

```javascript
// src/i18n/translations.js
export const translations = {
  en: {
    nav: {
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      dashboard: "Dashboard"
    },
    landing: {
      hero: {
        title: "Is Your Bitcoin Secure?",
        subtitle: "Take the free assessment..."
      },
      plans: { ... },
      features: { ... }
    },
    auth: {
      loginTitle: "Welcome Back",
      // ... all auth strings
    },
    dashboard: { ... },
    questionnaire: {
      questions: { ... },
      answers: { ... }
    },
    report: { ... },
    payment: { ... }
  },
  es: {
    // Identical structure in Spanish
  }
};
```

### Using Translations in Components

```javascript
import { useLanguage, LanguageToggle } from '../i18n';

const MyComponent = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t.landing.hero.title}</h1>
      <p>{t.landing.hero.subtitle}</p>
      <LanguageToggle />
    </div>
  );
};
```

### Adding a New Language

**Step 1:** Add translations to `translations.js`:

```javascript
export const translations = {
  en: { ... },
  es: { ... },
  pt: {  // Portuguese
    nav: {
      login: "Entrar",
      signup: "Cadastrar",
      // ... all translations
    },
    // ... all sections
  }
};
```

**Step 2:** Update `LanguageContext.jsx` to include new language in toggle.

---

## 13. Payment System

### Overview

Kyward uses a **non-custodial** Bitcoin payment system. You never hold user funds - payments go directly to your wallet via HD address derivation from your XPUB.

### How XPUB Works

```
Your XPUB (Extended Public Key)
          │
          ▼
   ┌──────────────────┐
   │  BIP32 Derivation │
   │  Path: m/0/index  │
   └──────────────────┘
          │
          ▼
   Unique Bitcoin Address
   (for each payment)
```

**Key Points:**
- XPUB can only **derive addresses**, not spend Bitcoin
- Each payment gets a unique address (prevents tracking)
- Private keys never leave your wallet

### Getting Your XPUB

**Sparrow Wallet (Recommended):**
1. Open Sparrow Wallet
2. Settings → View Extended Public Key
3. Copy the key starting with `zpub`

**Electrum:**
1. Wallet → Information
2. Copy Master Public Key

**BlueWallet:**
1. Wallet → Export/Backup → Watch-only
2. Copy xpub/zpub

### Payment Flow

```
1. User clicks "Upgrade to Complete Plan"
   │
   ▼
2. Frontend → POST /api/payments/create
   │
   ▼
3. Backend:
   ├── Fetch BTC price from mempool.space
   ├── Calculate BTC amount ($7.99 / $97,000 = 0.00008234 BTC)
   ├── Derive unique address from XPUB (index++)
   ├── Create payment record in database
   └── Return payment details
   │
   ▼
4. Frontend displays:
   ├── QR code with bitcoin: URI
   ├── Address (copy button)
   ├── Exact BTC amount
   ├── Current BTC/USD rate
   ├── 2-minute price countdown
   └── 30-minute payment expiry
   │
   ▼
5. User sends Bitcoin from their wallet
   │
   ▼
6. Frontend polls every 5 seconds:
   GET /api/payments/:id/status
   │
   ▼
7. Backend checks mempool.space for transaction
   │
   ▼
8. When transaction detected:
   ├── Update payment status to "confirmed"
   ├── Upgrade user subscription
   ├── Generate PDF password
   └── Return success
   │
   ▼
9. Frontend shows success + PDF password
```

### Price Refresh

- BTC price is locked for **2 minutes**
- After expiry, price auto-refreshes (or user clicks "Refresh Now")
- New BTC amount calculated, QR code updated
- Payment window is **30 minutes total**

### Demo Mode

When `DEMO_ADDRESS` is set in backend `.env`:
- Uses static address instead of XPUB derivation
- "Simulate Payment" button appears
- Useful for testing without real transactions
- Remove in production

---

## 14. Security

### Authentication Security

| Measure | Implementation |
|---------|----------------|
| Password Hashing | SHA-256 with configurable salt |
| Session Tokens | 64-character cryptographically random hex |
| Token Expiry | 30 days, stored in database |
| Token Validation | Checked on every protected request |

### Database Security

| Measure | Implementation |
|---------|----------------|
| Row Level Security | Enabled on all tables |
| Service Role Key | Backend only, never exposed to frontend |
| Connection Encryption | TLS via Supabase |

### API Security

| Measure | Implementation |
|---------|----------------|
| CORS | Configured for specific frontend origin |
| Input Validation | Email format, password strength |
| Authorization Header | Bearer token required for protected routes |

### Payment Security

| Measure | Implementation |
|---------|----------------|
| Non-Custodial | XPUB only, no private keys on server |
| Unique Addresses | One address per payment (privacy) |
| BIP32 Standard | Industry-standard HD derivation |
| Price Lock | 2-minute window prevents manipulation |

### Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Rotate PASSWORD_SALT** periodically
3. **Use HTTPS** in production (automatic on Vercel/Railway)
4. **Monitor payment addresses** for unusual activity
5. **Keep dependencies updated** - Run `npm audit` regularly

### Environment Variable Security

```bash
# Generate a secure salt:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 15. Deployment

### Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │     │    Railway      │     │    Supabase     │
│   (Frontend)    │────▶│   (Backend)     │────▶│   (Database)    │
│   Free tier     │     │   ~$5/month     │     │   Free tier     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲
        │
┌─────────────────┐
│   Cloudflare    │
│   (Domain)      │
│   ~$10/year     │
└─────────────────┘
```

### Step-by-Step Deployment

See `DEPLOYMENT-CHECKLIST.md` for detailed instructions.

**Quick Summary:**

1. **Supabase:** Create project, run `schema.sql`
2. **Railway:** Deploy `/backend`, set environment variables
3. **Vercel:** Deploy frontend, set `VITE_API_URL`
4. **Domain:** Configure DNS, update CORS

### Cost Estimate

| Service | Purpose | Cost |
|---------|---------|------|
| Supabase | Database | Free (500MB) |
| Vercel | Frontend | Free |
| Railway | Backend | ~$5/month |
| Cloudflare | Domain | ~$10/year |
| **Total** | | **~$70/year** |

---

## 16. Troubleshooting

### Common Issues

#### "Failed to fetch" Error

**Symptoms:** API calls fail, network errors in console

**Solutions:**
1. Check backend is running: `curl http://localhost:3001/api/health`
2. Verify `VITE_API_URL` in frontend `.env`
3. Check CORS: `FRONTEND_URL` must match actual frontend URL
4. Check browser DevTools Network tab for details

---

#### Login Not Working

**Symptoms:** Correct credentials rejected, session not persisting

**Solutions:**
1. Check Supabase connection (URL and key)
2. Verify `PASSWORD_SALT` is set and consistent
3. Check `session_tokens` table in Supabase
4. Clear browser localStorage and retry

---

#### Payment Not Detecting

**Symptoms:** Transaction sent but not detected

**Solutions:**
1. Verify XPUB format (zpub recommended for native segwit)
2. Check mempool.space is accessible from backend
3. Wait 10-30 seconds for mempool propagation
4. Verify exact amount was sent (to the satoshi)
5. Check backend logs for API errors

---

#### Emails Not Sending

**Symptoms:** No email after payment or password reset

**Solutions:**
1. Use App Password for Gmail (not regular password)
2. Verify all SMTP settings (`SMTP_HOST`, `SMTP_PORT`, etc.)
3. Check spam/junk folder
4. Try Brevo as alternative (free tier)
5. Check backend logs for SMTP errors

---

#### Language Not Switching

**Symptoms:** Toggle doesn't change language, mixed languages

**Solutions:**
1. Clear browser localStorage
2. Check `translations.js` for missing keys
3. Verify `LanguageProvider` wraps entire `App`
4. Check browser console for undefined translation errors

---

#### Database Errors

**Symptoms:** 500 errors, data not saving

**Solutions:**
1. Re-run `schema.sql` in Supabase SQL Editor
2. Verify `SUPABASE_SERVICE_KEY` (not anon key)
3. Check Supabase dashboard for table existence
4. Review RLS policies if data access issues

---

### Debug Logging

**Frontend (Database.js):**
```javascript
async apiRequest(endpoint, options = {}) {
  console.log('API Request:', endpoint, options);
  // ... existing code
  console.log('API Response:', data);
}
```

**Backend (server.js):**
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});
```

---

## 17. Changelog

### Version 2.0 (January 2026)

**Major Changes:**
- Migrated to Supabase PostgreSQL database
- Added complete Spanish translation
- Updated pricing: Complete $7.99/month, Consultation $99/$49
- Implemented proper backend API with Express.js
- Added session token authentication

**New Features:**
- Language toggle component
- Community comparison chart
- Daily rotating tips
- Real-time BTC pricing with 2-minute refresh
- Comprehensive deployment documentation

---

### Version 1.1

**Features:**
- Telegram-style blur effects for premium content
- Community score comparison
- Real-time BTC pricing from mempool.space
- Password visibility toggle with animation

---

### Version 1.0

**Initial Release:**
- 15-question security assessment
- Score calculation and basic recommendations
- Bitcoin payment processing
- PDF report generation
- Email delivery

---

## License

Proprietary - All Rights Reserved

---

*Documentation generated for Kyward v2.0*
*Last updated: January 2026*
