// KYWARD DATABASE SERVICE - SUPABASE INTEGRATION
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;

// Initialize Supabase connection
const initSupabase = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase not configured - using in-memory fallback');
    return null;
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};

// In-memory fallback for development
const memoryDB = {
  users: {},
  assessments: {},
  sessions: {},
  community_stats: {
    total_assessments: 0,
    average_score: 50,
    score_distribution: { "0-20": 10, "21-40": 20, "41-60": 35, "61-80": 25, "81-100": 10 }
  }
};

// Hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password + process.env.PASSWORD_SALT || 'kyward_secure_salt_2024').digest('hex');
};

// Generate session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate PDF password
const generatePdfPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// ============================================
// USER OPERATIONS
// ============================================

// Create new user
const createUser = async (email, password) => {
  const db = initSupabase();
  const passwordHash = hashPassword(password);
  const pdfPassword = generatePdfPassword();

  if (db) {
    try {
      // Check if user exists
      const { data: existing } = await db
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existing) {
        return { success: false, message: 'An account with this email already exists.' };
      }

      // Create user
      const { data, error } = await db
        .from('users')
        .insert([{
          email,
          password_hash: passwordHash,
          subscription_level: 'free',
          pdf_password: pdfPassword,
          payment_type: 'none',
          essential_assessment_id: null,
          // ¡Valores explícitos para alertas!
          email_hack_alerts: false,
          email_daily_tips: false,
          email_wallet_reviews: false,
          consultation_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        user: sanitizeUser(data)
      };
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, message: 'Failed to create account.' };
    }
  } else {
    // Memory fallback
    if (memoryDB.users[email]) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const user = {
      id: crypto.randomUUID(),
      email,
      password_hash: passwordHash,
      subscription_level: 'free',
      pdf_password: pdfPassword,
      payment_type: 'none', // New
      essential_assessment_id: null, // New
      created_at: new Date().toISOString(),
      monthly_assessment_count: 0,
      last_reset_date: new Date().toISOString()
    };

    memoryDB.users[email] = user;
    return { success: true, user: sanitizeUser(user) };
  }
};

// Login user
const loginUser = async (email, password) => {
  const db = initSupabase();
  const passwordHash = hashPassword(password);

  if (db) {
    try {
      const { data: user, error } = await db
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return { success: false, message: 'User not found. Please sign up first.' };
      }

      if (user.password_hash !== passwordHash) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }

      // Get actual assessment count from assessments table
      const { count: actualCount, error: countError } = await db
        .from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (!countError && actualCount !== null) {
        user.assessments_taken = actualCount;
        console.log(`Login - User ${email} has ${actualCount} assessments`);
      }

      // Create session
      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      const { error: sessionError } = await db.from('session_tokens').insert([{
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString()
      }]);

      if (sessionError) {
        console.error('Failed to create session:', sessionError);
        return { success: false, message: 'Failed to create session. Please try again.' };
      }

      console.log('Session created successfully for user:', email);

      // Update last login
      await db
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      return {
        success: true,
        user: sanitizeUser(user),
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  } else {
    // Memory fallback
    const user = memoryDB.users[email];
    if (!user) {
      return { success: false, message: 'User not found. Please sign up first.' };
    }

    if (user.password_hash !== passwordHash) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const token = generateSessionToken();
    memoryDB.sessions[token] = {
      email,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    return { success: true, user: sanitizeUser(user), token };
  }
};

// Validate session
const validateSession = async (token) => {
  const db = initSupabase();

  if (db) {
    try {
      // First, validate the session token (use .maybeSingle() to handle 0 or 1 rows)
      const { data: session, error: sessionError } = await db
        .from('session_tokens')
        .select('user_id, expires_at')
        .eq('token', token)
        .maybeSingle();

      if (sessionError) {
        console.error('Session validation error:', sessionError.message);
        return null;
      }

      if (!session) {
        console.log('No session found for token:', token.substring(0, 10) + '...');
        return null;
      }

      console.log('Session found, user_id:', session.user_id);

      if (new Date(session.expires_at) < new Date()) {
        await db.from('session_tokens').delete().eq('token', token);
        return null;
      }

      // Then, get FRESH user data directly from users table (not from JOIN cache)
      const { data: userData, error: userError } = await db
        .from('users')
        .select('*')
        .eq('id', session.user_id)
        .single();

      if (userError || !userData) return null;

      // Get actual assessment count from assessments table
      const { count: actualCount, error: countError } = await db
        .from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userData.id);

      if (!countError && actualCount !== null) {
        userData.assessments_taken = actualCount;
      }

      console.log('validateSession - Fresh user data:', {
        email: userData.email,
        subscription_level: userData.subscription_level
      });

      return sanitizeUser(userData);
    } catch (error) {
      console.error('validateSession error:', error);
      return null;
    }
  } else {
    const session = memoryDB.sessions[token];
    if (!session) return null;

    if (new Date(session.expiresAt) < new Date()) {
      delete memoryDB.sessions[token];
      return null;
    }

    return sanitizeUser(memoryDB.users[session.email]);
  }
};

// Logout (delete session)
const logout = async (token) => {
  const db = initSupabase();

  if (db) {
    await db.from('session_tokens').delete().eq('token', token);
  } else {
    delete memoryDB.sessions[token];
  }
};

// Get user by email (with actual assessment count from assessments table)
const getUserByEmail = async (email) => {
  const db = initSupabase();

  if (db) {
    try {
      const { data, error } = await db
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) return null;

      // IMPORTANT: Get actual assessment count from assessments table as fallback
      // This ensures accuracy even if the assessments_taken field wasn't updated
      const { count: actualCount, error: countError } = await db
        .from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', data.id);

      if (!countError && actualCount !== null) {
        // Use the actual count from assessments table
        data.assessments_taken = actualCount;
        console.log(`User ${email} - Actual assessment count from DB: ${actualCount}`);
      }

      return sanitizeUser(data);
    } catch (error) {
      console.error('getUserByEmail error:', error);
      return null;
    }
  } else {
    const user = memoryDB.users[email];
    return user ? sanitizeUser(user) : null;
  }
};

// Check if user exists
const userExists = async (email) => {
  const user = await getUserByEmail(email);
  return !!user;
};

// Reset password
const resetPassword = async (email, newPassword) => {
  const db = initSupabase();
  const passwordHash = hashPassword(newPassword);

  if (db) {
    try {
      const { error } = await db
        .from('users')
        .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
        .eq('email', email);

      if (error) throw error;
      return { success: true, message: 'Password reset successfully.' };
    } catch (error) {
      return { success: false, message: 'Failed to reset password.' };
    }
  } else {
    if (!memoryDB.users[email]) {
      return { success: false, message: 'User not found.' };
    }
    memoryDB.users[email].password_hash = passwordHash;
    return { success: true, message: 'Password reset successfully.' };
  }
};

// Sanitize user (remove sensitive data)
const sanitizeUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    subscriptionLevel: user.subscription_level,
    subscriptionDate: user.subscription_start,
    subscriptionEnd: user.subscription_end,
    pdfPassword: user.pdf_password,
    consultationCount: user.consultation_count || 0,
    lastConsultationDate: user.last_consultation_date || null,
    createdAt: user.created_at,
    lastLogin: user.last_login,
    languagePreference: user.language_preference || 'en',
    paymentType: user.payment_type || 'none',
    essentialAssessmentId: user.essential_assessment_id || null,
    emailHackAlerts: user.email_hack_alerts !== false,
    emailDailyTips: user.email_daily_tips !== false,
    emailWalletReviews: user.email_wallet_reviews !== false,
    assessmentsTaken: user.assessments_taken ?? 0,           
    lastAssessmentDate: user.last_assessment_date || null,
  };
};

// ============================================
// SUBSCRIPTION OPERATIONS
// ============================================

// Upgrade subscription
// Plans: 'essential' (one-time $9.99), 'sentinel' ($14.99/mo), 'consultation' ($99 + $49/hr)
// Upgrade subscription - Versión corregida, tipada y con lógica de alertas completa
const upgradeSubscription = async (email, newLevel) => {
  const db = initSupabase();

  if (db) {
    try {
      // Preparar updates base
      const updates = {
        subscription_level: newLevel,
        subscription_start: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Campos que SIEMPRE actualizamos según el plan
        payment_type: null,           // Lo seteamos según plan
        subscription_end: null,       // Lo seteamos según plan
        // Alertas: por default las desactivamos, activamos solo en premium
        email_hack_alerts: false,
        email_daily_tips: false,
        email_wallet_reviews: false
      };

      // Lógica por plan
      if (newLevel === 'essential') {
        updates.payment_type = 'one_time';
        updates.subscription_end = null; // One-time, sin fecha de fin
        // Essential NO activa alertas (solo Sentinel/Consultation)
      } 
      else if (newLevel === 'sentinel') {
        updates.payment_type = 'subscription';
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        updates.subscription_end = endDate.toISOString();
        
        // Activar alertas premium
        updates.email_hack_alerts = true;
        updates.email_daily_tips = true;
        updates.email_wallet_reviews = true;
      } 
      else if (newLevel === 'consultation' || newLevel === 'consultation_additional') {
        updates.payment_type = 'subscription';
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        updates.subscription_end = endDate.toISOString();

        // Activar alertas premium + incrementar conteo de consultas + registrar fecha
        updates.email_hack_alerts = true;
        updates.email_daily_tips = true;
        updates.email_wallet_reviews = true;
        updates.consultation_count = db.raw('consultation_count + 1');
        updates.last_consultation_date = new Date().toISOString();
      } 
      else {
        // Si baja a 'free' o cualquier otro (por si acaso)
        updates.payment_type = 'none';
        updates.subscription_end = null;
        // Desactivar alertas explícitamente
        updates.email_hack_alerts = false;
        updates.email_daily_tips = false;
        updates.email_wallet_reviews = false;
      }

      // Ejecutar update
      const { data, error } = await db
        .from('users')
        .update(updates)
        .eq('email', email)
        .select('*')
        .single();

      if (error) throw error;

      return { success: true, user: data };
    } catch (error) {
      console.error('Upgrade subscription error:', error.message || error);
      return { success: false, message: 'Failed to upgrade subscription.' };
    }
  } else {
    // Memory fallback - misma lógica
    const user = memoryDB.users[email];
    if (!user) return { success: false, message: 'User not found' };

    user.subscriptionLevel = newLevel;
    user.updatedAt = new Date().toISOString();
    user.subscriptionStart = new Date().toISOString();

    if (newLevel === 'essential') {
      user.payment_type = 'one_time';
      user.subscriptionEnd = null;
      // Alertas OFF
      user.email_hack_alerts = false;
      user.email_daily_tips = false;
      user.email_wallet_reviews = false;
    } else if (newLevel === 'sentinel' || newLevel === 'consultation' || newLevel === 'consultation_additional') {
      user.payment_type = 'subscription';
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      user.subscriptionEnd = endDate.toISOString();

      // Alertas ON
      user.email_hack_alerts = true;
      user.email_daily_tips = true;
      user.email_wallet_reviews = true;

      if (newLevel === 'consultation' || newLevel === 'consultation_additional') {
        user.consultationCount = (user.consultationCount || 0) + 1;
        user.lastConsultationDate = new Date().toISOString();
      }
    } else {
      // Baja a free u otro
      user.payment_type = 'none';
      user.subscriptionEnd = null;
      user.email_hack_alerts = false;
      user.email_daily_tips = false;
      user.email_wallet_reviews = false;
    }

    return { success: true, user };
  }
};

// Update email preferences
const updateEmailPreferences = async (email, preferences) => {
  const db = initSupabase();

  if (db) {
    try {
      const { data, error } = await db
        .from('users')
        .update({
          email_daily_tips: preferences.dailyTips ?? false,
          email_hack_alerts: preferences.securityAlerts ?? false,
          email_wallet_reviews: preferences.monthlyReviews ?? false,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;
      return { success: true, user: sanitizeUser(data) };
    } catch (error) {
      console.error('Update preferences error:', error);
      return { success: false, message: 'Failed to update preferences' };
    }
  } else {
    // Memory fallback
    const user = memoryDB.users[email];
    if (!user) return { success: false, message: 'User not found' };

    user.email_daily_tips = preferences.dailyTips ?? false;
    user.email_hack_alerts = preferences.securityAlerts ?? false;
    user.email_wallet_reviews = preferences.monthlyReviews ?? false;

    return { success: true, user: sanitizeUser(user) };
  }
};

// Check premium access (can download PDF, see all tips)
// Returns true for: essential (with purchase), sentinel (active), consultation
// Has premium access
const hasPremiumAccess = async (email) => {
  const db = initSupabase();

  if (db) {
    try {
      const { data: user } = await db
        .from('users')
        .select('subscription_level, subscription_end, payment_type, essential_assessment_id')
        .eq('email', email)
        .single();

      if (!user) return false;

      const now = new Date();
      if (user.subscription_level === 'essential') {
        return !!user.essential_assessment_id; // Access if they have an assessment
      } else if (user.subscription_level === 'sentinel' || user.subscription_level === 'consultation') {
        return user.payment_type === 'subscription' && new Date(user.subscription_end) > now;
      }
      return false;
    } catch (error) {
      console.error('Has premium error:', error);
      return false;
    }
  } else {
    const user = memoryDB.users[email];
    if (!user) return false;

    const now = new Date();
    if (user.subscriptionLevel === 'essential') {
      return !!user.essential_assessment_id;
    } else if (user.subscriptionLevel === 'sentinel' || user.subscriptionLevel === 'consultation') {
      return user.payment_type === 'subscription' && new Date(user.subscriptionEnd) > now;
    }
    return false;
  }
};

// New: Can take new assessment
const canTakeNewAssessment = async (email) => {
  const db = initSupabase();

  if (db) {
    try {
      const { data: user } = await db
        .from('users')
        .select('subscription_level, subscription_end, payment_type, essential_assessment_id')
        .eq('email', email)
        .single();

      if (!user) return false;

      const now = new Date();
      if (user.subscription_level === 'free') return true; // Unlimited for free, but limited features
      if (user.subscription_level === 'essential') return !user.essential_assessment_id; // Only if no prior assessment
      if (user.subscription_level === 'sentinel' || user.subscription_level === 'consultation') {
        return user.payment_type === 'subscription' && new Date(user.subscription_end) > now; // Unlimited while active
      }
      return false;
    } catch (error) {
      console.error('Can take assessment error:', error);
      return false;
    }
  } else {
    const user = memoryDB.users[email];
    if (!user) return false;

    const now = new Date();
    if (user.subscriptionLevel === 'free') return true;
    if (user.subscriptionLevel === 'essential') return !user.essential_assessment_id;
    if (user.subscriptionLevel === 'sentinel' || user.subscriptionLevel === 'consultation') {
      return user.payment_type === 'subscription' && new Date(user.subscriptionEnd) > now;
    }
    return false;
  }
};

// ============================================
// ASSESSMENT OPERATIONS
// ============================================

// Can take assessment
const canTakeAssessment = async (email) => {
  const db = initSupabase();
  const user = await getUserByEmail(email);
  if (!user) return { canTake: false, remaining: 0 };

  // Sentinel/Consultation with active subscription: unlimited
  if (user.subscriptionLevel === 'sentinel' || user.subscriptionLevel === 'consultation') {
    const isPremium = await hasPremiumAccess(email);
    if (isPremium) {
      return { canTake: true, remaining: Infinity, isPremium: true };
    }
  }

  // Essential: can only take if they haven't used their one assessment
  if (user.subscriptionLevel === 'essential') {
    return {
      canTake: !user.essentialAssessmentId,
      remaining: user.essentialAssessmentId ? 0 : 1,
      isPremium: false,
      reason: user.essentialAssessmentId ? 'Essential assessment already used. Repurchase to take another.' : null
    };
  }

  // Free users: 1 per 30 days
  if (db) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count, error } = await db
        .from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (!error) {
        const canTake = count === 0;
        console.log(`Free user ${email} - assessments in last 30 days: ${count}, canTake: ${canTake}`);
        return {
          canTake,
          remaining: canTake ? 1 : 0,
          isPremium: false,
          reason: !canTake ? 'Free users can take 1 assessment per month. Upgrade for more.' : null
        };
      }
    } catch (error) {
      console.error('canTakeAssessment error:', error);
    }
  }

  // Fallback: allow
  return { canTake: true, remaining: 1, isPremium: false };
};

// Save assessment (update to set essential_assessment_id if Essential)
// Save assessment - Versión corregida y completa
const saveAssessment = async (userId, score, responses, timestamp = new Date().toISOString()) => {
  const db = initSupabase();

  if (!db) {
    console.warn('⚠️ Supabase no configurado - usando memory fallback');
    
    // Memory fallback (mantengo tu lógica original pero mejorada)
    const user = memoryDB.users[Object.keys(memoryDB.users).find(e => memoryDB.users[e].id === userId)];
    if (!user) return { success: false, message: 'User not found in memory' };

    const assessmentId = crypto.randomUUID();
    memoryDB.assessments[assessmentId] = { 
      userId, 
      score, 
      responses, 
      createdAt: timestamp 
    };

    if (user.subscriptionLevel === 'essential' && !user.essential_assessment_id) {
      user.essential_assessment_id = assessmentId;
    }

    // Actualiza contador en memoria
    user.assessments_taken = (user.assessments_taken || 0) + 1;
    user.last_assessment_date = timestamp;

    // Actualiza stats comunitarias
    memoryDB.community_stats.total_assessments++;
    memoryDB.community_stats.average_score = Math.round(
      (memoryDB.community_stats.average_score * (memoryDB.community_stats.total_assessments - 1) + score) / 
      memoryDB.community_stats.total_assessments
    );

    const range = score < 21 ? '0-20' : score < 41 ? '21-40' : score < 61 ? '41-60' : score < 81 ? '61-80' : '81-100';
    memoryDB.community_stats.score_distribution[range] = (memoryDB.community_stats.score_distribution[range] || 0) + 1;

    console.log('Assessment guardado en memory fallback - ID:', assessmentId);
    return { success: true, assessmentId };
  }

  // Flujo real con Supabase
  try {
    console.log('Guardando assessment en Supabase para userId:', userId);

    const { data: assessment, error: insertError } = await db
      .from('assessments')
      .insert([{
        user_id: userId,           // UUID correcto
        score,
        responses,
        created_at: timestamp      // Campo que coincide con tu schema
      }])
      .select('id')
      .single();

    if (insertError) {
      console.error('Error al insertar assessment:', insertError.message);
      throw insertError;
    }

    console.log('Assessment insertado con ID:', assessment.id);

    // Actualizar contador y fecha en users
    // En vez de update directo (que falla)
    const { error: rpcError } = await db
      .rpc('increment_assessments_taken', {
        p_user_id: userId,
        p_timestamp: timestamp
      });

    if (rpcError) {
      console.error('Error en RPC increment_assessments_taken:', rpcError.message);
      throw rpcError;
    }

    // Caso especial: Essential - guardar el ID de la primera evaluación
    const { data: user, error: userError } = await db
      .from('users')
      .select('subscription_level, essential_assessment_id')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error al obtener usuario para Essential check:', userError.message);
    } else if (user.subscription_level === 'essential' && !user.essential_assessment_id) {
      const { error: essentialError } = await db
        .from('users')
        .update({ essential_assessment_id: assessment.id })
        .eq('id', userId);

      if (essentialError) {
        console.error('Error al guardar essential_assessment_id:', essentialError.message);
      } else {
        console.log('essential_assessment_id guardado:', assessment.id);
      }
    }

    return { success: true, assessmentId: assessment.id };
  } catch (error) {
    console.error('Error completo en saveAssessment:', error.message || error);
    return { success: false, message: error.message || 'Failed to save assessment in Supabase' };
  }
};

// Get user assessments
const getUserAssessments = async (email) => {
  const db = initSupabase();

  if (db) {
    try {
      const { data: user } = await db
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (!user) return [];

      const { data, error } = await db
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      return [];
    }
  } else {
    return memoryDB.assessments[email] || [];
  }
};

// ============================================
// TELEGRAM INTEGRATION
// ============================================

// Generate verification code for Telegram linking
const generateVerificationCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Initiate Telegram link - generates verification code
const initiateTelegramLink = async (userId) => {
  const db = initSupabase();

  if (!db) {
    return { success: false, message: 'Database not configured' };
  }

  try {
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user already has a link
    const { data: existing } = await db
      .from('telegram_links')
      .select('id, is_verified')
      .eq('user_id', userId)
      .single();

    if (existing && existing.is_verified) {
      return { success: false, message: 'Telegram already linked', alreadyLinked: true };
    }

    if (existing) {
      // Update existing unverified link
      const { error } = await db
        .from('telegram_links')
        .update({
          verification_code: verificationCode,
          verification_expires_at: expiresAt.toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Create new link entry
      const { error } = await db
        .from('telegram_links')
        .insert([{
          user_id: userId,
          telegram_user_id: 0, // Placeholder until verified
          verification_code: verificationCode,
          verification_expires_at: expiresAt.toISOString(),
          is_verified: false
        }]);

      if (error) throw error;
    }

    return {
      success: true,
      verificationCode,
      expiresAt: expiresAt.toISOString()
    };
  } catch (error) {
    console.error('Initiate Telegram link error:', error);
    return { success: false, message: 'Failed to initiate Telegram link' };
  }
};

// Verify Telegram link (called by bot)
const verifyTelegramLink = async (verificationCode, telegramUserId, telegramUsername, telegramFirstName) => {
  const db = initSupabase();

  if (!db) {
    return { success: false, message: 'Database not configured' };
  }

  try {
    // Find pending link with this code
    const { data: link, error: findError } = await db
      .from('telegram_links')
      .select('*, users!inner(email, subscription_level, subscription_end)')
      .eq('verification_code', verificationCode)
      .eq('is_verified', false)
      .single();

    if (findError || !link) {
      return { success: false, message: 'Invalid or expired verification code' };
    }

    // Check if code expired
    if (new Date(link.verification_expires_at) < new Date()) {
      return { success: false, message: 'Verification code expired' };
    }

    // Check if this telegram_user_id is already linked to another account
    const { data: existingLink } = await db
      .from('telegram_links')
      .select('user_id')
      .eq('telegram_user_id', telegramUserId)
      .eq('is_verified', true)
      .single();

    if (existingLink && existingLink.user_id !== link.user_id) {
      return { success: false, message: 'This Telegram account is already linked to another Kyward account' };
    }

    // Update the link
    const { error: updateError } = await db
      .from('telegram_links')
      .update({
        telegram_user_id: telegramUserId,
        telegram_username: telegramUsername,
        telegram_first_name: telegramFirstName,
        is_verified: true,
        linked_at: new Date().toISOString(),
        verification_code: null,
        verification_expires_at: null
      })
      .eq('id', link.id);

    if (updateError) throw updateError;

    // Also create/update bot_preferences
    const { error: prefError } = await db
      .from('bot_preferences')
      .upsert({
        user_id: link.user_id,
        telegram_user_id: telegramUserId,
        daily_updates: false,
        transaction_alerts: true,
        price_alerts: true
      }, { onConflict: 'user_id' });

    if (prefError) {
      console.error('Bot preferences upsert error:', prefError);
    }

    return {
      success: true,
      email: link.users.email,
      subscriptionLevel: link.users.subscription_level,
      subscriptionEnd: link.users.subscription_end
    };
  } catch (error) {
    console.error('Verify Telegram link error:', error);
    return { success: false, message: 'Failed to verify Telegram link' };
  }
};

// Get Telegram link status for a user
const getTelegramLink = async (userId) => {
  const db = initSupabase();

  if (!db) {
    return null;
  }

  try {
    const { data, error } = await db
      .from('telegram_links')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  } catch (error) {
    return null;
  }
};

// Get user by Telegram ID
const getUserByTelegramId = async (telegramUserId) => {
  const db = initSupabase();

  if (!db) {
    return null;
  }

  try {
    const { data: link, error } = await db
      .from('telegram_links')
      .select('*, users!inner(*)')
      .eq('telegram_user_id', telegramUserId)
      .eq('is_verified', true)
      .single();

    if (error || !link) return null;
    return sanitizeUser(link.users);
  } catch (error) {
    return null;
  }
};

// Check Sentinel subscription by Telegram ID (for bot to call)
const checkSentinelSubscription = async (telegramUserId) => {
  const db = initSupabase();

  if (!db) {
    return { hasAccess: false, reason: 'Database not configured' };
  }

  try {
    const { data: link, error } = await db
      .from('telegram_links')
      .select('*, users!inner(subscription_level, subscription_end, payment_type, email)')
      .eq('telegram_user_id', telegramUserId)
      .eq('is_verified', true)
      .single();

    if (error || !link) {
      return { hasAccess: false, reason: 'Telegram not linked to Kyward account' };
    }

    const user = link.users;
    const now = new Date();

    // Check if subscription is Sentinel or Consultation AND active
    if (user.subscription_level === 'sentinel' || user.subscription_level === 'consultation') {
      if (user.payment_type === 'subscription' && user.subscription_end) {
        const endDate = new Date(user.subscription_end);
        if (endDate > now) {
          return {
            hasAccess: true,
            email: user.email,
            subscriptionLevel: user.subscription_level,
            subscriptionEnd: user.subscription_end,
            daysRemaining: Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
          };
        } else {
          return {
            hasAccess: false,
            reason: 'Subscription expired',
            email: user.email,
            expiredAt: user.subscription_end
          };
        }
      }
    }

    return {
      hasAccess: false,
      reason: `Sentinel subscription required (current: ${user.subscription_level})`,
      email: user.email,
      subscriptionLevel: user.subscription_level
    };
  } catch (error) {
    console.error('Check Sentinel subscription error:', error);
    return { hasAccess: false, reason: 'Error checking subscription' };
  }
};

// Unlink Telegram
const unlinkTelegram = async (userId) => {
  const db = initSupabase();

  if (!db) {
    return { success: false, message: 'Database not configured' };
  }

  try {
    // Delete from telegram_links
    const { error: linkError } = await db
      .from('telegram_links')
      .delete()
      .eq('user_id', userId);

    if (linkError) throw linkError;

    // Also delete bot_preferences
    await db
      .from('bot_preferences')
      .delete()
      .eq('user_id', userId);

    // Delete monitored wallets
    await db
      .from('monitored_wallets')
      .delete()
      .eq('user_id', userId);

    return { success: true };
  } catch (error) {
    console.error('Unlink Telegram error:', error);
    return { success: false, message: 'Failed to unlink Telegram' };
  }
};

// ============================================
// COMMUNITY STATS
// ============================================

// Get community stats
const getCommunityStats = async () => {
  const db = initSupabase();

  if (db) {
    try {
      const { data, error } = await db
        .from('community_stats')
        .select('*')
        .single();

      if (error) throw error;
      return {
        totalAssessments: data.total_assessments,
        averageScore: Math.round(data.average_score),
        distribution: data.score_distribution
      };
    } catch (error) {
      return memoryDB.community_stats;
    }
  } else {
    return {
      totalAssessments: memoryDB.community_stats.total_assessments,
      averageScore: memoryDB.community_stats.average_score,
      distribution: memoryDB.community_stats.score_distribution
    };
  }
};

// Compare user score to community
const compareToAverage = async (userScore) => {
  const stats = await getCommunityStats();
  const difference = userScore - stats.averageScore;

  // Calculate percentile
  let percentile;
  if (userScore >= 80) {
    percentile = 85 + (userScore - 80) * 0.75;
  } else if (userScore >= 50) {
    percentile = 35 + ((userScore - 50) / 30) * 50;
  } else {
    percentile = (userScore / 50) * 35;
  }
  percentile = Math.min(99, Math.max(1, Math.round(percentile)));

  // Distribution percentages
  const dist = stats.distribution;
  const total = Object.values(dist).reduce((a, b) => a + b, 1);
  const distributionPercent = {
    needsWork: Math.round((dist['0-20'] + dist['21-40']) / total * 100),
    moderate: Math.round((dist['41-60'] + dist['61-80']) / total * 100),
    excellent: Math.round(dist['81-100'] / total * 100)
  };

  return {
    userScore,
    averageScore: stats.averageScore,
    difference,
    percentile,
    isAboveAverage: difference > 0,
    isBelowAverage: difference < 0,
    comparison: difference > 10 ? 'well above' :
                difference > 0 ? 'above' :
                difference === 0 ? 'at' :
                difference > -10 ? 'below' : 'well below',
    distribution: distributionPercent
  };
};

// ============================================
// WALLET MANAGEMENT (for BTC Guardian)
// ============================================

// Add a monitored wallet
const addMonitoredWallet = async (telegramUserId, address, label = '', addressType = 'single') => {
  const db = initSupabase();

  if (!db) {
    return { success: false, message: 'Database not configured' };
  }

  try {
    // Get user_id from telegram_links
    const { data: link, error: linkError } = await db
      .from('telegram_links')
      .select('user_id')
      .eq('telegram_user_id', telegramUserId)
      .eq('is_verified', true)
      .single();

    if (linkError || !link) {
      return { success: false, message: 'Telegram not linked' };
    }

    // Check for duplicate
    const { data: existing } = await db
      .from('monitored_wallets')
      .select('id')
      .eq('user_id', link.user_id)
      .ilike('address', address)
      .single();

    if (existing) {
      return { success: false, message: 'Wallet already exists', duplicate: true };
    }

    // Insert wallet
    const { data, error } = await db
      .from('monitored_wallets')
      .insert([{
        user_id: link.user_id,
        telegram_user_id: telegramUserId,
        address: address,
        label: label || null,
        address_type: addressType,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return { success: true, wallet: data };
  } catch (error) {
    console.error('Add wallet error:', error);
    return { success: false, message: 'Failed to add wallet' };
  }
};

// Get all monitored wallets for a user
const getMonitoredWallets = async (telegramUserId) => {
  const db = initSupabase();

  if (!db) {
    return [];
  }

  try {
    const { data, error } = await db
      .from('monitored_wallets')
      .select('*')
      .eq('telegram_user_id', telegramUserId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get wallets error:', error);
    return [];
  }
};

// Remove a monitored wallet
const removeMonitoredWallet = async (telegramUserId, address) => {
  const db = initSupabase();

  if (!db) {
    return { success: false, message: 'Database not configured' };
  }

  try {
    const { error } = await db
      .from('monitored_wallets')
      .delete()
      .eq('telegram_user_id', telegramUserId)
      .ilike('address', address);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Remove wallet error:', error);
    return { success: false, message: 'Failed to remove wallet' };
  }
};

// Update wallet balance
const updateWalletBalance = async (telegramUserId, address, btcBalance, usdBalance) => {
  const db = initSupabase();

  if (!db) return false;

  try {
    const { error } = await db
      .from('monitored_wallets')
      .update({
        last_balance_btc: btcBalance,
        last_balance_usd: usdBalance,
        last_checked_at: new Date().toISOString()
      })
      .eq('telegram_user_id', telegramUserId)
      .ilike('address', address);

    return !error;
  } catch (error) {
    console.error('Update wallet balance error:', error);
    return false;
  }
};

// ============================================
// BOT PREFERENCES
// ============================================

// Get bot preferences
const getBotPreferences = async (telegramUserId) => {
  const db = initSupabase();

  const defaults = {
    daily_updates: false,
    transaction_alerts: true,
    price_alerts: true,
    report_frequency: 'weekly',
    preferred_language: 'en'
  };

  if (!db) return defaults;

  try {
    const { data, error } = await db
      .from('bot_preferences')
      .select('*')
      .eq('telegram_user_id', telegramUserId)
      .single();

    if (error || !data) return defaults;
    return data;
  } catch (error) {
    return defaults;
  }
};

// Update bot preferences
const updateBotPreferences = async (telegramUserId, preferences) => {
  const db = initSupabase();

  if (!db) {
    return { success: false, message: 'Database not configured' };
  }

  try {
    const { data: link } = await db
      .from('telegram_links')
      .select('user_id')
      .eq('telegram_user_id', telegramUserId)
      .eq('is_verified', true)
      .single();

    if (!link) {
      return { success: false, message: 'Telegram not linked' };
    }

    const { error } = await db
      .from('bot_preferences')
      .upsert({
        user_id: link.user_id,
        telegram_user_id: telegramUserId,
        daily_updates: preferences.daily_updates ?? false,
        transaction_alerts: preferences.transaction_alerts ?? true,
        price_alerts: preferences.price_alerts ?? true,
        report_frequency: preferences.report_frequency || 'weekly',
        preferred_language: preferences.preferred_language || 'en'
      }, { onConflict: 'telegram_user_id' });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Update bot preferences error:', error);
    return { success: false, message: 'Failed to update preferences' };
  }
};

// ============================================
// TRANSACTION TRACKING
// ============================================

// Check if transaction seen
const isTransactionSeen = async (txid) => {
  const db = initSupabase();
  if (!db) return false;

  try {
    const { data } = await db
      .from('transactions_seen')
      .select('id')
      .eq('txid', txid)
      .single();
    return !!data;
  } catch (error) {
    return false;
  }
};

// Mark transaction as seen
const markTransactionSeen = async (txid, visitorId, walletAddress, amountBtc, txType) => {
  const db = initSupabase();
  if (!db) return false;

  try {
    await db.from('transactions_seen').insert([{
      txid,
      wallet_address: walletAddress,
      amount_btc: amountBtc,
      tx_type: txType
    }]);
    return true;
  } catch (error) {
    return true; // Likely duplicate
  }
};

// ============================================
// HISTORICAL BALANCES
// ============================================

// Save daily balance
const saveHistoricalBalance = async (telegramUserId, walletAddress, btcBalance, usdBalance) => {
  const db = initSupabase();
  if (!db) return false;

  try {
    const { data: link } = await db
      .from('telegram_links')
      .select('user_id')
      .eq('telegram_user_id', telegramUserId)
      .eq('is_verified', true)
      .single();

    if (!link) return false;

    const today = new Date().toISOString().split('T')[0];

    await db.from('historical_balances').upsert({
      user_id: link.user_id,
      wallet_address: walletAddress,
      btc_balance: btcBalance,
      usd_balance: usdBalance,
      recorded_at: today
    }, { onConflict: 'user_id,wallet_address,recorded_at' });

    return true;
  } catch (error) {
    return false;
  }
};

// Get historical balances
const getHistoricalBalances = async (telegramUserId, days = 30) => {
  const db = initSupabase();
  if (!db) return { dates: [], wallets: [], balances: {} };

  try {
    const { data: link } = await db
      .from('telegram_links')
      .select('user_id')
      .eq('telegram_user_id', telegramUserId)
      .eq('is_verified', true)
      .single();

    if (!link) return { dates: [], wallets: [], balances: {} };

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const { data } = await db
      .from('historical_balances')
      .select('*')
      .eq('user_id', link.user_id)
      .gte('recorded_at', cutoff.toISOString().split('T')[0])
      .order('recorded_at', { ascending: true });

    if (!data || data.length === 0) return { dates: [], wallets: [], balances: {} };

    // Format for charts
    const dates = [...new Set(data.map(d => d.recorded_at))].sort();
    const wallets = [...new Set(data.map(d => d.wallet_address))];
    const balances = {};

    for (const wallet of wallets) {
      balances[wallet] = dates.map(date => {
        const record = data.find(d => d.wallet_address === wallet && d.recorded_at === date);
        return record ? parseFloat(record.btc_balance) : 0;
      });
    }

    return { dates, wallets, balances };
  } catch (error) {
    return { dates: [], wallets: [], balances: {} };
  }
};

// ============================================
// BOT ACTIVE USERS (for monitoring)
// ============================================

/**
 * Get all active bot users with their wallets and preferences
 * Used by the bot for daily updates and transaction monitoring
 */
const getActiveBotUsers = async () => {
  const db = initSupabase();

  if (!db) {
    console.error('Supabase not initialized');
    return [];
  }

  try {
    // Get all telegram links with active Sentinel subscriptions
    const { data: links, error: linksError } = await db
      .from('telegram_links')
      .select('telegram_user_id, user_id')
      .eq('is_verified', true);

    if (linksError || !links || links.length === 0) {
      return [];
    }

    const activeUsers = [];

    for (const link of links) {
      // Check if user has active Sentinel subscription
      const { data: user } = await db
        .from('users')
        .select('subscription_level, subscription_end')
        .eq('id', link.user_id)
        .maybeSingle();

      if (!user || user.subscription_level !== 'sentinel') continue;

      // Check if subscription is still active
      if (user.subscription_end) {
        const endDate = new Date(user.subscription_end);
        if (endDate < new Date()) continue;
      }

      // Get user's wallets
      const { data: wallets } = await db
        .from('monitored_wallets')
        .select('address, label, address_type')
        .eq('telegram_user_id', link.telegram_user_id);

      // Get user's preferences
      const { data: prefs } = await db
        .from('bot_preferences')
        .select('*')
        .eq('telegram_user_id', link.telegram_user_id)
        .maybeSingle();

      activeUsers.push({
        telegram_user_id: link.telegram_user_id,
        user_id: link.user_id,
        wallets: wallets || [],
        preferences: prefs || {
          daily_updates: false,
          transaction_alerts: true,
          price_alerts: true,
          preferred_language: 'en'
        }
      });
    }

    return activeUsers;
  } catch (error) {
    console.error('Error getting active bot users:', error);
    return [];
  }
};

/**
 * Get consultation price based on user's last consultation date
 * If last consultation was 20+ days ago (or never), charge $99 (first session)
 * If less than 20 days, charge $49 (additional session)
 * @param {string} email - User email
 * @returns {object} { price: number, plan: string, isFirstSession: boolean }
 */
const getConsultationPrice = async (email) => {
  const FIRST_SESSION_PRICE = 99;
  const ADDITIONAL_SESSION_PRICE = 49;
  const DAYS_THRESHOLD = 20;

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      // New user - charge first session price
      return {
        price: FIRST_SESSION_PRICE,
        plan: 'consultation',
        isFirstSession: true,
        reason: 'new_user'
      };
    }

    const lastConsultationDate = user.lastConsultationDate;

    if (!lastConsultationDate) {
      // Never had a consultation - charge first session price
      return {
        price: FIRST_SESSION_PRICE,
        plan: 'consultation',
        isFirstSession: true,
        reason: 'no_previous_consultation'
      };
    }

    // Calculate days since last consultation
    const lastDate = new Date(lastConsultationDate);
    const now = new Date();
    const daysSinceLastConsultation = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

    if (daysSinceLastConsultation >= DAYS_THRESHOLD) {
      // 20+ days since last consultation - charge first session price
      return {
        price: FIRST_SESSION_PRICE,
        plan: 'consultation',
        isFirstSession: true,
        reason: `${daysSinceLastConsultation}_days_since_last_session`
      };
    }

    // Less than 20 days - charge additional session price
    return {
      price: ADDITIONAL_SESSION_PRICE,
      plan: 'consultation_additional',
      isFirstSession: false,
      reason: `${daysSinceLastConsultation}_days_since_last_session`,
      daysSinceLastSession: daysSinceLastConsultation
    };
  } catch (error) {
    console.error('Error getting consultation price:', error);
    // Default to first session price on error
    return {
      price: FIRST_SESSION_PRICE,
      plan: 'consultation',
      isFirstSession: true,
      reason: 'error_default'
    };
  }
};

module.exports = {
  initSupabase,
  createUser,
  loginUser,
  validateSession,
  logout,
  getUserByEmail,
  userExists,
  resetPassword,
  upgradeSubscription,
  updateEmailPreferences,
  hasPremiumAccess,
  canTakeAssessment,
  saveAssessment,
  getUserAssessments,
  getCommunityStats,
  compareToAverage,
  generatePdfPassword,
  sanitizeUser,
  // Consultation pricing
  getConsultationPrice,
  // Telegram integration
  initiateTelegramLink,
  verifyTelegramLink,
  getTelegramLink,
  getUserByTelegramId,
  checkSentinelSubscription,
  unlinkTelegram,
  // Wallet management
  addMonitoredWallet,
  getMonitoredWallets,
  removeMonitoredWallet,
  updateWalletBalance,
  // Bot preferences
  getBotPreferences,
  updateBotPreferences,
  // Transaction tracking
  isTransactionSeen,
  markTransactionSeen,
  // Historical balances
  saveHistoricalBalance,
  getHistoricalBalances,
  // Bot monitoring
  getActiveBotUsers
};
