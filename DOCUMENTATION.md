# Kyward - Bitcoin Security Assessment Platform

## Complete Technical Documentation

**Version:** 1.0.0
**Last Updated:** January 2025

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Frontend Structure](#frontend-structure)
4. [Backend Structure](#backend-structure)
5. [Database Schema](#database-schema)
6. [API Reference](#api-reference)
7. [Component Documentation](#component-documentation)
8. [Service Documentation](#service-documentation)
9. [Internationalization (i18n)](#internationalization-i18n)
10. [Payment Flow](#payment-flow)
11. [Subscription Tiers](#subscription-tiers)
12. [Environment Variables](#environment-variables)

---

## Project Overview

Kyward is a Bitcoin security assessment platform that helps users evaluate and improve their cryptocurrency security practices. The platform provides:

- **Security Assessment Questionnaire**: 15-question assessment covering hardware wallets, seed backup, multisig, inheritance, and more
- **Personalized Recommendations**: AI-generated security tips based on assessment responses
- **Subscription Tiers**: Free, Essential ($7.99), Sentinel ($14.99/mo), and Consultation ($99)
- **Bitcoin Payments**: Native Bitcoin payment integration using HD wallet (XPUB) address derivation
- **Multi-language Support**: English and Spanish translations

---

## Architecture

```
kyward/
├── src/                          # Frontend (React + Vite)
│   ├── components/               # React components
│   ├── services/                 # Frontend services
│   ├── styles/                   # Theme and styles
│   └── i18n/                     # Internationalization
├── backend/                      # Backend (Express.js)
│   ├── services/                 # Backend services
│   └── server.js                 # Main server file
└── public/                       # Static assets
```

### Tech Stack

**Frontend:**
- React 18
- Vite (build tool)
- CSS-in-JS (inline styles)

**Backend:**
- Node.js + Express
- Supabase (PostgreSQL)
- Bitcoin HD wallet (BIP32/BIP84)

---

## Frontend Structure

### Entry Point

#### `src/main.jsx`
Application entry point that renders the root React component.

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(<KywardApp />)
```

---

### `src/App.jsx`

Main application component managing global state and routing.

#### State Variables
| Variable | Type | Description |
|----------|------|-------------|
| `currentPage` | string | Current page: 'landing', 'login', 'signup', 'dashboard', 'questionnaire', 'report' |
| `user` | object/null | Authenticated user data |
| `lastResults` | object/null | Latest assessment results (score, responses) |
| `paymentModal` | object/null | Active payment modal: `{ plan: string }` |

#### Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `handleAssessmentComplete` | `results: {score, responses}` | Called when questionnaire is completed. Sets results and navigates to report |
| `handleUpgrade` | `level: string` | Opens payment modal for specified plan |
| `handlePaymentSuccess` | `pdfPassword: string` | Refreshes user data after successful payment |
| `handleLogout` | none | Clears user state and returns to landing |
| `renderPage` | none | Returns appropriate component based on currentPage |

---

## Component Documentation

### `src/components/LandingPage.jsx`

Public landing page with marketing content and pricing.

#### Props
| Prop | Type | Description |
|------|------|-------------|
| `onLogin` | function | Callback to navigate to login |
| `onSignup` | function | Callback to navigate to signup |

#### Sections
1. **Navigation**: Logo, language toggle, login/signup buttons
2. **Hero**: Main headline, CTA, statistics, mockup card
3. **PVU Section**: 4 value proposition cards
4. **How It Works**: 3-step process explanation
5. **Pricing**: 4-tier pricing grid (horizontal scrollable)
6. **Footer**: Links and social media

---

### `src/components/AuthForm.jsx`

Authentication form for login and signup.

#### Props
| Prop | Type | Description |
|------|------|-------------|
| `initialMode` | string | 'login' or 'signup' |
| `onAuthSuccess` | function | Callback with user data on success |
| `onBack` | function | Callback to return to landing |

#### State
| State | Type | Description |
|-------|------|-------------|
| `mode` | string | Current mode ('login', 'signup', 'forgot') |
| `email` | string | Email input value |
| `password` | string | Password input value |
| `confirmPassword` | string | Confirm password (signup only) |
| `loading` | boolean | Loading state |
| `error` | string | Error message |

#### Password Validation (Signup)
- Minimum 8 characters
- Contains uppercase letter
- Contains lowercase letter
- Contains number

---

### `src/components/Dashboard.jsx`

Main dashboard for authenticated users.

#### Props
| Prop | Type | Description |
|------|------|-------------|
| `user` | object | Current user data |
| `setUser` | function | Function to update user state |
| `onStartAssessment` | function | Navigate to questionnaire |
| `onLogout` | function | Logout callback |
| `onUpgrade` | function | Open upgrade modal |
| `onViewReport` | function | View historical assessment |

#### Key Features
1. **User Stats Grid**: Score, assessments taken, subscription level
2. **CTA Card**: Start new assessment or upgrade prompt
3. **Daily Security Tip**: Rotating tips based on day of year
4. **Assessment History**: List of past assessments with scores and dates
5. **Quick Actions**: Upgrade buttons for non-premium users

#### Functions

| Function | Description |
|----------|-------------|
| `getDailyTipKey()` | Returns tip key based on day of year |
| `getDaysUntilNextAssessment()` | Calculates days until free user can take another assessment |
| `getScoreTrend()` | Compares current score to previous assessment |

#### Assessment Gating Logic
- **Free**: 1 assessment per 30 days
- **Essential**: 1 assessment total (one-time purchase)
- **Sentinel/Consultation**: Unlimited assessments

---

### `src/components/Questionnaire.jsx`

15-question security assessment questionnaire.

#### Props
| Prop | Type | Description |
|------|------|-------------|
| `user` | object | Current user data |
| `setUser` | function | Update user state |
| `onComplete` | function | Callback with results |
| `onCancel` | function | Return to dashboard |

#### Question Structure
```javascript
{
  id: 'q1',           // Question identifier
  type: 'radio',      // 'radio' or 'checkbox'
  options: [
    { value: 'yes', points: 15 },
    { value: 'sometimes', points: 8 },
    { value: 'no', points: 0 }
  ]
}
```

#### Scoring Algorithm
```javascript
score = (totalPoints / maxPossiblePoints) * 100
// Clamped to 0-100 range
```

#### Questions Covered
1. Hardware wallet usage
2. Backup methods (single/multiple/digital)
3. Storage types (metal, paper, vault, etc.)
4. Passphrase (25th word) usage
5. Recovery testing frequency
6. Multisig setup
7. Address verification method
8. Cold storage percentage
9. Address reuse habits
10. Software update practices
11. Seed phrase sharing
12. Dedicated device usage
13. Inheritance planning
14. UTXO knowledge level
15. Security review frequency

---

### `src/components/Report.jsx`

Security report displaying assessment results.

#### Props
| Prop | Type | Description |
|------|------|-------------|
| `score` | number | Assessment score (0-100) |
| `answers` | object | Question responses |
| `user` | object | Current user data |
| `setUser` | function | Update user state |
| `onBackToDashboard` | function | Navigate back |
| `onUpgrade` | function | Open upgrade modal |
| `onStartAssessment` | function | Take new assessment |

#### Score Levels
| Range | Label | Color |
|-------|-------|-------|
| 80-100 | Excellent | Green (#22c55e) |
| 50-79 | Good | Orange (#F7931A) |
| 0-49 | Needs Work | Red (#ef4444) |

#### Content Sections
1. **Score Card**: Visual score display with SVG ring
2. **Comparison Stats**: Percentile vs community, average
3. **Recommendations**: Personalized security tips
4. **Locked Section**: Preview of premium recommendations
5. **Upgrade CTA**: Premium plan options
6. **PDF/Email Actions**: For premium users

---

### `src/components/PaymentModal.jsx`

Bitcoin payment modal for plan upgrades.

#### Props
| Prop | Type | Description |
|------|------|-------------|
| `plan` | string | Plan to purchase: 'essential', 'sentinel', 'consultation' |
| `user` | object | Current user data |
| `onSuccess` | function | Callback with PDF password on success |
| `onClose` | function | Close modal |

#### Payment States
1. **Loading**: Creating payment address
2. **Waiting**: Displaying QR code and address
3. **Confirming**: Transaction detected, waiting confirmations
4. **Success**: Payment confirmed, showing PDF password
5. **Expired**: Payment window expired
6. **Error**: Payment creation failed

#### Functions
| Function | Description |
|----------|-------------|
| `initializePayment()` | Creates payment request via API |
| `checkStatus()` | Polls payment status every 5 seconds |
| `handleCopyAddress()` | Copies Bitcoin address to clipboard |
| `handleSimulatePayment()` | Demo mode payment simulation |

---

### `src/components/TelegramBlur.jsx`

Decorative blur effect component for premium content.

#### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `height` | number | 150 | Height in pixels |
| `children` | node | - | Content to display over blur |

---

### `src/components/Footer.jsx`

Site footer with links and social media.

#### Sections
- Company links (About, How It Works, FAQ)
- Legal links (Terms, Privacy)
- Contact information
- Social media icons (Twitter/X, Telegram, GitHub)
- Bitcoin-only badge

---

## Service Documentation

### `src/services/Database.js`

Frontend API client for all database operations.

#### Class: `KywardDatabase`

##### Constructor
```javascript
constructor() {
  this.TOKEN_KEY = 'kyward_session_token';
  this.USER_CACHE_KEY = 'kyward_user_cache';
}
```

##### Token Management
| Method | Description |
|--------|-------------|
| `getToken()` | Retrieves JWT from localStorage |
| `setToken(token)` | Stores or removes JWT |
| `getCachedUser()` | Gets cached user from localStorage |
| `setCachedUser(user)` | Caches user data |

##### API Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `apiRequest(endpoint, options)` | endpoint: string, options: object | Promise<object> | Generic API request helper |
| `createUser(userData)` | userData: {email, password} | Promise<{success, user, token}> | Register new user |
| `login(email, password)` | email, password: string | Promise<{success, user, token}> | Authenticate user |
| `validateSession()` | none | Promise<user/null> | Validate current JWT |
| `logout()` | none | Promise<void> | Invalidate session |
| `getUser(forceRefresh)` | forceRefresh: boolean | Promise<user/null> | Get current user data |
| `saveAssessment(assessment)` | assessment: {score, responses} | Promise<{success}> | Save assessment |
| `getUserAssessments()` | none | Promise<Assessment[]> | Get user's assessments |
| `canTakeNewAssessment()` | none | Promise<boolean> | Check if user can take assessment |
| `upgradeSubscription(plan)` | plan: string | Promise<{success, user}> | Upgrade user plan |
| `compareToAverage(score)` | score: number | Promise<ComparisonData> | Get score comparison |

##### Normalization Functions

**`normalizeUser(user)`**
Ensures consistent field naming between camelCase and snake_case:
- `assessments_taken` / `assessmentsTaken`
- `subscriptionLevel` / `subscription`
- `lastAssessmentDate` / `last_assessment_date`
- `pdfPassword` / `pdf_password`

**`normalizeAssessment(assessment)`**
Normalizes assessment timestamp fields:
- `timestamp` / `created_at` / `createdAt`
- `userId` / `user_id`

---

### `src/services/PaymentService.js`

Bitcoin payment handling service.

#### Configuration
```javascript
const PAYMENT_CONFIG = {
  prices: {
    essential: 7.99,
    sentinel: 14.99,
    consultation: 99,
    consultation_additional: 49
  },
  pollInterval: 5000,      // 5 seconds
  maxPollAttempts: 360     // 30 minutes max
};
```

#### Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getPriceDisplay(plan)` | plan: string | PriceInfo | Get formatted price info |
| `createPayment(plan, userEmail)` | plan, email: string | Promise<PaymentData> | Create new payment |
| `refreshPaymentPrice(paymentId)` | paymentId: string | Promise<RefreshData> | Refresh BTC amount |
| `checkPaymentStatus(paymentId)` | paymentId: string | Promise<StatusData> | Check payment status |
| `pollPaymentStatus(id, onChange, onConfirm, onExpire)` | callbacks | StopFunction | Start polling |
| `simulatePayment(paymentId, plan, email)` | ... | Promise<{success}> | Demo mode simulation |

---

### `src/services/Recommendations.js`

Security recommendation engine.

#### Exported Objects

**`allRecommendations`**
Object containing all possible recommendations:

```javascript
{
  hardware_wallet: {
    id: 'hardware_wallet',
    category: 'Storage',
    priority: 'critical',
    title: 'Use a Hardware Wallet',
    shortTip: 'Move your Bitcoin to a hardware wallet...',
    fullTip: 'Detailed explanation...',
    trigger: (answers) => answers.q1 === 'no'
  },
  // ... more recommendations
}
```

#### Categories
- **Storage**: Hardware wallets, cold storage
- **Backup**: Metal backup, multiple locations, recovery testing
- **Security**: Passphrase, multisig, address verification, software updates
- **Privacy**: Address reuse, UTXO management
- **Inheritance**: Estate planning
- **Maintenance**: Regular security reviews

#### Priority Levels
1. `critical` - Immediate action required
2. `high` - Should address soon
3. `medium` - Important improvement
4. `low` - Nice to have

#### Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `generateRecommendations(answers, score)` | answers: object, score: number | Recommendation[] | Generate personalized tips |
| `getFreeTips(recommendations)` | recommendations: array | Recommendation[] | First 3 tips (free) |
| `getLockedTipsPreview(recommendations)` | recommendations: array | LockedTip[] | Premium tips preview |
| `generateInheritancePlan(answers, score, email)` | ... | InheritancePlan | Full inheritance plan |

---

### `src/services/PdfGenerator.js`

PDF generation service for security reports.

#### Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `openPdfPreview(user, score, recommendations)` | user, score, recs | Opens PDF in new tab |

---

### `src/services/EmailService.js`

Email service for sending reports.

#### Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `previewEmail(user, score, recommendations)` | user, score, recs | Preview email content |
| `sendEmail(user, score, recommendations)` | user, score, recs | Send email via API |

---

## Backend Structure

### `backend/server.js`

Main Express server with all API routes.

#### Middleware
- `express.json()` - JSON body parser
- `cors()` - CORS configuration for allowed origins
- `authMiddleware` - JWT authentication

#### Allowed Origins
```javascript
[
  'https://www.kyward.com',
  'https://kyward.com',
  'http://localhost:5173',
  '*.vercel.app'  // All Vercel preview deployments
]
```

---

### `backend/services/database.js`

Supabase database operations.

#### Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `createUser(email, password)` | email, password | {success, user} | Create new user |
| `loginUser(email, password)` | email, password | {success, user, token} | Authenticate user |
| `validateSession(token)` | token: string | user/null | Validate JWT |
| `logout(token)` | token: string | void | Invalidate session |
| `getUserByEmail(email)` | email: string | user/null | Get user by email |
| `userExists(email)` | email: string | boolean | Check if user exists |
| `resetPassword(email, newPassword)` | email, password | {success} | Reset password |
| `saveAssessment(userId, score, responses, timestamp)` | ... | boolean | Save assessment |
| `getUserAssessments(email)` | email: string | Assessment[] | Get user assessments |
| `canTakeAssessment(email)` | email: string | {canTake, reason} | Check assessment permission |
| `upgradeSubscription(email, plan)` | email, plan | {success, pdfPassword} | Upgrade user plan |
| `hasPremiumAccess(email)` | email: string | boolean | Check premium status |
| `getCommunityStats()` | none | StatsData | Get aggregate stats |
| `compareToAverage(score)` | score: number | ComparisonData | Compare to community |
| `sanitizeUser(user)` | user: object | object | Remove sensitive fields |

#### Helper Functions
| Function | Description |
|----------|-------------|
| `hashPassword(password)` | SHA-256 hash with salt |
| `generateSessionToken()` | Random 32-byte hex token |
| `generatePdfPassword()` | 12-char alphanumeric password |

---

### `backend/services/bitcoin.js`

Bitcoin price and address generation.

#### Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getBtcPrice()` | none | {price, cached, expiresIn} | Get cached BTC price |
| `usdToSats(usdAmount)` | usdAmount: number | {sats, btcAmount, priceUsd} | Convert USD to satoshis |
| `generatePaymentAddress(paymentId)` | paymentId: string | {success, address, index} | Generate HD wallet address |
| `checkAddressPayment(address, expectedSats)` | address, sats | {paid, txid, confirmations} | Check for payment |

#### Price Caching
- Price cached for 2 minutes
- Uses CoinGecko API as primary source
- Fallback to Blockchain.info

---

### `backend/services/email.js`

Email sending via SMTP.

#### Functions

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `sendPaymentConfirmation(email, plan, pdfPassword)` | ... | {success} | Send payment confirmation |
| `sendSecurityPlan(email, pdfPassword, htmlContent)` | ... | {success} | Send security report |

---

### `backend/services/paymentStore.js`

In-memory payment storage.

#### Functions

| Function | Parameters | Description |
|----------|------------|-------------|
| `savePayment(payment)` | payment: object | Store payment |
| `getPayment(paymentId)` | paymentId: string | Retrieve payment |
| `updatePayment(paymentId, updates)` | id, updates | Update payment |
| `deletePayment(paymentId)` | paymentId: string | Remove payment |
| `cleanExpiredPayments()` | none | Remove old payments |

---

## API Reference

### Authentication

#### POST `/api/auth/signup`
Create new user account.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "user": { /* user object */ },
  "token": "jwt_token_here"
}
```

#### POST `/api/auth/login`
Authenticate existing user.

#### POST `/api/auth/logout`
Invalidate session (requires auth).

#### GET `/api/auth/validate`
Validate current JWT (requires auth).

#### POST `/api/auth/reset-password`
Reset user password.

---

### User

#### GET `/api/user`
Get current user data (requires auth).

#### GET `/api/user/usage`
Get assessment usage status (requires auth).

**Response:**
```json
{
  "canTake": true,
  "assessmentsTaken": 1,
  "limit": "unlimited",
  "nextAvailable": null
}
```

#### GET `/api/user/premium`
Check premium access status (requires auth).

---

### Assessments

#### POST `/api/assessments`
Save new assessment (requires auth).

**Body:**
```json
{
  "score": 75,
  "responses": {
    "q1": "yes",
    "q2": "multiple",
    "q3": ["metal", "paper"]
  }
}
```

#### GET `/api/assessments`
Get user's assessment history (requires auth).

---

### Statistics

#### GET `/api/stats/community`
Get community statistics.

#### GET `/api/stats/compare/:score`
Compare score to community average.

---

### Payments

#### POST `/api/payments/create`
Create new payment request.

**Body:**
```json
{
  "email": "user@example.com",
  "plan": "essential"
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "uuid",
  "address": "bc1q...",
  "amountBTC": 0.00008,
  "amountSats": 8000,
  "usdAmount": 7.99,
  "qrData": "bitcoin:bc1q...?amount=0.00008",
  "expiresAt": "2025-01-19T20:00:00Z"
}
```

#### GET `/api/payments/:paymentId/status`
Check payment status.

#### POST `/api/payments/:paymentId/refresh-price`
Refresh BTC amount for price changes.

#### POST `/api/payments/:paymentId/simulate`
Simulate payment (demo mode only).

---

### Pricing

#### GET `/api/pricing`
Get current plan prices.

#### GET `/api/price`
Get current BTC/USD price.

---

## Internationalization (i18n)

### Structure

```
src/i18n/
├── index.js              # Export all i18n modules
├── translations.js       # EN/ES translation strings
└── LanguageContext.jsx   # React context provider
```

### Usage

```jsx
import { useLanguage, LanguageToggle } from '../i18n';

const MyComponent = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t.dashboard.welcome}</h1>
      <LanguageToggle />
    </div>
  );
};
```

### Available Languages
- `en` - English (default)
- `es` - Spanish

---

## Subscription Tiers

### Free
- **Price**: $0
- **Assessments**: 1 per 30 days
- **Features**: Basic score, top 3 recommendations

### Essential
- **Price**: $7.99 (one-time)
- **Assessments**: 1 total (per purchase)
- **Features**: Full recommendations, PDF download, email support

### Sentinel
- **Price**: $14.99/month
- **Assessments**: Unlimited
- **Features**: All Essential features + hack alerts, wallet reviews, daily tips

### Consultation
- **Price**: $99 (first session)
- **Assessments**: Unlimited
- **Features**: All Sentinel features + 1-hour private consultation, priority support

---

## Environment Variables

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (.env)

```env
# Server
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Security
PASSWORD_SALT=your-secure-salt

# Bitcoin
XPUB=your-xpub-key

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
SMTP_FROM=noreply@kyward.com

# Optional
DEMO_MODE=true  # Enable payment simulation
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  subscription_level TEXT DEFAULT 'free',
  pdf_password TEXT,
  payment_type TEXT DEFAULT 'none',
  essential_assessment_id UUID,
  assessments_taken INTEGER DEFAULT 0,
  last_assessment_date TIMESTAMP,
  consultation_count INTEGER DEFAULT 0,
  email_hack_alerts BOOLEAN DEFAULT false,
  email_daily_tips BOOLEAN DEFAULT false,
  email_wallet_reviews BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  last_login TIMESTAMP
);
```

### Assessments Table
```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  score INTEGER NOT NULL,
  responses JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### Session Tokens Table
```sql
CREATE TABLE session_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## Styles

### `src/styles/Theme.jsx`

Central theme file containing all styles as JavaScript objects.

#### Key Style Objects
- `landingContainer`, `nav`, `hero` - Landing page
- `authContainer`, `authCard` - Authentication
- `dashboardContainer`, `dashStats` - Dashboard
- `questionCard`, `optionItem` - Questionnaire
- `reportContainer`, `reportScoreCard` - Report
- `pricingCard`, `pricingGrid` - Pricing

#### Responsive Breakpoints
- **Mobile**: `max-width: 768px`
- **Small Mobile**: `max-width: 480px`
- **Desktop**: `min-width: 769px`
- **Large Desktop**: `min-width: 1200px`

#### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Bitcoin Orange | #F7931A | Primary accent, CTAs |
| Success Green | #22c55e | Good scores, success states |
| Error Red | #ef4444 | Errors, low scores |
| Purple | #a855f7 | Consultation tier |
| Blue | #3b82f6 | Info, links |
| Dark BG | #000000 | Main background |
| Card BG | #1a1a1a | Card backgrounds |
| Border | #2a2a2a | Borders |
| Text Gray | #9ca3af | Secondary text |
| Text Light | #E5E5E5 | Primary text |

---

## Development

### Running Locally

```bash
# Frontend
cd kyward
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

### Building for Production

```bash
# Frontend
npm run build

# Backend (deploy to hosting service)
```

### Testing Payments

1. Set `DEMO_MODE=true` in backend .env
2. Create payment as normal
3. Click "Simulate Payment" button in modal
4. Payment will be marked as confirmed

---

## Security Considerations

1. **Passwords**: SHA-256 hashed with salt
2. **Sessions**: 32-byte random tokens, 30-day expiry
3. **CORS**: Strict origin whitelist
4. **Bitcoin**: HD wallet derivation, never stores private keys
5. **Data**: No wallet addresses or private keys stored

---

*End of Documentation*
