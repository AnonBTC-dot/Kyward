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
          payment_type: 'none', // New default
          essential_assessment_id: null // New default
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

      return sanitizeUser(session.users);
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

// Get user by email
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
      return sanitizeUser(data);
    } catch (error) {
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
    // New fields for Essential/Sentinel tiers
    paymentType: user.payment_type || 'none',
    essentialAssessmentId: user.essential_assessment_id || null,
    emailHackAlerts: user.email_hack_alerts !== false,
    emailDailyTips: user.email_daily_tips !== false,
    emailWalletReviews: user.email_wallet_reviews !== false
  };
};

// ============================================
// SUBSCRIPTION OPERATIONS
// ============================================

// Upgrade subscription
// Plans: 'essential' (one-time $7.99), 'sentinel' ($14.99/mo), 'consultation' ($99 + $49/hr)
const upgradeSubscription = async (email, newLevel) => {
  const db = initSupabase();

  if (db) {
    try {
      let updates = {
        subscription_level: newLevel,
        subscription_start: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Set payment_type and subscription_end based on tier
      if (newLevel === 'essential') {
        updates.payment_type = 'one_time';
        updates.subscription_end = null; // One-time, no end
      } else if (newLevel === 'sentinel') {
        updates.payment_type = 'subscription';
        // Set end to 1 month from now (handle recurring in payment webhook if using Stripe)
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        updates.subscription_end = endDate.toISOString();
      } else if (newLevel === 'consultation') {
        updates.payment_type = 'subscription'; // Treat as sub for unlimited + audit
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        updates.subscription_end = endDate.toISOString();
        updates.consultation_count = (updates.consultation_count || 0) + 1; // Increment for audit
      }

      const { data, error } = await db
        .from('users')
        .update(updates)
        .eq('email', email)
        .select('*')
        .single();

      if (error) throw error;

      return { success: true, user: data };
    } catch (error) {
      console.error('Upgrade subscription error:', error);
      return { success: false, message: 'Failed to upgrade subscription.' };
    }
  } else {
    // Memory fallback
    const user = memoryDB.users[email];
    if (!user) return { success: false, message: 'User not found' };

    user.subscriptionLevel = newLevel;
    user.updatedAt = new Date().toISOString();
    user.subscriptionStart = new Date().toISOString();

    if (newLevel === 'essential') {
      user.payment_type = 'one_time';
      user.subscriptionEnd = null;
    } else if (newLevel === 'sentinel' || newLevel === 'consultation') {
      user.payment_type = 'subscription';
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      user.subscriptionEnd = endDate.toISOString();
      if (newLevel === 'consultation') user.consultationCount = (user.consultationCount || 0) + 1;
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
  const user = await getUserByEmail(email);
  if (!user) return { canTake: false, remaining: 0 };

  const isPremium = await hasPremiumAccess(email);
  if (isPremium) {
    return { canTake: true, remaining: Infinity, isPremium: true };
  }

  // Free users: 1 per month (simplified for now)
  return { canTake: true, remaining: 1, isPremium: false };
};

// Save assessment (update to set essential_assessment_id if Essential)
const saveAssessment = async (email, score, responses) => {
  const db = initSupabase();

  if (db) {
    try {
      const { data: user } = await db.from('users').select('id, subscription_level, essential_assessment_id').eq('email', email).single();

      const { data: assessment, error } = await db
        .from('assessments')
        .insert([{ user_id: user.id, score, responses }])
        .select('id')
        .single();

      if (error) throw error;

      // If Essential and no prior ID, set it
      if (user.subscription_level === 'essential' && !user.essential_assessment_id) {
        await db.from('users').update({ essential_assessment_id: assessment.id }).eq('email', email);
      }

      // Update community stats (unchanged)

      return { success: true, assessmentId: assessment.id };
    } catch (error) {
      console.error('Save assessment error:', error);
      return { success: false, message: 'Failed to save assessment.' };
    }
  } else {
    // Memory fallback (add essential_assessment_id logic)
    const user = memoryDB.users[email];
    if (!user) return { success: false, message: 'User not found' };

    const assessmentId = crypto.randomUUID();
    memoryDB.assessments[assessmentId] = { userId: user.id, score, responses, createdAt: new Date().toISOString() };

    if (user.subscriptionLevel === 'essential' && !user.essential_assessment_id) {
      user.essential_assessment_id = assessmentId;
    }

    memoryDB.community_stats.total_assessments++;
    memoryDB.community_stats.average_score = Math.round((memoryDB.community_stats.average_score * (memoryDB.community_stats.total_assessments - 1) + score) / memoryDB.community_stats.total_assessments);

    const range = score < 21 ? '0-20' : score < 41 ? '21-40' : score < 61 ? '41-60' : score < 81 ? '61-80' : '81-100';
    memoryDB.community_stats.score_distribution[range] = (memoryDB.community_stats.score_distribution[range] || 0) + 1;

    return { success: true, assessmentId };
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
  canTakeNewAssessment, // New export
  canTakeAssessment,
  saveAssessment,
  getUserAssessments,
  getCommunityStats,
  compareToAverage,
  generatePdfPassword
};
