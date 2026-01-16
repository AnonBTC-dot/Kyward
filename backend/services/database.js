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
  return crypto.createHash('sha256').update(password + (process.env.PASSWORD_SALT || 'kyward_secure_salt_2024')).digest('hex');
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

const createUser = async (email, password) => {
  const db = initSupabase();
  const passwordHash = hashPassword(password);
  const pdfPassword = generatePdfPassword();

  if (db) {
    try {
      const { data: existing } = await db.from('users').select('id').eq('email', email).single();
      if (existing) return { success: false, message: 'An account with this email already exists.' };

      const { data, error } = await db
        .from('users')
        .insert([{
          email,
          password_hash: passwordHash,
          subscription_level: 'free',
          pdf_password: pdfPassword,
          payment_type: 'none',
          essential_assessment_id: null
        }])
        .select().single();

      if (error) throw error;
      return { success: true, user: sanitizeUser(data) };
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, message: 'Failed to create account.' };
    }
  } else {
    if (memoryDB.users[email]) return { success: false, message: 'An account with this email already exists.' };
    const user = {
      id: crypto.randomUUID(),
      email,
      password_hash: passwordHash,
      subscription_level: 'free',
      pdf_password: pdfPassword,
      payment_type: 'none',
      essential_assessment_id: null,
      created_at: new Date().toISOString()
    };
    memoryDB.users[email] = user;
    return { success: true, user: sanitizeUser(user) };
  }
};

const loginUser = async (email, password) => {
  const db = initSupabase();
  const passwordHash = hashPassword(password);

  if (db) {
    try {
      const { data: user, error } = await db.from('users').select('*').eq('email', email).single();
      if (error || !user) return { success: false, message: 'User not found. Please sign up first.' };
      if (user.password_hash !== passwordHash) return { success: false, message: 'Incorrect password.' };

      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await db.from('session_tokens').insert([{ user_id: user.id, token, expires_at: expiresAt.toISOString() }]);
      await db.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);

      return { success: true, user: sanitizeUser(user), token };
    } catch (error) {
      return { success: false, message: 'Login failed.' };
    }
  } else {
    const user = memoryDB.users[email];
    if (!user || user.password_hash !== passwordHash) return { success: false, message: 'Invalid credentials.' };
    const token = generateSessionToken();
    memoryDB.sessions[token] = { email, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() };
    return { success: true, user: sanitizeUser(user), token };
  }
};

const validateSession = async (token) => {
  const db = initSupabase();
  if (db) {
    try {
      const { data: session, error } = await db.from('session_tokens').select('*, users(*)').eq('token', token).single();
      if (error || !session || new Date(session.expires_at) < new Date()) return null;
      return sanitizeUser(session.users);
    } catch (error) { return null; }
  } else {
    const session = memoryDB.sessions[token];
    if (!session || new Date(session.expiresAt) < new Date()) return null;
    return sanitizeUser(memoryDB.users[session.email]);
  }
};

const logout = async (token) => {
  const db = initSupabase();
  if (db) await db.from('session_tokens').delete().eq('token', token);
  else delete memoryDB.sessions[token];
};

const getUserByEmail = async (email) => {
  const db = initSupabase();
  if (db) {
    const { data } = await db.from('users').select('*').eq('email', email).single();
    return data ? sanitizeUser(data) : null;
  }
  return memoryDB.users[email] ? sanitizeUser(memoryDB.users[email]) : null;
};

const userExists = async (email) => !!(await getUserByEmail(email));

const resetPassword = async (email, newPassword) => {
  const db = initSupabase();
  const passwordHash = hashPassword(newPassword);
  if (db) {
    const { error } = await db.from('users').update({ password_hash: passwordHash }).eq('email', email);
    return { success: !error };
  }
  if (memoryDB.users[email]) {
    memoryDB.users[email].password_hash = passwordHash;
    return { success: true };
  }
  return { success: false };
};

const sanitizeUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    subscriptionLevel: user.subscription_level,
    pdfPassword: user.pdf_password,
    paymentType: user.payment_type,
    essentialAssessmentId: user.essential_assessment_id,
    createdAt: user.created_at,
    subscriptionEnd: user.subscription_end
  };
};

// ============================================
// ASSESSMENT OPERATIONS (CORREGIDA)
// ============================================

const saveAssessment = async (email, score, responses) => {
  const db = initSupabase();

  if (db) {
    try {
      // 1. Obtener el UUID del usuario mediante su email
      const { data: user, error: userError } = await db
        .from('users')
        .select('id, subscription_level, essential_assessment_id')
        .eq('email', email)
        .single();

      if (userError || !user) throw new Error('User not found');

      // 2. Insertar evaluación usando el UUID
      const { data: assessment, error: insertError } = await db
        .from('assessments')
        .insert([{ 
          user_id: user.id, 
          score: parseInt(score), 
          responses: responses 
        }])
        .select('id')
        .single();

      if (insertError) throw insertError;

      // 3. Si es Essential y es su primera vez, vincular el ID
      if (user.subscription_level === 'essential' && !user.essential_assessment_id) {
        await db.from('users').update({ essential_assessment_id: assessment.id }).eq('id', user.id);
      }

      return { success: true, assessmentId: assessment.id };
    } catch (error) {
      console.error('Save assessment error:', error);
      return { success: false, message: 'Failed to save assessment.' };
    }
  } else {
    // Fallback memoria
    const user = memoryDB.users[email];
    if (!user) return { success: false, message: 'User not found' };
    const assessmentId = crypto.randomUUID();
    memoryDB.assessments[assessmentId] = { userId: user.id, score, responses, createdAt: new Date().toISOString() };
    if (user.subscription_level === 'essential' && !user.essential_assessment_id) user.essential_assessment_id = assessmentId;
    return { success: true, assessmentId };
  }
};

const canTakeNewAssessment = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) return false;
  if (user.subscriptionLevel === 'free') return true;
  if (user.subscriptionLevel === 'essential') return !user.essentialAssessmentId;
  if (['sentinel', 'consultation'].includes(user.subscriptionLevel)) {
    return new Date(user.subscriptionEnd) > new Date();
  }
  return false;
};

const upgradeSubscription = async (email, newLevel) => {
  const db = initSupabase();
  let updates = {
    subscription_level: newLevel,
    subscription_start: new Date().toISOString(),
    payment_type: newLevel === 'essential' ? 'one_time' : 'subscription'
  };

  if (newLevel !== 'essential') {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    updates.subscription_end = endDate.toISOString();
  }

  if (db) {
    const { data, error } = await db.from('users').update(updates).eq('email', email).select().single();
    if (error) return { success: false };
    return { success: true, user: data };
  } else {
    if (!memoryDB.users[email]) return { success: false };
    Object.assign(memoryDB.users[email], updates);
    return { success: true, user: memoryDB.users[email] };
  }
};

// ... (El resto de funciones de estadísticas se mantienen igual)
const getCommunityStats = async () => {
  const db = initSupabase();
  if (db) {
    const { data } = await db.from('community_stats').select('*').single();
    if (data) return { totalAssessments: data.total_assessments, averageScore: data.average_score, distribution: data.score_distribution };
  }
  return memoryDB.community_stats;
};

const compareToAverage = async (userScore) => {
  const stats = await getCommunityStats();
  const difference = userScore - stats.averageScore;
  return { userScore, averageScore: stats.averageScore, difference, isAboveAverage: difference > 0 };
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
  canTakeNewAssessment,
  saveAssessment,
  getCommunityStats,
  compareToAverage,
  generatePdfPassword
};