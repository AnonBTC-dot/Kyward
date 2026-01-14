// KYWARD DATABASE SERVICE - API CLIENT
// Connects to backend API for all database operations

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class KywardDatabase {
  constructor() {
    this.TOKEN_KEY = 'kyward_session_token';
    this.USER_CACHE_KEY = 'kyward_user_cache';
  }

  // Get stored session token
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Store session token
  setToken(token) {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  // Get cached user data
  getCachedUser() {
    const cached = localStorage.getItem(this.USER_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  }

  // Cache user data
  setCachedUser(user) {
    if (user) {
      localStorage.setItem(this.USER_CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.USER_CACHE_KEY);
    }
  }

  // API request helper
  async apiRequest(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || 'Request failed' };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  }

  // ============================================
  // AUTHENTICATION OPERATIONS
  // ============================================

  // Create new user (signup)
  async createUser(userData) {
    const result = await this.apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password
      })
    });

    if (result.success && result.token) {
      this.setToken(result.token);
      this.setCachedUser(result.user);
    }

    return result;
  }

  // Login user
  async login(email, password) {
    const result = await this.apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (result.success && result.token) {
      this.setToken(result.token);
      this.setCachedUser(result.user);
    }

    return result;
  }

  // Validate current session
  async validateSession(token = null) {
    const sessionToken = token || this.getToken();
    if (!sessionToken) return null;

    const result = await this.apiRequest('/auth/validate', {
      headers: { 'Authorization': `Bearer ${sessionToken}` }
    });

    if (result.success && result.user) {
      this.setCachedUser(result.user);
      return result.user.email;
    }

    // Session invalid, clear token
    this.setToken(null);
    this.setCachedUser(null);
    return null;
  }

  // Logout user
  async logout() {
    await this.apiRequest('/auth/logout', { method: 'POST' });
    this.setToken(null);
    this.setCachedUser(null);
  }

  // Delete session (alias for logout)
  deleteSession(token) {
    this.logout();
  }

  // Check if user exists
  async userExists(email) {
    const result = await this.apiRequest(`/auth/check?email=${encodeURIComponent(email)}`);
    return result.exists || false;
  }

  // Reset password
  async resetPassword(email, newPassword) {
    return await this.apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword })
    });
  }

  // ============================================
  // USER OPERATIONS
  // ============================================

  // Get user data
  async getUser(email) {
    // First check cache
    const cached = this.getCachedUser();
    if (cached && cached.email === email) {
      return cached;
    }

    const result = await this.apiRequest('/user');
    if (result.success && result.user) {
      this.setCachedUser(result.user);
      return result.user;
    }
    return null;
  }

  // Sanitize user (for compatibility)
  sanitizeUser(user) {
    return user;
  }

  // Get user usage status
  async getUserUsageStatus(email) {
    return this.canTakeAssessment(email);
  }

  // Check if user can take assessment
  async canTakeAssessment(email) {
    const result = await this.apiRequest('/user/usage');
    if (result.success) {
      return {
        canTake: result.canTake,
        remaining: result.remaining,
        isPremium: result.isPremium
      };
    }
    return { canTake: false, remaining: 0, isPremium: false };
  }

  // Check if user has premium access
  async hasPremiumAccess(email) {
    const result = await this.apiRequest('/user/premium');
    return result.success && result.hasPremium;
  }

  // Check if user has consultation access
  async hasConsultationAccess(email) {
    const user = await this.getUser(email);
    return user && user.subscriptionLevel === 'consultation';
  }

  // Get user's PDF password
  async getPdfPassword(email) {
    const user = await this.getUser(email);
    return user?.pdfPassword || null;
  }

  // ============================================
  // SUBSCRIPTION OPERATIONS
  // ============================================

  // Upgrade user subscription
  async upgradeSubscription(email, level) {
    const result = await this.apiRequest('/user/upgrade', {
      method: 'POST',
      body: JSON.stringify({ plan: level })
    });

    if (result.success && result.user) {
      this.setCachedUser(result.user);
    }

    return result;
  }

  // ============================================
  // ASSESSMENT OPERATIONS
  // ============================================

  // Save assessment
  async saveAssessment(email, assessmentData) {
    const result = await this.apiRequest('/assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData)
    });
    return result.success;
  }

  // Get user assessments
  async getUserAssessments(email) {
    const result = await this.apiRequest('/assessments');
    return result.success ? result.assessments : [];
  }

  // ============================================
  // STATISTICS OPERATIONS
  // ============================================

  // Get global/community statistics
  async getGlobalStats() {
    const result = await this.apiRequest('/stats/community');
    if (result.success) {
      return {
        totalAssessments: result.totalAssessments,
        averageScore: result.averageScore,
        distribution: result.distribution,
        distributionPercent: result.distribution
      };
    }
    // Return defaults if API fails
    return {
      totalAssessments: 0,
      averageScore: 50,
      distribution: { excellent: 33, moderate: 34, needsWork: 33 },
      distributionPercent: { excellent: 33, moderate: 34, needsWork: 33 }
    };
  }

  // Compare user score to community average
  async compareToAverage(userScore) {
    const result = await this.apiRequest(`/stats/compare/${userScore}`);
    if (result.success) {
      return result;
    }
    // Return calculated defaults if API fails
    const averageScore = 50;
    const difference = userScore - averageScore;
    let percentile;
    if (userScore >= 80) {
      percentile = 85 + (userScore - 80) * 0.75;
    } else if (userScore >= 50) {
      percentile = 35 + ((userScore - 50) / 30) * 50;
    } else {
      percentile = (userScore / 50) * 35;
    }
    percentile = Math.min(99, Math.max(1, Math.round(percentile)));

    return {
      userScore,
      averageScore,
      difference,
      percentile,
      isAboveAverage: difference > 0,
      isBelowAverage: difference < 0,
      comparison: difference > 10 ? 'well above' :
                  difference > 0 ? 'above' :
                  difference === 0 ? 'at' :
                  difference > -10 ? 'below' : 'well below',
      distribution: { excellent: 33, moderate: 34, needsWork: 33 }
    };
  }

  // ============================================
  // SYNCHRONOUS COMPATIBILITY METHODS
  // These provide backward compatibility for components
  // that haven't been updated to use async/await yet
  // ============================================

  // Sync version - uses cached data
  getUsers() {
    return {};
  }

  getSessions() {
    return {};
  }

  getUserWithPassword(email) {
    return this.getCachedUser();
  }

  createSession(email) {
    return this.getToken();
  }

  // Generate PDF password (fallback, mainly handled by backend)
  generatePdfPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

// Password hashing (for compatibility, actual hashing done on backend)
export const hashPassword = (password) => {
  return btoa(password + 'kyward_salt_2024_secure');
};

export const kywardDB = new KywardDatabase();
