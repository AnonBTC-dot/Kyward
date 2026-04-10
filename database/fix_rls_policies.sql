-- FIX: Remove overly permissive USING (true) policies
-- Service role bypasses RLS entirely (BYPASSRLS privilege) — no policies needed.
-- Dropping these means anon/authenticated roles have zero table access, which is correct.

-- Core tables
DROP POLICY IF EXISTS "Full access for service role" ON users;
DROP POLICY IF EXISTS "Full access for service role" ON assessments;
DROP POLICY IF EXISTS "Full access for service role" ON payments;
DROP POLICY IF EXISTS "Full access for service role" ON consultations;
DROP POLICY IF EXISTS "Full access for service role" ON session_tokens;
DROP POLICY IF EXISTS "Full access for service role" ON community_stats;
DROP POLICY IF EXISTS "Read access for all" ON community_stats;
DROP POLICY IF EXISTS "Full access for service role" ON manifesto_leads;

-- Bot/telegram tables
DROP POLICY IF EXISTS "Full access for service role" ON telegram_links;
DROP POLICY IF EXISTS "Full access for service role" ON monitored_wallets;
DROP POLICY IF EXISTS "Full access for service role" ON transactions_seen;
DROP POLICY IF EXISTS "Full access for service role" ON historical_balances;
DROP POLICY IF EXISTS "Full access for service role" ON bot_preferences;
DROP POLICY IF EXISTS "Full access for service role" ON xpub_cache;
DROP POLICY IF EXISTS "Full access for service role" ON bot_config;
DROP POLICY IF EXISTS "Full access for service role" ON custom_price_alerts;

-- Keep this only if community stats are shown publicly (e.g., on landing page)
-- If not needed, remove it too
CREATE POLICY "Public read community_stats" ON community_stats FOR SELECT USING (true);
