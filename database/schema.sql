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
  email_hack_alerts BOOLEAN DEFAULT true,
  email_daily_tips BOOLEAN DEFAULT true,
  email_wallet_reviews BOOLEAN DEFAULT true,
  
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