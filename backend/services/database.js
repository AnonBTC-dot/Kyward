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

      await db.from('session_tokens').insert([{
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString()
      }]);

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
      const { data: session, error } = await db
        .from('session_tokens')
        .select('*, users(*)')
        .eq('token', token)
        .single();

      if (error || !session) return null;

      if (new Date(session.expires_at) < new Date()) {
        await db.from('session_tokens').delete().eq('id', session.id);
        return null;
      }

      const userData = session.users;

      // Get actual assessment count from assessments table
      if (userData && userData.id) {
        const { count: actualCount, error: countError } = await db
          .from('assessments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userData.id);

        if (!countError && actualCount !== null) {
          userData.assessments_taken = actualCount;
        }
      }

      return sanitizeUser(userData);
    } catch (error) {
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
    createdAt: user.created_at,
    lastLogin: user.last_login,
    languagePreference: user.language_preference || 'en',
    paymentType: user.payment_type || 'none',
    essentialAssessmentId: user.essential_assessment_id || null,
    emailHackAlerts: user.email_hack_alerts !== false,
    emailDailyTips: user.email_daily_tips !== false,
    emailWalletReviews: user.email_wallet_reviews !== false,
    assessmentsTaken: user.assessments_taken ?? 0,           // snake_case → camelCase
    assessments_count: user.assessments_taken ?? 0,          // también enviamos snake_case por si acaso
    lastAssessmentDate: user.last_assessment_date || null,
  };
};

// ============================================
// SUBSCRIPTION OPERATIONS
// ============================================

// Upgrade subscription
// Plans: 'essential' (one-time $7.99), 'sentinel' ($14.99/mo), 'consultation' ($99 + $49/hr)
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
      else if (newLevel === 'consultation') {
        updates.payment_type = 'subscription';
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        updates.subscription_end = endDate.toISOString();
        
        // Activar alertas premium + incrementar conteo de consultas
        updates.email_hack_alerts = true;
        updates.email_daily_tips = true;
        updates.email_wallet_reviews = true;
        updates.consultation_count = db.raw('consultation_count + 1');
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
    } else if (newLevel === 'sentinel' || newLevel === 'consultation') {
      user.payment_type = 'subscription';
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      user.subscriptionEnd = endDate.toISOString();
      
      // Alertas ON
      user.email_hack_alerts = true;
      user.email_daily_tips = true;
      user.email_wallet_reviews = true;
      
      if (newLevel === 'consultation') {
        user.consultationCount = (user.consultationCount || 0) + 1;
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
  hasPremiumAccess,
  canTakeAssessment,
  saveAssessment,
  getUserAssessments,
  getCommunityStats,
  compareToAverage,
  generatePdfPassword,
  sanitizeUser
};
