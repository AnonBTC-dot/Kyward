# Kyward Giveaway & Influencer Campaign Guide

## Overview
Manual subscription activation for marketing campaigns, influencer partnerships, and giveaways.

---

## Subscription Tiers & Values

| Plan | Price | Type | Duration | Features |
|------|-------|------|----------|----------|
| Essential | $9.99 | One-time | Lifetime (1 assessment) | 1 detailed PDF report |
| Sentinel | $14.99/mo | Subscription | Monthly | Unlimited assessments, PDF reports |
| Consultation | $99 | One-time | Per session | 1-hour expert consultation |

---

## SQL Commands for Manual Activation

### Essential Gift (One-time, permanent)
```sql
UPDATE users SET
  subscription_level = 'essential',
  payment_type = 'one-time',
  subscription_start = NOW(),
  subscription_end = NULL,
  pdf_password = 'UNIQUE_PASSWORD_HERE'
WHERE email = 'winner@example.com';
```

### Sentinel Gift (Monthly subscription)
```sql
-- 1 Month Gift
UPDATE users SET
  subscription_level = 'sentinel',
  payment_type = 'subscription',
  subscription_start = NOW(),
  subscription_end = NOW() + INTERVAL '1 month',
  pdf_password = 'UNIQUE_PASSWORD_HERE'
WHERE email = 'winner@example.com';

-- 3 Months Gift (higher value giveaway)
UPDATE users SET
  subscription_level = 'sentinel',
  payment_type = 'subscription',
  subscription_start = NOW(),
  subscription_end = NOW() + INTERVAL '3 months',
  pdf_password = 'UNIQUE_PASSWORD_HERE'
WHERE email = 'winner@example.com';

-- 1 Year Gift (influencer/VIP partnership)
UPDATE users SET
  subscription_level = 'sentinel',
  payment_type = 'subscription',
  subscription_start = NOW(),
  subscription_end = NOW() + INTERVAL '1 year',
  pdf_password = 'UNIQUE_PASSWORD_HERE'
WHERE email = 'influencer@example.com';
```

### Consultation Gift
```sql
UPDATE users SET
  subscription_level = 'consultation',
  payment_type = 'one-time',
  subscription_start = NOW(),
  subscription_end = NULL,
  consultation_count = 1,
  pdf_password = 'UNIQUE_PASSWORD_HERE'
WHERE email = 'winner@example.com';
```

---

## Giveaway Workflow

### Step 1: Verify Account Exists
```sql
SELECT id, email, subscription_level, created_at
FROM users
WHERE email = 'winner@example.com';
```
If no result, ask winner to create account first at https://kyward.com

### Step 2: Activate Subscription
Use the appropriate SQL command from above.

### Step 3: Track Giveaway (Optional)
```sql
INSERT INTO payments (user_id, payment_id, plan, amount_usd, status, confirmed_at)
SELECT
  id,
  'GIVEAWAY-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
  'sentinel',
  0.00,
  'completed',
  NOW()
FROM users WHERE email = 'winner@example.com';
```

---

## Influencer Partnership Tiers

| Tier | Followers | Gift | Expected |
|------|-----------|------|----------|
| Micro | 1K-10K | 1 month Sentinel | 1 post/story |
| Mid | 10K-100K | 3 months Sentinel + 1 Essential giveaway | 2-3 posts or video |
| Major | 100K+ | 1 year Sentinel + 5 Sentinel (1mo) for giveaway | Dedicated video + posts |
| Partner | Strategic | Consultation + 1 year Sentinel | Long-term ambassador |

---

## Batch Giveaway Script

```sql
-- Multiple Essential winners
UPDATE users SET
  subscription_level = 'essential',
  payment_type = 'one-time',
  subscription_start = NOW(),
  subscription_end = NULL,
  pdf_password = 'BATCH_' || SUBSTRING(MD5(RANDOM()::TEXT), 1, 10)
WHERE email IN (
  'winner1@example.com',
  'winner2@example.com',
  'winner3@example.com'
);

-- Multiple Sentinel winners (1 month)
UPDATE users SET
  subscription_level = 'sentinel',
  payment_type = 'subscription',
  subscription_start = NOW(),
  subscription_end = NOW() + INTERVAL '1 month',
  pdf_password = 'BATCH_' || SUBSTRING(MD5(RANDOM()::TEXT), 1, 10)
WHERE email IN (
  'winner4@example.com',
  'winner5@example.com'
);
```

---

## Password Generation

```sql
-- Generate random 12-char password
SELECT SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT), 1, 12) AS generated_password;
```

---

## Verification Queries

```sql
-- Check subscription status
SELECT
  email,
  subscription_level,
  payment_type,
  subscription_start,
  subscription_end,
  CASE
    WHEN subscription_end IS NULL THEN 'No expiration'
    WHEN subscription_end > NOW() THEN 'Active'
    ELSE 'Expired'
  END AS status
FROM users
WHERE email = 'user@example.com';

-- List all giveaways ($0 payments)
SELECT u.email, p.plan, p.payment_id, p.confirmed_at
FROM payments p
JOIN users u ON p.user_id = u.id
WHERE p.amount_usd = 0
ORDER BY p.confirmed_at DESC;
```

---

## Quick Reference

```sql
-- Essential
UPDATE users SET subscription_level = 'essential', payment_type = 'one-time', subscription_start = NOW(), pdf_password = 'PASS123' WHERE email = 'email@example.com';

-- Sentinel (1 month)
UPDATE users SET subscription_level = 'sentinel', payment_type = 'subscription', subscription_start = NOW(), subscription_end = NOW() + INTERVAL '1 month', pdf_password = 'PASS123' WHERE email = 'email@example.com';

-- Consultation
UPDATE users SET subscription_level = 'consultation', payment_type = 'one-time', consultation_count = 1, subscription_start = NOW(), pdf_password = 'PASS123' WHERE email = 'email@example.com';

-- Revoke (back to free)
UPDATE users SET subscription_level = 'free', payment_type = 'none', subscription_end = NULL WHERE email = 'email@example.com';
```

---

## Campaign Ideas

- **Twitter/X:** RT + Follow giveaway, collect emails via DM
- **YouTube:** Partner promo code, first 50 signups free
- **Conference:** QR code at booth for free Essential
- **Newsletter:** First 100 subscribers get Essential free

---

## Notes

1. Always verify account exists before UPDATE
2. Generate unique passwords for each user
3. Track giveaways in payments table with $0
4. Document influencer agreements separately
