// KYWARD DATABASE SERVICE - API CLIENT (Frontend)
// Connects to backend API for all database operations

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class KywardDatabase {
  constructor() {
    this.TOKEN_KEY = 'kyward_session_token';
    this.USER_CACHE_KEY = 'kyward_user_cache';
  }

  // Token management
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token) {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  // User cache
  getCachedUser() {
    const cached = localStorage.getItem(this.USER_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  }

  setCachedUser(user) {
    if (user) {
      localStorage.setItem(this.USER_CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.USER_CACHE_KEY);
    }
  }

  // API request helper with error handling
  async apiRequest(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return { success: true, ...data };
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, message: error.message || 'Network error. Please check your connection.' };
    }
  }

  // ============================================
  // AUTHENTICATION
  // ============================================

  async createUser(userData) {
    const result = await this.apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    if (result.success && result.token) {
      this.setToken(result.token);
      const normalizedUser = this.normalizeUser(result.user);
      this.setCachedUser(normalizedUser);
      result.user = normalizedUser;
    }

    return result;
  }

  async login(email, password) {
    const result = await this.apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.success && result.token) {
      this.setToken(result.token);
      const normalizedUser = this.normalizeUser(result.user);
      this.setCachedUser(normalizedUser);
      result.user = normalizedUser;
    }

    return result;
  }

  async validateSession() {
    const token = this.getToken();
    if (!token) return null;

    const result = await this.apiRequest('/auth/validate');
    if (result.success && result.user) {
      const normalizedUser = this.normalizeUser(result.user);
      this.setCachedUser(normalizedUser);
      return normalizedUser;
    }

    this.setToken(null);
    this.setCachedUser(null);
    return null;
  }

  async logout() {
    await this.apiRequest('/auth/logout', { method: 'POST' });
    this.setToken(null);
    this.setCachedUser(null);
  }

  // ============================================
  // USER & SUBSCRIPTION
  // ============================================

  // Normalize user object to ensure consistent field names across the app
  normalizeUser(user) {
    if (!user) return null;

    // Calcula assessments_taken: Prioriza valor explícito, fallback a length del array, luego 0
    const assessmentsCount = user.assessments_taken ?? user.assessmentsTaken ?? user.assessments?.length ?? 0;

    // Mapea subscription: Si es 'none'/undefined/null, fallback a 'free'
    let subLevel = user.subscriptionLevel || user.subscription || user.paymentType;
    if (['none', undefined, null].includes(subLevel)) {
      subLevel = 'free';
    }

    // Map API camelCase to expected field names and ensure both formats exist
    const normalized = {
      ...user,
      // Assessment count - support both formats and compute from array if needed
      assessments_taken: assessmentsCount,
      assessmentsTaken: assessmentsCount,
      // Subscription level - normalized to avoid 'none'
      subscriptionLevel: subLevel,
      subscription: subLevel,
      // Last assessment date - support both formats (agrega lógica si el último assessment está en el array)
      lastAssessmentDate: user.lastAssessmentDate || user.last_assessment_date || (user.assessments?.[0]?.created_at ?? null),
      last_assessment_date: user.last_assessment_date || user.lastAssessmentDate || (user.assessments?.[0]?.created_at ?? null),
      // PDF password
      pdfPassword: user.pdfPassword || user.pdf_password || null,
      // Essential assessment ID
      essentialAssessmentId: user.essentialAssessmentId || user.essential_assessment_id || null,
      essential_assessment_id: user.essential_assessment_id || user.essentialAssessmentId || null,
      // Consultation count
      consultationCount: user.consultationCount ?? user.consultation_count ?? 0,
      consultation_count: user.consultation_count ?? user.consultationCount ?? 0,
      // Created at
      createdAt: user.createdAt || user.created_at || null,
      created_at: user.created_at || user.createdAt || null,
    };

    console.log('User normalized:', {
      assessments_taken: normalized.assessments_taken,
      subscriptionLevel: normalized.subscriptionLevel,
      assessmentsLength: user.assessments?.length // Para debug
    });

    return normalized;
  }

  // Normalize assessment object (from backend)
  normalizeAssessment(assessment) {
    if (!assessment) return null;
    return {
      ...assessment,
      // Timestamp field - backend uses created_at, frontend uses timestamp
      timestamp: assessment.timestamp || assessment.created_at || assessment.createdAt || null,
      created_at: assessment.created_at || assessment.timestamp || assessment.createdAt || null,
      createdAt: assessment.createdAt || assessment.created_at || assessment.timestamp || null,
      // User ID
      userId: assessment.userId || assessment.user_id || null,
      user_id: assessment.user_id || assessment.userId || null,
    };
  }

  async getUser(forceRefresh = false) {
    // Siempre limpia cache si se fuerza refresh
    if (forceRefresh) {
      this.setCachedUser(null);
      localStorage.removeItem(this.USER_CACHE_KEY); // Limpieza total
      sessionStorage.removeItem(this.USER_CACHE_KEY); // Also clear session storage
    }

    // Intenta cache solo si NO es forceRefresh
    if (!forceRefresh) {
      const cached = this.getCachedUser();
      if (cached) {
        console.log('Usuario desde cache:', cached);
        return this.normalizeUser(cached);
      }
    }

    // Fetch real from API
    const result = await this.apiRequest('/user');
    if (result.success && result.user) {
      const normalizedUser = this.normalizeUser(result.user);

  // Validación extra: Si assessments.length > assessments_taken, ajusta (por si backend bug)
        if (result.user.assessments?.length > normalizedUser.assessments_taken) {
          normalizedUser.assessments_taken = result.user.assessments.length;
          normalizedUser.assessmentsTaken = result.user.assessments.length;
          console.warn('Ajustado assessments_taken basado en array length');
        }

        this.setCachedUser(normalizedUser);
        console.log('Usuario fresco obtenido y cacheado:', normalizedUser);
        return normalizedUser;
      }

      console.error('Error obteniendo usuario fresco:', result.message);
      return null;
    }

  // Get current subscription level
  async getSubscriptionLevel() {
    const user = await this.getUser();
    return user?.subscriptionLevel || user?.subscription || 'free';
  }

  // Check if user has premium access (Essential, Sentinel, Consultation)
  async hasPremiumAccess() {
    const level = await this.getSubscriptionLevel();
    return ['essential', 'sentinel', 'consultation'].includes(level);
  }

  // Check if user can take a new assessment
  async canTakeNewAssessment() {
    const result = await this.apiRequest('/user/usage');
    if (result.success) {
      return result.canTake;
    }
    // Fallback: solo 1 por mes si no premium
    const level = await this.getSubscriptionLevel();
    return !['essential'].includes(level); // Essential: false si ya usó
  }

  // Upgrade to new tier
  async upgradeSubscription(plan) {
    const result = await this.apiRequest('/user/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });

    if (result.success && result.user) {
      const normalizedUser = this.normalizeUser(result.user);
      this.setCachedUser(normalizedUser);
      result.user = normalizedUser;
    }

    return result;
  }

  // ============================================
  // ASSESSMENT
  // ============================================

  async saveAssessment(assessment) {
  const token = this.getToken();
    if (!token) {
      return { success: false, message: 'No authentication token' };
    }

    return this.apiRequest('/assessments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(assessment),
    });
  }

  async getUserAssessments() {
    const result = await this.apiRequest('/assessments');
    if (result.success && result.assessments) {
      // Normalize each assessment to ensure consistent field names
      return result.assessments.map(a => this.normalizeAssessment(a));
    }
    return [];
  }

  // ============================================
  // STATISTICS
  // ============================================

  async compareToAverage(userScore) {
    const result = await this.apiRequest(`/stats/compare/${userScore}`);
    if (result.success) {
      return result;
    }

    // Fallback robusto
    const average = 50;
    const difference = userScore - average;
    let percentile = 50;
    if (userScore >= 80) percentile = 85 + (userScore - 80) * 0.75;
    else if (userScore >= 50) percentile = 35 + ((userScore - 50) / 30) * 50;
    else percentile = (userScore / 50) * 35;

    percentile = Math.min(99, Math.max(1, Math.round(percentile)));

    return {
      userScore,
      averageScore: average,
      difference,
      percentile,
      isAboveAverage: difference > 0,
      isBelowAverage: difference < 0,
      comparison: difference > 10 ? 'well above' : difference > 0 ? 'above' : difference === 0 ? 'at' : difference > -10 ? 'below' : 'well below',
      distribution: { excellent: 33, moderate: 34, needsWork: 33 }
    };
  }

  // ============================================
  // COMPATIBILITY / LEGACY
  // ============================================

  generatePdfPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

export const kywardDB = new KywardDatabase();