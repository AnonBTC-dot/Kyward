-- KYWARD DATABASE SCHEMA FOR SUPABASE - VERSIÓN COMPLETA Y ACTUALIZADA
-- Incluye assessments_taken y last_assessment_date para contador y gating

-- Enable UUID extension (necesario para generar IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (actualizada con nuevas columnas)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Suscripción y planes
  subscription_level VARCHAR(50) DEFAULT 'free',          -- 'free', 'essential', 'sentinel', 'consultation'
  subscription_start TIMESTAMP WITH TIME ZONE,
  subscription_end TIMESTAMP WITH TIME ZONE,
  
  -- Campos nuevos para contador y gating
  assessments_taken INTEGER DEFAULT 0,                     -- Contador de evaluaciones realizadas
  last_assessment_date TIMESTAMP WITH TIME ZONE,           -- Última fecha de evaluación (para límite mensual en free)
  
  -- Campos requeridos por backend
  pdf_password VARCHAR(50),
  payment_type VARCHAR(50) DEFAULT 'none',
  essential_assessment_id UUID,                            -- ID de la única evaluación Essential
  
  -- Preferencias de Email
  email_hack_alerts BOOLEAN DEFAULT false,
  email_daily_tips BOOLEAN DEFAULT false,
  email_wallet_reviews BOOLEAN DEFAULT false,
  
  consultation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  language_preference VARCHAR(5) DEFAULT 'en'              -- 'en' o 'es'
);

-- Índices útiles para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_assessments_taken ON users(assessments_taken);
CREATE INDEX IF NOT EXISTS idx_users_last_assessment_date ON users(last_assessment_date);

-- ============================================
-- ASSESSMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  responses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_id VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL,                               -- 'essential', 'sentinel', 'consultation', etc.
  amount_usd DECIMAL(10, 2) NOT NULL,
  amount_btc DECIMAL(18, 8),
  btc_price_usd DECIMAL(10, 2),
  bitcoin_address VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(255),
  confirmations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
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
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  meeting_link VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COMMUNITY STATS TABLE (single row)
-- ============================================
CREATE TABLE IF NOT EXISTS community_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_assessments INTEGER DEFAULT 0,
  average_score DECIMAL(5, 2) DEFAULT 0,
  score_distribution JSONB DEFAULT '{"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Inicializar stats comunitarias si no existe
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

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Función para actualizar stats comunitarias automáticamente
CREATE OR REPLACE FUNCTION update_community_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_stats
  SET
    total_assessments = (SELECT COUNT(*) FROM assessments),
    average_score = (SELECT COALESCE(AVG(score), 0) FROM assessments),
    score_distribution = (
      SELECT jsonb_build_object(
        '0-20', COUNT(*) FILTER (WHERE score BETWEEN 0 AND 20),
        '21-40', COUNT(*) FILTER (WHERE score BETWEEN 21 AND 40),
        '41-60', COUNT(*) FILTER (WHERE score BETWEEN 41 AND 60),
        '61-80', COUNT(*) FILTER (WHERE score BETWEEN 61 AND 80),
        '81-100', COUNT(*) FILTER (WHERE score BETWEEN 81 AND 100)
      ) FROM assessments
    ),
    updated_at = NOW()
  WHERE id = 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para ejecutar después de insert/delete en assessments
DROP TRIGGER IF EXISTS trigger_update_community_stats ON assessments;
CREATE TRIGGER trigger_update_community_stats
AFTER INSERT OR DELETE ON assessments
FOR EACH STATEMENT EXECUTE FUNCTION update_community_stats();

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Permisivo para Backend (Service Role)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;

-- Políticas: Service Role tiene acceso total (tu backend usa la service key)
CREATE POLICY "Full access for service role" ON users FOR ALL USING (true);
CREATE POLICY "Full access for service role" ON assessments FOR ALL USING (true);
CREATE POLICY "Full access for service role" ON payments FOR ALL USING (true);
CREATE POLICY "Full access for service role" ON consultations FOR ALL USING (true);
CREATE POLICY "Full access for service role" ON session_tokens FOR ALL USING (true);
CREATE POLICY "Read access for all" ON community_stats FOR SELECT USING (true);
CREATE POLICY "Full access for service role" ON community_stats FOR ALL USING (true);

-- ============================================
-- TELEGRAM BOT INTEGRATION TABLES
-- For BTC Guardian integration with Kyward
-- ============================================

-- Link Telegram users to Kyward accounts
CREATE TABLE IF NOT EXISTS telegram_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  telegram_user_id BIGINT UNIQUE NOT NULL,
  telegram_username VARCHAR(255),
  telegram_first_name VARCHAR(255),
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_code VARCHAR(10),
  verification_expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_telegram_links_user_id ON telegram_links(user_id);
CREATE INDEX IF NOT EXISTS idx_telegram_links_telegram_user_id ON telegram_links(telegram_user_id);

-- Monitored Bitcoin wallets (from BTC Guardian)
CREATE TABLE IF NOT EXISTS monitored_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  telegram_user_id BIGINT NOT NULL,
  address TEXT NOT NULL,
  label VARCHAR(100),
  address_type VARCHAR(20) DEFAULT 'single', -- 'single', 'xpub', 'ypub', 'zpub', 'multisig'

  -- Multisig-specific fields (NULL for non-multisig wallets)
  is_multisig BOOLEAN DEFAULT FALSE,
  xpubs TEXT[] DEFAULT NULL,                    -- Array of extended public keys for multisig
  required_signatures INTEGER DEFAULT NULL,      -- m (number of signatures required)
  total_keys INTEGER DEFAULT NULL,               -- n (total number of keys)
  witness_type VARCHAR(20) DEFAULT 'legacy',     -- 'legacy', 'p2sh-segwit', 'segwit'

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_balance_btc DECIMAL(18, 8),
  last_balance_usd DECIMAL(18, 2),
  last_checked_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, address)
);

CREATE INDEX IF NOT EXISTS idx_monitored_wallets_user_id ON monitored_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_monitored_wallets_telegram_user_id ON monitored_wallets(telegram_user_id);
CREATE INDEX IF NOT EXISTS idx_monitored_wallets_is_multisig ON monitored_wallets(is_multisig);

-- Transaction alerts seen (deduplication)
CREATE TABLE IF NOT EXISTS transactions_seen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  txid TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wallet_address TEXT,
  amount_btc DECIMAL(18, 8),
  tx_type VARCHAR(20), -- 'incoming', 'outgoing'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_seen_txid ON transactions_seen(txid);
CREATE INDEX IF NOT EXISTS idx_transactions_seen_user_id ON transactions_seen(user_id);

-- Historical balance snapshots for charts
CREATE TABLE IF NOT EXISTS historical_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  btc_balance DECIMAL(18, 8),
  usd_balance DECIMAL(18, 2),
  recorded_at DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, wallet_address, recorded_at)
);

CREATE INDEX IF NOT EXISTS idx_historical_balances_user_id ON historical_balances(user_id);

-- Bot preferences per user
CREATE TABLE IF NOT EXISTS bot_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  telegram_user_id BIGINT UNIQUE,
  daily_updates BOOLEAN DEFAULT FALSE,
  report_frequency VARCHAR(20) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
  preferred_language VARCHAR(5) DEFAULT 'en', -- 'en', 'es', 'pt'
  last_report_sent TIMESTAMP WITH TIME ZONE,
  price_alerts BOOLEAN DEFAULT TRUE,
  transaction_alerts BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_bot_preferences_telegram_user_id ON bot_preferences(telegram_user_id);

-- XPUB address derivation cache
CREATE TABLE IF NOT EXISTS xpub_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  xpub TEXT UNIQUE NOT NULL,
  derived_addresses TEXT[], -- Array of derived addresses
  last_index INTEGER DEFAULT 0,
  last_scan TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bot global config
CREATE TABLE IF NOT EXISTS bot_config (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize bot config
INSERT INTO bot_config (key, value) VALUES
  ('last_payment_index', '0'),
  ('last_known_btc_price', '0')
ON CONFLICT (key) DO NOTHING;

-- RLS for new tables
ALTER TABLE telegram_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions_seen ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE xpub_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_config ENABLE ROW LEVEL SECURITY;

-- Policies for new tables (service role full access)
CREATE POLICY "Full access for service role" ON telegram_links FOR ALL USING (true);
CREATE POLICY "Full access for service role" ON monitored_wallets FOR ALL USING (true);
CREATE POLICY "Full access for service role" ON transactions_seen FOR ALL USING (true);
CREATE POLICY "Full access for service role" ON historical_balances FOR ALL USING (true);
CREATE POLICY "Full access for service role" ON bot_preferences FOR ALL USING (true);
CREATE POLICY "Full access for service role" ON xpub_cache FOR ALL USING (true);
CREATE POLICY "Full access for service role" ON bot_config FOR ALL USING (true);