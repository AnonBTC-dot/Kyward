# Lemon Squeezy Deployment Guide

FIAT payment processing via Lemon Squeezy for Colombian company.

**Official Documentation:** https://docs.lemonsqueezy.com/

---

## Table of Contents

1. [Lemon Squeezy Setup (Step-by-Step)](#lemon-squeezy-setup-step-by-step)
2. [Payout Configuration for Colombian Company](#payout-configuration-for-colombian-company)
3. [Option 1: PayPal + Iris Bank (100% Digital)](#option-1-paypal--iris-bank-100-digital)
4. [Option 2: PayPal + Payoneer (USD + Mastercard)](#option-2-paypal--payoneer-usd--mastercard)
5. [Option 3: Banco Pichincha Colombia (Direct Bank)](#option-3-banco-pichincha-colombia-direct-bank)
6. [Fee Comparison](#fee-comparison)
7. [Converting to Bitcoin](#converting-to-bitcoin)
8. [Environment Variables](#environment-variables)

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

### Step 7: Configure Environment Variables

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

### Step 8: Test the Integration

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

### Step 9: Go Live

1. Disable **Test Mode**
2. Verify all environment variables are set for production
3. Test with a real small purchase ($1 product)
4. Monitor first few transactions in dashboard

---

## Payout Configuration for Colombian Company

**Important Notes:**
- Company is registered in COLOMBIA
- Lemon Squeezy supports both **PayPal** and **Bank Transfer** payouts for Colombia
- **AVOID these banks** (embargo risk): Bancolombia, Davivienda, Grupo Aval (Banco de Bogota, Popular, Occidente, AV Villas), Scotiabank Colpatria

**Banks that DON'T work for business accounts:**
- Lulo Bank: No business accounts available yet (only personal)
- Pibank: Only personal accounts (90% of clients are natural persons)
- Nequi/Daviplata: Personal wallets only

---

## Option 1: PayPal + Iris Bank (100% Digital)

**Best for:** Lowest fees, simplest flow, 100% digital

```
Lemon Squeezy --> PayPal Business (USD) --> Iris Bank (COP)
```

### Total Fees: ~8.5%

| Step | Fee |
|------|-----|
| Lemon Squeezy | 5% + $0.50 |
| PayPal USD->COP conversion | 3.5% |
| **Total** | **~8.5%** |

---

### Step 1: Create Iris Bank Business Account

**URL:** https://iris.com.co/cuenta-empresarial/

**About Iris:**
- 100% digital neobank for businesses
- Colombian capital (Financiera Dann Regional)
- Regulated by Superintendencia Financiera
- NOT part of Bancolombia, Davivienda, or Grupo Aval

**Required Documents:**
- Certificado de Camara de Comercio (< 90 days)
- RUT
- Cedula del representante legal
- Composicion accionaria

**Process:**
1. Go to https://iris.com.co/cuenta-empresarial/
2. Click "Abrir cuenta"
3. Fill company information (NIT, name, address)
4. Upload required documents
5. Wait for approval (~24 hours)
6. Receive account number and access credentials

**Account Features:**
- Rentabilidad: up to 6.5% E.A.
- No hidden fees
- 5-200 free ACH transactions (depending on plan)
- API integration available
- Debit card for spending

---

### Step 2: Create PayPal Business Account

**URL:** https://www.paypal.com/co/business

1. Go to PayPal Business signup
2. Click "Registrarse"
3. Enter your business email
4. Select account type: **Cuenta Business**
5. Fill business information:
   - Nombre de la empresa: (as in NIT)
   - Tipo de negocio: Sociedad/Empresa
   - NIT: Your company NIT
   - Direccion: Registered address
6. Verify identity:
   - Upload cedula del representante legal
   - Confirm phone number
7. Link a bank account (use Iris Bank):
   - Bank: Financiera Dann Regional S.A. (Iris)
   - Account type: Ahorros or Corriente
   - Account number: Your Iris account number
8. Wait for verification (1-3 days)

---

### Step 3: Configure Lemon Squeezy Payout to PayPal

1. Log in to Lemon Squeezy dashboard
2. Go to **Settings > Payouts**
3. Click "Add Payout Method"
4. Select **PayPal**
5. Enter your PayPal Business email
6. Confirm the connection
7. Set payout schedule: **Twice monthly** (1st and 15th)
8. Set minimum payout: $50 (default)

---

### Step 4: Withdraw from PayPal to Iris Bank

**When you have balance in PayPal:**

1. Log in to PayPal
2. Go to **Billetera** (Wallet)
3. Click **Transferir dinero**
4. Select **Transferir a cuenta bancaria**
5. Choose your Iris Bank account
6. Enter amount to transfer
7. Review conversion rate (USD -> COP at 3.5% fee)
8. Confirm transfer
9. Wait 1-3 business days for funds to arrive in Iris

**Automatic Withdrawals:**
- PayPal can be configured to auto-withdraw when balance exceeds a threshold
- Go to Settings > Payments > Manage automatic transfers

---

### Money Flow Diagram

```
Customer pays $100 USD
         |
         v
   [LEMON SQUEEZY]
   Fee: 5% + $0.50 = $5.50
         |
         v
   [PAYPAL BUSINESS]
   Receives: $94.50 USD
         |
         v
   Withdraw to Iris Bank
   Conversion fee: 3.5% = $3.31
         |
         v
   [IRIS BANK]
   Receives: ~$91.19 USD equivalent
   In COP: ~364,760 COP (at 4,000 COP/USD)
```

---

## Option 2: PayPal + Payoneer (USD + Mastercard)

**Best for:** Keeping USD, using Mastercard for international purchases

```
Lemon Squeezy --> PayPal Business (USD) --> Payoneer (USD) --> Spend with Mastercard
```

### Total Fees: ~8-11%

| Step | Fee |
|------|-----|
| Lemon Squeezy | 5% + $0.50 |
| PayPal withdrawal to US bank | 1.5-3% |
| Payoneer (if converting to COP) | 2-3% |
| **Total (keep USD)** | **~8%** |
| **Total (convert to COP)** | **~11%** |

---

### Step 1: Create Payoneer Business Account

**URL:** https://www.payoneer.com/es/

1. Go to Payoneer website
2. Click "Registrarse" > "Cuenta Empresarial"
3. Fill company information:
   - Pais de registro: Colombia
   - Nombre de la empresa: (as in NIT)
   - Tipo de empresa: Sociedad Limitada / S.A.S / etc.
   - NIT
   - Direccion registrada
4. Fill representative information:
   - Nombre completo
   - Cedula
   - Fecha de nacimiento
   - Direccion personal
5. Upload documents:
   - Certificado de Camara de Comercio
   - RUT
   - Cedula del representante legal
6. Wait for approval (2-5 business days)
7. Once approved, get your **USD Receiving Account**:
   - Bank Name: First Century Bank
   - Routing Number: (provided by Payoneer)
   - Account Number: (your unique number)
   - Account Type: Checking

---

### Step 2: Create PayPal Business Account

Same as Option 1, Step 2.

**URL:** https://www.paypal.com/co/business

---

### Step 3: Link Payoneer USD Account to PayPal

1. Log in to PayPal
2. Go to **Billetera** (Wallet)
3. Click **Vincular cuenta bancaria**
4. Select **United States** as country
5. Enter Payoneer USD account details:
   - Bank Name: First Century Bank
   - Routing Number: (from Payoneer)
   - Account Number: (from Payoneer)
   - Account Type: Checking
6. PayPal will make micro-deposits to verify (1-3 days)
7. Confirm the micro-deposit amounts in PayPal

---

### Step 4: Configure Lemon Squeezy Payout to PayPal

Same as Option 1, Step 3.

1. Go to Lemon Squeezy > **Settings > Payouts**
2. Select **PayPal**
3. Enter your PayPal Business email
4. Set schedule: Twice monthly

---

### Step 5: Withdraw from PayPal to Payoneer

1. Log in to PayPal
2. Go to **Billetera** > **Transferir dinero**
3. Select **Transferir a cuenta bancaria**
4. Choose your Payoneer (First Century Bank) account
5. Enter amount in USD
6. Confirm transfer
7. Wait 1-3 business days
8. Funds arrive in Payoneer in USD

**Fee:** 1.5-3% PayPal withdrawal fee

---

### Step 6: Use Payoneer Funds

**Option A: Request Payoneer Mastercard**

1. In Payoneer dashboard, go to **Card**
2. Request physical Mastercard
3. Wait for delivery (7-14 days)
4. Activate card
5. Use for:
   - International online purchases (USD)
   - ATM withdrawals worldwide
   - In-store purchases
   - Subscriptions (AWS, domains, etc.)

**ATM Withdrawal Fee:** $3.15 per withdrawal

**Option B: Withdraw to Colombian Bank**

1. In Payoneer, go to **Withdraw** > **To Bank Account**
2. Add Colombian bank (Iris Bank):
   - Country: Colombia
   - Currency: COP
   - Bank: Financiera Dann Regional (Iris)
   - Account Number: Your Iris account
3. Enter amount
4. Confirm withdrawal
5. Wait 2-5 business days

**Fee:** Up to 2% conversion + withdrawal fee

---

### Money Flow Diagram

```
Customer pays $100 USD
         |
         v
   [LEMON SQUEEZY]
   Fee: 5% + $0.50 = $5.50
         |
         v
   [PAYPAL BUSINESS]
   Receives: $94.50 USD
         |
         v
   Withdraw to Payoneer
   Fee: ~2% = $1.89
         |
         v
   [PAYONEER]
   Receives: $92.61 USD
         |
    +----+----+
    |         |
    v         v
 KEEP USD   WITHDRAW
 (card)     TO COP
    |         |
    v         v
 $92.61    Iris Bank
 Mastercard  ~$90 equiv
```

---

## Option 3: Banco Pichincha Colombia (Direct Bank)

**Best for:** Direct bank payout from Lemon Squeezy (no PayPal), receiving via SWIFT

```
Lemon Squeezy --> Banco Pichincha Colombia (SWIFT/Wire)
```

### Total Fees: ~5.5-6%

| Step | Fee |
|------|-----|
| Lemon Squeezy | 5% + $0.50 |
| Bank conversion spread | ~0.5% |
| **Total** | **~5.5-6%** |

**Note:** This option requires **in-person** account opening.

---

### About Banco Pichincha Colombia

- **Parent:** Banco Pichincha Ecuador (NOT Colombian groups)
- **SWIFT Code:** PICHCOBBXXX
- **Website:** https://www.bancopichincha.com.co
- Regulated by Superintendencia Financiera Colombia
- Can receive international SWIFT transfers
- Business accounts available

**Why Banco Pichincha:**
- Independent from Bancolombia, Davivienda, Grupo Aval
- Ecuadorian bank (no Colombian embargo risk)
- Has SWIFT code for international transfers
- Lemon Squeezy can send directly via bank wire

---

### Step 1: Open Business Account at Banco Pichincha

**Required Documents:**

For Persona Juridica (Company):
- Certificado de existencia y representacion legal (< 30 days)
- RUT actualizado
- Estados financieros (if > 1 year operating)
- Composicion accionaria
- Cedula del representante legal
- Formulario de vinculacion (in branch)

**Process:**

1. Find nearest branch: https://www.bancopichincha.com.co/oficinas
2. Call to schedule appointment: 601 756 0099
3. Bring all documents
4. Fill application forms in branch
5. Provide specimen signatures
6. Wait for account approval (3-7 business days)
7. Receive account details:
   - Account Number
   - Account Type (Corriente recommended for business)
   - SWIFT Code: PICHCOBBXXX

**Business Account Types:**
- Cuenta Corriente Empresarial: For high transaction volume
- Cuenta de Ahorros Empresarial: Lower fees, less transactions

---

### Step 2: Get SWIFT/Wire Details

Once account is open, request your complete wire details:

```
Bank Name: Banco Pichincha S.A.
SWIFT/BIC: PICHCOBBXXX
Address: Carrera 11 No. 92-09 Piso 4, Bogota, Colombia
Account Holder: [Your Company Name as in NIT]
Account Number: [Your account number]
Account Type: Checking/Savings (Corriente/Ahorros)
```

---

### Step 3: Configure Lemon Squeezy Payout to Bank

1. Log in to Lemon Squeezy dashboard
2. Go to **Settings > Payouts**
3. Click "Add Payout Method"
4. Select **Bank Transfer**
5. Enter bank details:
   - Country: Colombia
   - Currency: COP (Colombian Peso)
   - Bank Name: Banco Pichincha S.A.
   - SWIFT/BIC Code: PICHCOBBXXX
   - Account Number: [Your account number]
   - Account Holder Name: [Company name as in NIT]
   - Account Type: Checking or Savings
6. Save and verify
7. Set payout schedule: **Twice monthly**
8. Set minimum payout: $50

---

### Step 4: Receive Payouts

- Lemon Squeezy sends payouts on 1st and 15th of each month
- Funds are converted USD -> COP at mid-market rate
- Arrives in Banco Pichincha in 2-5 business days
- No intermediate steps needed

---

### Money Flow Diagram

```
Customer pays $100 USD
         |
         v
   [LEMON SQUEEZY]
   Fee: 5% + $0.50 = $5.50
         |
         v
   Direct bank wire
   (converted to COP)
         |
         v
   [BANCO PICHINCHA]
   Receives: ~$94 USD equivalent
   In COP: ~376,000 COP (at 4,000 COP/USD)
         |
    +----+----+
    |         |
    v         v
  SPEND    TRANSFER
  (debit)  locally
```

---

## Fee Comparison

### Per $100 Customer Payment

| Option | After Lemon | After All Fees | You Keep | Total Fee % |
|--------|-------------|----------------|----------|-------------|
| **Option 3: Banco Pichincha** | $94.50 | ~$94.00 COP | $94.00 | **~6%** |
| **Option 1: PayPal + Iris** | $94.50 | ~$91.19 COP | $91.19 | **~8.8%** |
| **Option 2: PayPal + Payoneer (USD)** | $94.50 | ~$92.61 USD | $92.61 | **~7.4%** |
| **Option 2: PayPal + Payoneer (COP)** | $94.50 | ~$90.00 COP | $90.00 | **~10%** |

### Recommendation by Use Case

| Use Case | Best Option |
|----------|-------------|
| Lowest fees overall | **Option 3: Banco Pichincha** |
| 100% digital (no branch visit) | **Option 1: PayPal + Iris** |
| Keep USD + Mastercard spending | **Option 2: PayPal + Payoneer** |
| Convert to Bitcoin quickly | **Option 1: PayPal + Iris** |

---

## Converting to Bitcoin

### From Option 1 or 3 (COP in Iris/Pichincha)

#### Binance P2P (Recommended)

1. Create Binance account: https://www.binance.com
2. Complete KYC verification
3. Go to **P2P Trading** > **Buy BTC**
4. Select payment method: Bank Transfer
5. Choose seller with good rating
6. Transfer COP from Iris/Pichincha to seller
7. Receive BTC in Binance wallet
8. Withdraw to your cold wallet

**Fee:** 0% Binance fee + 1-2% seller premium

#### Bitso

1. Create account: https://bitso.com
2. Verify identity
3. Deposit COP via bank transfer
4. Buy BTC at spot price
5. Withdraw to wallet

### From Option 2 (USD in Payoneer)

#### Payoneer -> Binance SWIFT

1. In Payoneer: **Withdraw** > **To Bank**
2. Add Binance SWIFT details
3. Transfer USD (minimum recommended: $500+)
4. Buy BTC on Binance spot market
5. Withdraw to cold wallet

**Fee:** $25 SWIFT + 0.1% trading

**Warning:** SWIFT has $25 fixed fee - not viable for small amounts!

---

## Quick Setup Checklist

### Option 1: PayPal + Iris (Fastest, Digital)

- [ ] Create Iris Bank business account (24h)
- [ ] Create PayPal Business account (1-3 days)
- [ ] Link Iris to PayPal
- [ ] Configure Lemon Squeezy payout to PayPal
- [ ] Test with small payout

### Option 2: PayPal + Payoneer (USD + Card)

- [ ] Create Payoneer business account (2-5 days)
- [ ] Get USD receiving account details
- [ ] Create PayPal Business account (1-3 days)
- [ ] Link Payoneer USD account to PayPal
- [ ] Configure Lemon Squeezy payout to PayPal
- [ ] Request Payoneer Mastercard
- [ ] Test with small payout

### Option 3: Banco Pichincha (Lowest Fees)

- [ ] Schedule appointment at Pichincha branch
- [ ] Gather all documents
- [ ] Open business account (in person)
- [ ] Get SWIFT details
- [ ] Configure Lemon Squeezy payout to bank
- [ ] Test with small payout

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

---

## Support Links

- Lemon Squeezy Docs: https://docs.lemonsqueezy.com/
- Lemon Squeezy Payouts: https://docs.lemonsqueezy.com/help/getting-started/getting-paid
- Iris Bank: https://iris.com.co/
- PayPal Business Colombia: https://www.paypal.com/co/business
- Payoneer: https://www.payoneer.com/es/
- Banco Pichincha Colombia: https://www.bancopichincha.com.co/
