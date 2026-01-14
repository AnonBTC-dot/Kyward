# Supabase Database Setup Guide for Kyward

## Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization (or create one)
4. Set project details:
   - **Name**: `kyward` (or your preference)
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to your users
5. Click "Create new project" and wait for setup (~2 minutes)

## Step 2: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `schema.sql` from this folder
4. Paste into the SQL Editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

## Step 3: Get Your Credentials

1. Go to **Settings** > **API** in Supabase dashboard
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon/public key** (for frontend, if needed)
   - **service_role key** (for backend - KEEP SECRET!)

3. Go to **Settings** > **Database**
4. Copy the **Connection string** (URI format)
   - Example: `postgresql://postgres:[PASSWORD]@db.abcdefgh.supabase.co:5432/postgres`

## Step 4: Configure Your Backend

Add these environment variables to your Render backend:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Direct PostgreSQL connection (for complex queries)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project-id.supabase.co:5432/postgres

# Keep your existing settings
NODE_ENV=production
PORT=3001
```

## Step 5: Install Supabase Client in Backend

```bash
cd your-backend-folder
npm install @supabase/supabase-js
```

## Step 6: Update Backend Code

Replace your current database logic with Supabase client. Example:

```javascript
// services/database.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Example: Get user by email
async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data;
}

// Example: Create user
async function createUser(email, passwordHash) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password_hash: passwordHash }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Example: Save assessment
async function saveAssessment(userId, score, responses) {
  const { data, error } = await supabase
    .from('assessments')
    .insert([{ user_id: userId, score, responses }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Example: Get user assessments
async function getUserAssessments(userId) {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Example: Get community stats
async function getCommunityStats() {
  const { data, error } = await supabase
    .from('community_stats')
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

module.exports = {
  supabase,
  getUserByEmail,
  createUser,
  saveAssessment,
  getUserAssessments,
  getCommunityStats
};
```

## Database Tables Overview

| Table | Purpose |
|-------|---------|
| `users` | User accounts, subscriptions, PDF passwords |
| `assessments` | Security assessment results and responses |
| `payments` | Bitcoin payment records |
| `consultations` | Booked consultation sessions |
| `community_stats` | Aggregated stats for score comparison |
| `session_tokens` | Authentication tokens |

## Pricing Tiers in Database

- `free`: Default tier, limited features
- `complete`: $7.99/month subscription
- `consultation`: Has booked consultation ($99 first, $49 additional)

## Subscription Management

The `subscription_end` field tracks when monthly subscriptions expire:

```javascript
// Check if subscription is active
function isSubscriptionActive(user) {
  if (user.subscription_level === 'free') return false;
  if (!user.subscription_end) return true; // Lifetime or consultation
  return new Date(user.subscription_end) > new Date();
}
```

## Security Notes

1. **NEVER expose `SUPABASE_SERVICE_KEY`** in frontend code
2. Use `SUPABASE_ANON_KEY` only if calling Supabase directly from frontend
3. All sensitive operations should go through your backend
4. RLS policies are configured for service role access

## Testing

After setup, test with:

```bash
# In your backend
curl http://localhost:3001/api/health
```

Or check Supabase Table Editor to see if tables were created.
