-- KYWARD DATABASE SCHEMA FOR SUPABASE
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  subscription_level VARCHAR(50) DEFAULT 'free', -- 'free', 'complete', 'consultation'
  subscription_start TIMESTAMP WITH TIME ZONE,
  subscription_end TIMESTAMP WITH TIME ZONE, -- For monthly subscription tracking
  pdf_password VARCHAR(50),
  consultation_count INTEGER DEFAULT 0, -- Track number of consultations booked
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  language_preference VARCHAR(5) DEFAULT 'en' -- 'en' or 'es'
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- ASSESSMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  responses JSONB NOT NULL, -- Store all question responses as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster user assessment lookups
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_id VARCHAR(255) UNIQUE NOT NULL, -- External payment reference
  plan VARCHAR(50) NOT NULL, -- 'complete', 'consultation', 'consultation_additional'
  amount_usd DECIMAL(10, 2) NOT NULL,
  amount_btc DECIMAL(18, 8),
  btc_price_usd DECIMAL(10, 2),
  bitcoin_address VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'expired', 'failed'
  transaction_id VARCHAR(255), -- Bitcoin transaction ID when confirmed
  confirmations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for payment lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ============================================
-- CONSULTATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'scheduled', 'completed', 'cancelled'
  notes TEXT,
  meeting_link VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for consultation lookups
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_scheduled_at ON consultations(scheduled_at);

-- ============================================
-- COMMUNITY STATS TABLE (for score comparison)
-- ============================================
CREATE TABLE IF NOT EXISTS community_stats (
  id INTEGER PRIMARY KEY DEFAULT 1, -- Single row table
  total_assessments INTEGER DEFAULT 0,
  average_score DECIMAL(5, 2) DEFAULT 0,
  score_distribution JSONB DEFAULT '{"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Initialize community stats with single row
INSERT INTO community_stats (id, total_assessments, average_score, score_distribution)
VALUES (1, 0, 0, '{"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SESSION TOKENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS session_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for token lookups
CREATE INDEX IF NOT EXISTS idx_session_tokens_token ON session_tokens(token);
CREATE INDEX IF NOT EXISTS idx_session_tokens_user_id ON session_tokens(user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update community stats after new assessment
CREATE OR REPLACE FUNCTION update_community_stats()
RETURNS TRIGGER AS $$
DECLARE
  new_avg DECIMAL(5, 2);
  new_total INTEGER;
  new_distribution JSONB;
BEGIN
  -- Calculate new totals
  SELECT COUNT(*), COALESCE(AVG(score), 0)
  INTO new_total, new_avg
  FROM assessments;

  -- Calculate new distribution
  SELECT jsonb_build_object(
    '0-20', COUNT(*) FILTER (WHERE score BETWEEN 0 AND 20),
    '21-40', COUNT(*) FILTER (WHERE score BETWEEN 21 AND 40),
    '41-60', COUNT(*) FILTER (WHERE score BETWEEN 41 AND 60),
    '61-80', COUNT(*) FILTER (WHERE score BETWEEN 61 AND 80),
    '81-100', COUNT(*) FILTER (WHERE score BETWEEN 81 AND 100)
  )
  INTO new_distribution
  FROM assessments;

  -- Update community stats
  UPDATE community_stats
  SET
    total_assessments = new_total,
    average_score = new_avg,
    score_distribution = new_distribution,
    updated_at = NOW()
  WHERE id = 1;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update community stats
DROP TRIGGER IF EXISTS trigger_update_community_stats ON assessments;
CREATE TRIGGER trigger_update_community_stats
AFTER INSERT OR DELETE ON assessments
FOR EACH STATEMENT
EXECUTE FUNCTION update_community_stats();

-- Function to update user's updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger for consultations table
DROP TRIGGER IF EXISTS trigger_consultations_updated_at ON consultations;
CREATE TRIGGER trigger_consultations_updated_at
BEFORE UPDATE ON consultations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for service role (your backend)
-- These allow your backend to access all data
CREATE POLICY "Service role can access all users" ON users
  FOR ALL USING (true);

CREATE POLICY "Service role can access all assessments" ON assessments
  FOR ALL USING (true);

CREATE POLICY "Service role can access all payments" ON payments
  FOR ALL USING (true);

CREATE POLICY "Service role can access all consultations" ON consultations
  FOR ALL USING (true);

CREATE POLICY "Service role can access all session_tokens" ON session_tokens
  FOR ALL USING (true);

-- Community stats should be readable by everyone
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Community stats are readable by all" ON community_stats
  FOR SELECT USING (true);
CREATE POLICY "Service role can update community stats" ON community_stats
  FOR ALL USING (true);

-- ============================================
-- HELPFUL VIEWS
-- ============================================

-- View for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id,
  u.email,
  u.subscription_level,
  u.created_at,
  COUNT(a.id) as total_assessments,
  MAX(a.score) as highest_score,
  AVG(a.score) as average_score,
  MAX(a.created_at) as last_assessment_at
FROM users u
LEFT JOIN assessments a ON u.id = a.user_id
GROUP BY u.id, u.email, u.subscription_level, u.created_at;

-- View for recent payments
CREATE OR REPLACE VIEW recent_payments AS
SELECT
  p.*,
  u.email as user_email
FROM payments p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC
LIMIT 100;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment to add test data

/*
-- Test user (password: Test1234)
INSERT INTO users (email, password_hash, subscription_level)
VALUES ('test@example.com', '$2b$10$YourHashedPasswordHere', 'free');
*/

