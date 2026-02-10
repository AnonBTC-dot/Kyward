# Lemon Squeezy Deployment Guide

FIAT payment processing via Lemon Squeezy for Colombian company.

**Official Documentation:** https://docs.lemonsqueezy.com/

---

## Table of Contents

1. [Lemon Squeezy Setup (Step-by-Step)](#lemon-squeezy-setup-step-by-step)
2. [Payout Configuration for Colombian Company](#payout-configuration-for-colombian-company)
3. [Converting to Fiat (COP)](#converting-to-fiat-cop)
4. [Converting to Bitcoin](#converting-to-bitcoin)
5. [Fee Calculations](#step-by-step-fee-calculation-for-999-payment)
6. [Environment Variables](#environment-variables)

---

## Lemon Squeezy Setup (Step-by-Step)

### Step 1: Create Lemon Squeezy Account

1. Go to https://www.lemonsqueezy.com/
2. Click "Get Started" or "Sign Up"
3. Register with your email
4. Verify your email address

### Step 2: Complete Business Verification

1. Go to **Settings > General**
2. Fill in your business details:
   - Business Name: Your company name (as in NIT)
   - Business Type: Select "Company"
   - Country: **Colombia**
   - Address: Your registered business address
3. Upload required documents:
   - Government ID (Cedula)
   - Proof of address
   - Business registration (Camara de Comercio)
4. Wait for verification (1-3 business days)

### Step 3: Create Your Store

1. Go to **Settings > Stores**
2. Click "Create Store"
3. Fill in store details:
   - Store Name: `Kyward`
   - Store URL: `kyward` (becomes kyward.lemonsqueezy.com)
   - Currency: `USD` (recommended for international sales)
4. Copy your **Store ID** (you'll need this for `.env`)

### Step 4: Create Products

For each Kyward plan, create a product:

#### Product 1: Essential Report

1. Go to **Products > Create Product**
2. Fill in:
   - Name: `Essential Security Report`
   - Description: `Comprehensive security analysis for your crypto wallet`
   - Price: `$9.99` (one-time payment)
   - Tax category: Digital goods
3. Save and copy the **Variant ID**

#### Product 2: Sentinel Report

1. Create another product
2. Fill in:
   - Name: `Sentinel Security Report`
   - Description: `Advanced security analysis with deep monitoring`
   - Price: `$9.99` (or your price)
3. Save and copy the **Variant ID**

#### Product 3: Consultation

1. Create another product
2. Fill in:
   - Name: `Security Consultation`
   - Price: `$99.00`
3. Save and copy the **Variant ID**

#### Product 4: Additional Consultation

1. Create another product
2. Fill in:
   - Name: `Additional Consultation Hour`
   - Price: `$49.00`
3. Save and copy the **Variant ID**

### Step 5: Get API Key

1. Go to **Settings > API**
2. Click "Create API Key"
3. Name it: `Kyward Production`
4. Select permissions: **Full Access** (or at minimum: Checkouts, Orders, Webhooks)
5. Copy the API key immediately (it won't be shown again)

### Step 6: Configure Webhooks

1. Go to **Settings > Webhooks**
2. Click "Create Webhook"
3. Fill in:
   - URL: `https://your-domain.com/api/webhooks/lemonsqueezy`
   - Secret: Generate a secure random string (save this for `.env`)
   - Events: Select these events:
     - `order_created`
     - `order_refunded`
     - `subscription_created` (if using subscriptions)
     - `subscription_updated`
     - `subscription_cancelled`
4. Save and copy the **Webhook Secret**

### Step 7: Configure Payouts

1. Go to **Settings > Payouts**
2. Choose your payout method:
   - **Bank Transfer** (recommended - see Option 1 below)
   - **PayPal** (see Option 2 below)
3. Enter your bank/PayPal details
4. Set payout schedule: `Twice monthly` (1st and 15th)

### Step 8: Configure Environment Variables

Add these to your `backend/.env`:

```env
# Lemon Squeezy Configuration
LEMONSQUEEZY_API_KEY=your-api-key-from-step-5
LEMONSQUEEZY_STORE_ID=your-store-id-from-step-3
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret-from-step-6

# Product Variant IDs from Step 4
LEMONSQUEEZY_VARIANT_ESSENTIAL=123456
LEMONSQUEEZY_VARIANT_SENTINEL=123457
LEMONSQUEEZY_VARIANT_CONSULTATION=123458
LEMONSQUEEZY_VARIANT_CONSULTATION_ADDITIONAL=123459
```

### Step 9: Test the Integration

1. Enable **Test Mode** in Lemon Squeezy dashboard
2. Create a test checkout:
```bash
curl -X POST https://api.lemonsqueezy.com/v1/checkouts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/vnd.api+json" \
  -d '{...}'
```
3. Complete a test purchase using test card: `4242 4242 4242 4242`
4. Verify webhook is received at your endpoint
5. Check that payment status updates correctly

### Step 10: Go Live

1. Disable **Test Mode**
2. Verify all environment variables are set for production
3. Test with a real small purchase ($1 product)
4. Monitor first few transactions in dashboard

---

## Payout Configuration for Colombian Company

**Important:** Since the company is registered in COLOMBIA, Lemon Squeezy requires a COLOMBIAN bank account for bank payouts. You cannot use a Payoneer US account directly because it doesn't match your company country.

**Requirement:** Avoid Bancolombia, Davivienda, and Grupo Aval.

---

## Option 1: Colombian Independent Bank (Direct to Lemon Squeezy)

Use an independent Colombian digital bank that is NOT part of major groups:

### A) Lulo Bank (Recommended)

- **URL:** https://www.lulobank.com
- 100% digital bank, Colombian fintech
- NOT part of Bancolombia, Davivienda, or Grupo Aval
- Accepts business accounts (Cuenta Empresarial)
- Documents: NIT, Camara de Comercio, RUT, Cedula representante legal
- Can receive international transfers
- Use this account directly in Lemon Squeezy payouts

### B) Pibank

- **URL:** https://www.pibank.co
- Independent digital bank
- Business accounts available
- Good for receiving international payments

### C) Scotiabank Colpatria

- **URL:** https://www.scotiabankcolpatria.com
- Canadian bank (not Colombian groups)
- Business accounts available
- International transfer support

### Setup Steps

1. Open business account at Lulo Bank or Pibank
2. In Lemon Squeezy > Settings > Payouts > Bank Transfer
3. Enter your Colombian bank details:
   - Bank Name: Lulo Bank S.A. (or Pibank)
   - Account Type: Ahorros or Corriente
   - Account Number: Your account number
   - Account Holder: Your company name (as in NIT)

---

## Option 2: PayPal Business -> Payoneer (If you prefer USD)

This is the workaround if you want to hold USD before converting.

### Step 1: Create PayPal Business Account

- **URL:** https://www.paypal.com/co/business
- Register with your Colombian company (NIT)
- Verify bank account (can use any Colombian bank temporarily)
- Verify identity

### Step 2: Configure Lemon Squeezy Payout to PayPal

- Go to: Lemon Squeezy > Settings > Payouts
- Select: PayPal
- Enter: Your PayPal Business email
- Note: Payouts are always in USD

### Step 3: Create Payoneer Business Account

- **URL:** https://www.payoneer.com/business/
- Register with Colombian company docs
- Get your USD receiving account
- Get Payoneer Mastercard for direct spending

### Step 4: Transfer PayPal -> Payoneer

In PayPal: Go to Wallet > Transfer Money > Transfer to Bank

Add Payoneer as bank account:
- Bank: First Century Bank (from Payoneer)
- Routing: (from Payoneer USD account)
- Account: (from Payoneer USD account)
- Fee: ~3% PayPal withdrawal fee

**Money Flow:**
```
Lemon Squeezy -> PayPal (USD) -> Payoneer (USD) -> COP or BTC
```

---

## Converting to Fiat (COP)

### From Option 1 (Lulo Bank/Pibank)

- Money arrives directly in COP
- Lemon Squeezy converts USD -> COP at mid-market rate
- No additional conversion needed
- Use your debit card or transfer locally

### From Option 2 (PayPal -> Payoneer)

- Payoneer -> Withdraw to Lulo Bank/Pibank/Movii
- Or use Payoneer Mastercard directly (USD)
- Or Payoneer -> Global66 -> COP (better rates)

### Independent Colombian Options for Withdrawals

| Service | URL | Type |
|---------|-----|------|
| Lulo Bank | https://www.lulobank.com | Digital bank |
| Pibank | https://www.pibank.co | Digital bank |
| Movii | https://www.movii.com.co | Wallet (personal) |
| Uala Colombia | https://www.uala.com.co | Fintech |

---

## Converting to Bitcoin

### From Option 1 (COP in Lulo Bank/Pibank)

#### A) Binance P2P (Fastest, Recommended)

- **URL:** https://p2p.binance.com
- Create Binance account, verify KYC
- Go to P2P Trading > Buy BTC
- Pay with bank transfer from Lulo Bank/Pibank
- Receive BTC in minutes
- Withdraw to your cold wallet
- **Fee:** 0% (just premium to seller, usually 1-2%)

#### B) Bitso

- **URL:** https://bitso.com
- Latin America focused exchange
- Deposit COP via bank transfer
- Buy BTC at spot price
- Withdraw to your XPUB wallet

### From Option 2 (USD in Payoneer)

#### A) Payoneer -> Binance (SWIFT)

- Payoneer > Send > To Bank Account
- Use Binance SWIFT deposit details
- Buy BTC on Binance spot
- Withdraw to cold wallet
- **Fee:** ~$25 SWIFT + 0.1% trading

#### B) Payoneer -> Kraken

- Similar to Binance
- Lower trading fees (0.16%)
- More professional interface
- **Fee:** ~$5 wire + 0.16% trading

---

## Complete Money Flow Diagrams

### Option 1: Direct Colombian Bank

```
Customer pays $100 via card
         |
         v
   [LEMON SQUEEZY]
   Takes ~5% ($5)
         |
         v
   $95 -> Converted to COP
         |
         v
 [LULO BANK / PIBANK]
 ~380,000 COP (at ~4,000 COP/USD)
         |
    +---------+
    |         |
    v         v
  SPEND    CONVERT
  (COP)    TO BTC
    |         |
    v         v
  Debit   Binance P2P
  Card    (~1% premium)
```

### Option 2: PayPal -> Payoneer Flow

```
Customer pays $100 via card
         |
         v
   [LEMON SQUEEZY]
   Takes ~5% ($5)
         |
         v
   [PAYPAL BUSINESS]
   $95 in USD
         |
         v
   Transfer to Payoneer
   (~3% fee = $2.85)
         |
         v
     [PAYONEER]
     $92.15 in USD
         |
    +---------+
    |         |
    v         v
  TO COP   TO BTC
    |         |
    v         v
 Lulo Bank  Binance/Kraken
 (~1.5%)   (~$25 SWIFT)
```

---

## Step-by-Step Fee Calculation for $9.99 Payment

### Option 1: Lulo Bank (Direct Colombian Bank)

| Step | Description | Amount |
|------|-------------|--------|
| 1 | Customer pays | $9.99 |
| 2 | Lemon Squeezy platform fee (5%) | -$0.50 |
| 2 | Lemon Squeezy transaction fee | -$0.50 |
| | **After Lemon Squeezy** | **$8.99** |
| 3 | Bank payout USD->COP (~0.5% spread) | -$0.04 |
| | **Received in Lulo Bank (COP)** | **$8.95** |

**If you KEEP as COP:**
- Final: $8.95
- You keep: 89.6%
- Total fees: $1.04 (10.4%)

**If you CONVERT to BTC (Binance P2P):**

| Step | Description | Amount |
|------|-------------|--------|
| 4 | P2P premium (~1.5%) | -$0.13 |
| 4 | Binance fee | $0.00 |
| 4 | BTC network withdrawal | -$0.02 |
| | **Final in BTC** | **$8.80** |

- You keep: 88.1%
- Total fees: $1.19 (11.9%)

---

### Option 2: PayPal -> Payoneer

| Step | Description | Amount |
|------|-------------|--------|
| 1 | Customer pays | $9.99 |
| 2 | Lemon Squeezy platform fee (5%) | -$0.50 |
| 2 | Lemon Squeezy transaction fee | -$0.50 |
| | **After Lemon Squeezy** | **$8.99** |
| 3 | PayPal receive fee | $0.00 |
| | **In PayPal (USD)** | **$8.99** |
| 4 | PayPal withdrawal fee (3%) | -$0.27 |
| | **In Payoneer (USD)** | **$8.72** |

**If you KEEP as USD (Payoneer card):**
- Final: $8.72
- You keep: 87.3%
- Total fees: $1.27 (12.7%)

**If you CONVERT to COP (Payoneer -> Lulo Bank):**

| Step | Description | Amount |
|------|-------------|--------|
| 5 | Payoneer withdrawal fee | -$0.02 |
| 5 | Currency conversion (1.5%) | -$0.13 |
| | **Final in COP** | **$8.57** |

- You keep: 85.8%
- Total fees: $1.42 (14.2%)

**If you CONVERT to BTC (Payoneer -> Binance SWIFT):**

> **WARNING:** SWIFT fee is $25 FIXED - not viable for single $9.99 payment!

For single $9.99:
- SWIFT fee: -$25.00
- Result: -$16.28 (NEGATIVE!)

**Recommended:** Accumulate $500+ before SWIFT transfer

Example with $500 accumulated in Payoneer:

| Step | Description | Amount |
|------|-------------|--------|
| | Starting amount | $500.00 |
| | SWIFT fee | -$25.00 |
| | Trading fee (0.1%) | -$0.48 |
| | BTC withdrawal | -$2.00 |
| | **Final in BTC** | **$472.52** |

- Total fees on $500: $27.48 (5.5%)

---

## Comparison Table (Per $9.99 payment)

| Destination | Option 1 (Lulo Bank) | Option 2 (PayPal->Payoneer) | Winner |
|-------------|---------------------|----------------------------|--------|
| Keep as FIAT (COP) | $8.95 (10.4% fee) | $8.57 (14.2% fee) | **Option 1 (+$0.38)** |
| Keep as USD | N/A | $8.72 (12.7% fee) | Option 2 (only way) |
| Convert to BTC (per tx) | $8.80 (11.9% fee) | NEGATIVE (SWIFT=$25) | **Option 1 (+$8.80)** |
| Convert to BTC (bulk $500+) | $8.80 (11.9% fee) | ~$8.24 (17.5% fee) | **Option 1 (+$0.56)** |

---

## Recommendation

### Use Option 1: Lulo Bank

**Why:**
1. **Lower fees:** You keep $8.95 vs $8.57 per $9.99 payment (+$0.38 more)
2. **Simpler:** Direct flow, no intermediary
3. **BTC ready:** Can convert any amount via Binance P2P instantly
4. **No minimums:** No need to accumulate $500+ for SWIFT

**Only use Option 2 (PayPal -> Payoneer) if:**
- You MUST hold USD for specific purposes
- You plan to spend USD directly with Payoneer Mastercard
- You need to pay USD invoices to suppliers

---

## Annual Projection (100 sales of $9.99)

Total revenue: $999.00

| Option | Final Amount | Total Fees | Fee % |
|--------|--------------|------------|-------|
| Option 1 (Lulo Bank -> BTC) | $880.00 | $119.00 | 11.9% |
| Option 2 (PayPal -> Payoneer -> BTC) | $824.00 | $175.00 | 17.5% |

**Difference: $56.00 MORE with Option 1 per 100 sales**

---

## Environment Variables

```env
# Get from: Dashboard > Settings > API
LEMONSQUEEZY_API_KEY=your-api-key

# Get from: Dashboard > Settings > Stores
LEMONSQUEEZY_STORE_ID=your-store-id

# Get from: Dashboard > Settings > Webhooks
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret

# Get from: Dashboard > Products > Variants
LEMONSQUEEZY_VARIANT_ESSENTIAL=123456
LEMONSQUEEZY_VARIANT_SENTINEL=123457
LEMONSQUEEZY_VARIANT_CONSULTATION=123458
LEMONSQUEEZY_VARIANT_CONSULTATION_ADDITIONAL=123459
```
