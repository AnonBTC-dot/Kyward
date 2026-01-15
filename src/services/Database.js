// KYWARD DATABASE SERVICE - API CLIENT (Frontend)
// Connects to backend API for all database operations

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Luego en apiRequest:
const fullUrl = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

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
      this.setCachedUser(result.user);
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
      this.setCachedUser(result.user);
    }

    return result;
  }

  async validateSession() {
    const token = this.getToken();
    if (!token) return null;

    const result = await this.apiRequest('/auth/validate');
    if (result.success && result.user) {
      this.setCachedUser(result.user);
      return result.user;
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

  async getUser() {
    const cached = this.getCachedUser();
    if (cached) return cached;

    const result = await this.apiRequest('/user');
    if (result.success && result.user) {
      this.setCachedUser(result.user);
      return result.user;
    }
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
      this.setCachedUser(result.user);
    }

    return result;
  }

  // ============================================
  // ASSESSMENT
  // ============================================

  async saveAssessment(assessmentData) {
    return this.apiRequest('/assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  }

  async getUserAssessments() {
    const result = await this.apiRequest('/assessments');
    return result.success ? result.assessments : [];
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