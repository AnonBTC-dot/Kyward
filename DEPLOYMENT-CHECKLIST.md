# Kyward Deployment Checklist

## What's New in v1.1

- **Telegram-Style Blur Effects** - Premium content preview with animated stars and shadows
- **Community Comparison** - Users see how their score compares to other Bitcoiners
- **Real-Time BTC Pricing** - Live prices from mempool.space with 2-min refresh
- **Improved Password Display** - Animated blur effect for PDF password

---

## Quick Start Commands

### Run Locally (Testing)

**Terminal 1 - Frontend:**
```bash
cd C:\Users\Leonardo\Desktop\Kyward
npm install
npm run dev
```
Opens at: http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd C:\Users\Leonardo\Desktop\Kyward\backend
npm install
npm run dev
```
Opens at: http://localhost:3001

---

## Pre-Deployment Checklist

### 1. Get Your Bitcoin XPUB

Choose ONE wallet:

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

Save this key - you'll need it for the backend!

---

### 2. Create Email App Password (Gmail)

1. Go to myaccount.google.com
2. Security → 2-Step Verification (enable if not done)
3. Security → App passwords
4. Create new app password for "Mail"
5. Copy the 16-character password

---

### 3. Create Configuration Files

**Frontend (.env):**
```bash
cd C:\Users\Leonardo\Desktop\Kyward
copy .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:3001
```

**Backend (.env):**
```bash
cd C:\Users\Leonardo\Desktop\Kyward\backend
copy .env.example .env
```

Edit `.env`:
```
PORT=3001
FRONTEND_URL=http://localhost:5173

# Your Bitcoin XPUB
XPUB=zpub6rFR7y4Q2AijBEqTUquh...paste-your-xpub-here

# Gmail SMTP (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=Kyward <your-email@gmail.com>
```

---

## Deployment Steps

### Step 1: Push Code to GitHub

```bash
cd C:\Users\Leonardo\Desktop\Kyward
git init
git add .
git commit -m "Initial Kyward commit"
git remote add origin https://github.com/YOUR-USERNAME/kyward.git
git push -u origin main
```

---

### Step 2: Deploy Backend (Railway)

1. Go to **railway.app**
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your Kyward repository
5. **Important:** Set root directory to `/backend`
6. Click "Add Variables" and add:
   ```
   PORT=3001
   XPUB=your-xpub-key
   FRONTEND_URL=https://kyward.vercel.app (update later)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=Kyward <your-email@gmail.com>
   ```
7. Deploy and copy your backend URL (e.g., `https://kyward-production.up.railway.app`)

---

### Step 3: Deploy Frontend (Vercel)

1. Go to **vercel.com**
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Vite**
   - Root Directory: `.` (main folder)
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Environment Variables" and add:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app
   ```
6. Deploy

---

### Step 4: Update Backend CORS

Go back to Railway and update:
```
FRONTEND_URL=https://your-project.vercel.app
```

---

### Step 5: Add Custom Domain (Optional)

**Buy Domain:**
- Cloudflare Registrar: cloudflare.com/products/registrar
- Namecheap: namecheap.com

**Connect to Vercel:**
1. Vercel → Your Project → Settings → Domains
2. Add your domain
3. Copy the DNS records shown
4. Add them to your domain registrar
5. Wait 5-30 minutes for SSL

**Update Backend:**
```
FRONTEND_URL=https://kyward.io
```

---

## Testing Checklist

### Local Testing
- [ ] Frontend loads at localhost:5173
- [ ] Backend health check: localhost:3001/api/health
- [ ] Can create account
- [ ] Can complete questionnaire
- [ ] Report shows score and tips
- [ ] Payment modal opens (demo mode works)

### New Features Testing (v1.1)
- [ ] Report shows "How You Compare" section with average score
- [ ] Distribution bar chart displays with "You're here" indicator
- [ ] Premium password box shows animated blur effect
- [ ] Click on password reveals/hides it
- [ ] Copy button works regardless of blur state
- [ ] Locked tips in Report show Telegram-style blur with stars
- [ ] Payment modal shows exact BTC amount (e.g., 0.00010526 BTC)
- [ ] Payment modal shows current BTC/USD rate
- [ ] 2-minute price countdown is visible
- [ ] "Refresh Now" button updates the price

### Production Testing
- [ ] Site loads on Vercel URL
- [ ] Can create account
- [ ] Questionnaire works
- [ ] Payment modal shows QR code with real BTC price
- [ ] Demo payment works
- [ ] Real small payment works ($1 equivalent)
- [ ] Email received after payment
- [ ] Comparison feature works with real user data

---

## Recommended Services Summary

| Service | URL | Purpose | Cost |
|---------|-----|---------|------|
| **Vercel** | vercel.com | Frontend hosting | Free |
| **Railway** | railway.app | Backend hosting | ~$5/mo |
| **Cloudflare** | cloudflare.com | Domain + DNS | ~$10/yr |
| **Brevo** | brevo.com | Email sending | Free |
| **Sparrow** | sparrowwallet.com | Bitcoin wallet | Free |

---

## Troubleshooting

### "Failed to fetch" error
→ Backend not running or wrong URL in frontend .env

### Payment not detecting
→ Check XPUB is correct
→ Check mempool.space is working
→ Wait 10-30 seconds for mempool to see transaction

### Emails not sending
→ Check SMTP credentials
→ Use App Password, not regular password
→ Check spam folder

### CORS error
→ Backend FRONTEND_URL doesn't match actual frontend URL

---

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Run frontend development server
npm run dev

# Build frontend for production
npm run build

# Run backend development server (in /backend folder)
npm run dev

# Start backend production server
npm start
```

---

## Support Resources

- Vercel Docs: vercel.com/docs
- Railway Docs: docs.railway.app
- Bitcoin Address Check: mempool.space
- SMTP Testing: mailtrap.io

---

*Print this checklist and check off each step as you complete it!*
