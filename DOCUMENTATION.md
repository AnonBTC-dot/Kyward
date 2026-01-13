# KYWARD - Complete Documentation

## What is Kyward?

Kyward is a **Bitcoin Security Assessment Platform** that helps Bitcoin holders evaluate how safely they're storing their Bitcoin and provides personalized recommendations to improve their security. Think of it as a "security checkup" for your Bitcoin, similar to how a doctor gives you a health checkup.

### The Problem It Solves

Many Bitcoin holders:
- Don't know if they're storing their Bitcoin safely
- Have no inheritance plan (their Bitcoin could be lost forever)
- Don't understand complex security concepts like multi-signature or hardware wallets
- Are overwhelmed by technical jargon

Kyward solves this by asking simple questions and providing easy-to-understand recommendations.

### Key Features

- **15-Question Security Assessment** - Comprehensive quiz covering all aspects of Bitcoin security
- **Personalized Recommendations** - Tailored advice based on your specific answers
- **Community Comparison** - See how your score compares to the average Bitcoin holder
- **Telegram-Style Blur Effects** - Premium content preview with animated blur effects
- **Real-Time BTC Pricing** - Payments use live Bitcoin prices from mempool.space
- **Password-Protected PDF Reports** - Secure downloadable security plans
- **Inheritance Planning** - Step-by-step Liana wallet inheritance setup guide

---

## How It Works (User Journey)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         KYWARD USER FLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   1. LANDING PAGE                                                   │
│      ↓                                                              │
│   2. SIGN UP / LOGIN                                                │
│      ↓                                                              │
│   3. DASHBOARD (See your account & history)                         │
│      ↓                                                              │
│   4. QUESTIONNAIRE (15 security questions)                          │
│      ↓                                                              │
│   5. REPORT (Your score + recommendations)                          │
│      ↓                                                              │
│   ┌─────────────────┬─────────────────────────────────┐             │
│   │  FREE USER      │  PAID USER                      │             │
│   │  See 3 tips     │  See ALL tips                   │             │
│   │  Basic advice   │  Download PDF                   │             │
│   │       ↓         │  Email report                   │             │
│   │  UPGRADE        │  Inheritance plan               │             │
│   │  ($10 or $100)  │                                 │             │
│   └─────────────────┴─────────────────────────────────┘             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step:

1. **Visit Website** - User sees the landing page explaining the service
2. **Create Account** - Email and password (stored locally in browser)
3. **Take Assessment** - Answer 15 questions about their Bitcoin security
4. **Get Score** - Receive a security score from 0-100
5. **View Recommendations** - See personalized tips to improve security
6. **Upgrade (Optional)** - Pay with Bitcoin to unlock all features
7. **Download PDF** - Get a complete inheritance and security plan

---

## Pricing Tiers

| Plan | Price | What You Get |
|------|-------|--------------|
| **Starter** | Free | Questionnaire + 3 basic tips |
| **Complete** | $10 (one-time) | All tips + PDF report + email delivery |
| **Consultation** | $100 (one-time) | Everything + 60-min video call + custom plan |

---

## Project Structure Explained

Think of the project like a restaurant:
- **Frontend** = The dining room (what customers see)
- **Backend** = The kitchen (where the work happens)
- **Database** = The recipe book (stores information)

```
Kyward/
│
├── src/                      # FRONTEND (What users see)
│   ├── components/           # Visual elements (pages, buttons, forms)
│   ├── services/             # Business logic (calculations, data)
│   └── styles/               # Visual design (colors, fonts)
│
├── backend/                  # BACKEND (Server that processes payments)
│   ├── server.js             # Main server file
│   └── services/             # Payment and email handling
│
└── Configuration files       # Settings and setup
```

---

## Frontend Files Explained

### Main Application Files

| File | What It Does | Simple Explanation |
|------|--------------|-------------------|
| `src/App.jsx` | Main controller | Like a traffic controller - decides which page to show |
| `src/main.jsx` | Starter | Turns on the app |
| `index.html` | Container | The "frame" that holds everything |

### Pages (Components)

| File | What It Does | Simple Explanation |
|------|--------------|-------------------|
| `LandingPage.jsx` | Homepage | First page visitors see with marketing info |
| `AuthForm.jsx` | Login/Signup | Where users create account or sign in |
| `Dashboard.jsx` | User Home | Personal page showing score and history |
| `Questionnaire.jsx` | Quiz | The 15 security questions |
| `Report.jsx` | Results | Shows score and recommendations |
| `PaymentModal.jsx` | Payment | Bitcoin payment popup with QR code |

### Services (Behind the Scenes)

| File | What It Does | Simple Explanation |
|------|--------------|-------------------|
| `Database.js` | Stores data | Remembers users and their scores (in browser) |
| `PaymentService.js` | Handles payments | Talks to backend for Bitcoin payments |
| `Recommendations.js` | Generates tips | Creates personalized advice based on answers |
| `PdfGenerator.js` | Creates PDFs | Builds the security plan document |
| `EmailService.js` | Sends emails | Delivers the PDF to user's inbox |
| `Theme.jsx` | Visual design | All colors, fonts, and styling |

### Special Components

| File | What It Does | Simple Explanation |
|------|--------------|-------------------|
| `TelegramBlur.jsx` | Animated blur effect | Creates a Telegram-style blur with floating stars, moving shadows, and shimmer effects for premium content preview |

---

## Backend Files Explained

| File | What It Does | Simple Explanation |
|------|--------------|-------------------|
| `server.js` | Main server | Receives and responds to requests |
| `bitcoin.js` | Bitcoin logic | Creates payment addresses, checks if paid |
| `email.js` | Email sender | Sends confirmation and plan emails |
| `paymentStore.js` | Payment memory | Remembers pending payments |

---

## The 15 Security Questions

1. Do you use a hardware wallet?
2. How often do you backup your seed phrase?
3. Where do you store your backups?
4. Do you use a passphrase (25th word)?
5. Have you tested recovering your wallet?
6. Do you use multi-signature?
7. How do you verify addresses?
8. What percentage is in cold storage?
9. Do you reuse addresses?
10. How do you verify software updates?
11. Have you shared your seed phrase?
12. Do you use a dedicated Bitcoin device?
13. Do you have an inheritance plan?
14. Do you know about UTXO management?
15. How often do you review security?

---

## How Payments Work

```
┌─────────────────────────────────────────────────────────────────────┐
│                      BITCOIN PAYMENT FLOW                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   1. User clicks "Upgrade"                                          │
│      ↓                                                              │
│   2. Frontend asks Backend for payment address                      │
│      ↓                                                              │
│   3. Backend fetches LIVE BTC price from mempool.space              │
│      ↓                                                              │
│   4. Backend generates unique Bitcoin address from your XPUB        │
│      ↓                                                              │
│   5. User sees QR code + address + EXACT BTC amount                 │
│      (e.g., $10 = 0.00010526 BTC at $95,000/BTC)                    │
│      ↓                                                              │
│   6. 2-MINUTE PRICE COUNTDOWN starts                                │
│      (Price auto-refreshes to protect against volatility)           │
│      ↓                                                              │
│   7. User sends Bitcoin from their wallet                           │
│      ↓                                                              │
│   8. Frontend checks every 5 seconds: "Payment received?"           │
│      ↓                                                              │
│   9. Backend checks blockchain via mempool.space                    │
│      ↓                                                              │
│   10. Payment confirmed → User upgraded → Email sent with password  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Payment Features

- **Real-Time BTC Pricing**: Fetches current price from mempool.space API
- **2-Minute Price Lock**: Price is valid for 2 minutes, then auto-refreshes
- **30-Minute Payment Window**: Total time to complete payment
- **Exact BTC Amounts**: Shows precise amount (e.g., 0.00010526 BTC for $10)
- **Manual Refresh**: Users can refresh price anytime
- **QR Code Updates**: QR automatically updates with new amount after refresh

**Key Point**: You receive payments directly to your own wallet (via XPUB). Kyward never holds any Bitcoin.

---

## Community Comparison Feature

After completing an assessment, users see how their score compares to other Bitcoin holders:

### What It Shows

1. **Your Score vs Average** - Side-by-side comparison with community average
2. **Percentile Ranking** - "Better than X% of users"
3. **Distribution Chart** - Visual bar chart showing:
   - Excellent (80-100 points) - Green
   - Moderate (50-79 points) - Orange
   - Needs Work (0-49 points) - Red
4. **"You're Here" Indicator** - Shows which category the user falls into

### How It Works

The database tracks all assessment scores and calculates:
- Average score across all users
- Distribution percentages for each category
- Approximate percentile ranking

This creates social proof and motivation for users to improve their security score.

---

## Configuration Files Needed

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

### Backend (.env)
```
# Server
PORT=3001
FRONTEND_URL=http://localhost:5173

# Bitcoin (YOUR wallet's extended public key)
XPUB=zpub6rFR7y4Q2AijBEqTUquh...your-xpub-here

# Email (optional - for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Kyward <noreply@kyward.io>
```

---

## How to Get Your XPUB

Your XPUB (Extended Public Key) lets Kyward generate payment addresses without accessing your Bitcoin.

### From Sparrow Wallet:
1. Open Sparrow Wallet
2. Go to Settings → View Extended Public Key
3. Copy the key starting with `zpub` or `xpub`

### From Electrum:
1. Open Electrum
2. Go to Wallet → Information
3. Copy the Master Public Key

**Important**: XPUB can only generate addresses, not spend Bitcoin. It's safe to use.

---

## Deployment Guide

### What You Need

1. **Domain Name** - Your website address (e.g., kyward.io)
2. **Frontend Hosting** - Where your website lives
3. **Backend Hosting** - Where your server runs
4. **XPUB** - Your Bitcoin wallet's public key
5. **Email Service** (optional) - For sending plan emails

### Step 1: Prepare Your Code

```bash
# Clone/download your project
# Make sure all files are ready
```

### Step 2: Deploy Frontend

**Recommended: Vercel (Free)**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your Kyward repository
5. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_URL` = your backend URL
7. Click Deploy

**Alternative Options:**
- Netlify (free)
- Cloudflare Pages (free)
- GitHub Pages (free, static only)

### Step 3: Deploy Backend

**Recommended: Railway (Easy, ~$5/month)**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository, choose `/backend` folder
5. Add Environment Variables:
   - `PORT` = 3001
   - `XPUB` = your extended public key
   - `FRONTEND_URL` = your Vercel URL
   - SMTP settings if using email
6. Deploy

**Alternative Options:**
- Render (free tier available)
- Fly.io (free tier)
- DigitalOcean ($5/month)
- Heroku (paid now)

### Step 4: Connect Frontend to Backend

After backend is deployed:
1. Copy your Railway backend URL (e.g., `https://kyward-backend.up.railway.app`)
2. Go to Vercel → Your Project → Settings → Environment Variables
3. Update `VITE_API_URL` to your Railway URL
4. Redeploy

### Step 5: Set Up Domain

1. Buy domain from Namecheap, GoDaddy, or Cloudflare
2. In Vercel: Settings → Domains → Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

---

## Recommended Services & Apps

### Hosting (Frontend)

| Service | Price | Pros | Cons |
|---------|-------|------|------|
| **Vercel** | Free | Fast, easy, auto-deploys | Limited to 100GB bandwidth |
| Netlify | Free | Similar to Vercel | Slightly slower |
| Cloudflare Pages | Free | Fast global CDN | Newer, less features |

### Hosting (Backend)

| Service | Price | Pros | Cons |
|---------|-------|------|------|
| **Railway** | ~$5/mo | Easy, good free tier | Usage-based billing |
| Render | Free | Free tier available | Slow cold starts on free |
| Fly.io | Free | Great performance | More complex setup |
| DigitalOcean | $5/mo | Reliable, full control | Manual setup needed |

### Domain Names

| Service | Price | Pros |
|---------|-------|------|
| **Cloudflare** | ~$10/yr | Cheapest, includes DNS |
| Namecheap | ~$12/yr | Easy to use |
| GoDaddy | ~$15/yr | Well-known |

### Email Sending

| Service | Price | Pros |
|---------|-------|------|
| **Brevo (Sendinblue)** | Free (300/day) | Generous free tier |
| Mailgun | Free (5,000/mo) | Reliable |
| SendGrid | Free (100/day) | Good deliverability |
| Gmail SMTP | Free | Easy but limited |

### Monitoring & Analytics (Optional)

| Service | Purpose | Price |
|---------|---------|-------|
| Plausible | Privacy-focused analytics | $9/mo |
| UptimeRobot | Server monitoring | Free |
| Sentry | Error tracking | Free tier |

---

## Next Steps (In Order)

### Phase 1: Get It Running (1-2 days)

- [ ] Install Node.js on your computer
- [ ] Run `npm install` in both main folder and `/backend`
- [ ] Create `.env` files from `.env.example`
- [ ] Add your XPUB to backend `.env`
- [ ] Test locally: `npm run dev` (frontend) and `npm run dev` (backend)
- [ ] Test the full flow: signup → questionnaire → payment (demo mode)

### Phase 2: Deploy (1 day)

- [ ] Create Vercel account, deploy frontend
- [ ] Create Railway account, deploy backend
- [ ] Connect frontend to backend URL
- [ ] Test on live site

### Phase 3: Domain & Email (1 day)

- [ ] Buy domain (kyward.io or similar)
- [ ] Connect domain to Vercel
- [ ] Set up email service (Brevo recommended)
- [ ] Add SMTP settings to backend
- [ ] Test email delivery

### Phase 4: Production Ready

- [ ] Add real XPUB (not demo)
- [ ] Test real Bitcoin payment (small amount)
- [ ] Set up UptimeRobot monitoring
- [ ] Add basic error tracking

---

## Security Checklist

Before going live:

- [ ] XPUB is for a dedicated business wallet
- [ ] Backend `.env` is not in GitHub (use `.gitignore`)
- [ ] SMTP password is an App Password, not main password
- [ ] CORS is configured to only allow your frontend domain
- [ ] You have a backup of your XPUB wallet seed

---

## Costs Summary

### Minimum (Fully Free)
- Vercel (frontend): $0
- Render (backend): $0
- Domain: ~$10/year
- **Total: ~$10/year**

### Recommended
- Vercel (frontend): $0
- Railway (backend): ~$5/month
- Domain: ~$10/year
- Email (Brevo): $0
- **Total: ~$70/year**

### Professional
- Vercel Pro: $20/month
- Railway: ~$10/month
- Domain + Email: ~$50/year
- Monitoring: ~$10/month
- **Total: ~$530/year**

---

## Glossary

| Term | Meaning |
|------|---------|
| **Frontend** | The part users see (website) |
| **Backend** | The server that processes data |
| **API** | How frontend talks to backend |
| **XPUB** | Your wallet's public key for receiving |
| **SMTP** | Email sending protocol |
| **Deploy** | Put your code on the internet |
| **Environment Variables** | Secret settings stored outside code |
| **Mempool.space** | Service that checks Bitcoin blockchain |
| **LocalStorage** | Browser storage (like cookies) |

---

## Support

If you need help:
1. Check the error messages in browser console (F12)
2. Check Railway/Vercel logs for backend errors
3. Verify environment variables are set correctly
4. Test with demo mode first

---

## File Quick Reference

```
WHAT TO EDIT FOR COMMON CHANGES:

Change pricing?
→ src/components/LandingPage.jsx (display)
→ src/services/PaymentService.js (actual prices)
→ backend/server.js (amounts in sats)

Change questions?
→ src/components/Questionnaire.jsx

Change recommendations?
→ src/services/Recommendations.js

Change colors/design?
→ src/styles/Theme.jsx

Change email templates?
→ backend/services/email.js

Change PDF content?
→ src/services/PdfGenerator.js

Change blur effect style?
→ src/components/TelegramBlur.jsx

Change comparison statistics?
→ src/services/Database.js (getGlobalStats, compareToAverage)

Change BTC price cache duration?
→ backend/services/bitcoin.js (priceCache.expiresIn)
```

---

## New Features (v1.1)

### Telegram-Style Blur Effect
The `TelegramBlur.jsx` component creates premium content previews with:
- Animated floating stars
- Moving gradient shadows that follow mouse
- Shimmer line animation
- Pulsing lock icon
- Click-to-reveal functionality
- Customizable accent colors

Used in:
- Dashboard: PDF password display
- Report: Locked recommendations preview

### Community Comparison
After each assessment, users see:
- Their score vs community average
- Percentile ranking
- Distribution bar chart with "You're here" indicator
- Personalized insight message

### Real-Time Bitcoin Pricing
Payment modal now shows:
- Exact BTC amount based on live price
- Current BTC/USD rate display
- 2-minute price refresh countdown
- Manual refresh button
- Automatic price updates

---

*Documentation generated for Kyward v1.1*
*Last updated: January 2026*
