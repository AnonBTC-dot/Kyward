// STEP 2: DATABASE LAYER & AUTH UTILS

class KywardDatabase {
  constructor() {
    this.DB_PREFIX = 'kyward_db_';
    this.USERS_KEY = this.DB_PREFIX + 'users';
    this.ASSESSMENTS_KEY = this.DB_PREFIX + 'assessments';
    this.SESSIONS_KEY = this.DB_PREFIX + 'sessions';
    this.initializeDatabase();
  }

  initializeDatabase() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.ASSESSMENTS_KEY)) {
      localStorage.setItem(this.ASSESSMENTS_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.SESSIONS_KEY)) {
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify({}));
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '{}');
  }

  getSessions() {
    return JSON.parse(localStorage.getItem(this.SESSIONS_KEY) || '{}');
  }

  createUser(userData) {
    try {
      const users = this.getUsers();
      if (users[userData.email]) {
        return { success: false, message: 'An account with this email already exists.' };
      }
      // Hash the password before storing
      const passwordHash = hashPassword(userData.password);
      const newUser = {
        email: userData.email,
        passwordHash: passwordHash,
        subscriptionLevel: 'free',
        assessments: [],
        createdAt: new Date().toISOString(),
        assessmentCount: 0,
        monthlyAssessmentCount: 0,
        lastResetDate: new Date().toISOString(),
      };
      users[userData.email] = newUser;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return { success: true, user: this.sanitizeUser(newUser) };
    } catch (error) {
      return { success: false, message: 'Failed to create account. Please try again.' };
    }
  }

  getUser(email) {
    const users = this.getUsers();
    const user = users[email];
    return user ? this.sanitizeUser(user) : null;
  }

  getUserWithPassword(email) {
    const users = this.getUsers();
    return users[email] || null;
  }

  sanitizeUser(user) {
    if (!user) return null;
    const sanitized = { ...user };
    delete sanitized.passwordHash;
    return sanitized;
  }

  createSession(email) {
    const sessionToken = btoa(email + Date.now() + Math.random());
    const sessions = this.getSessions();
    sessions[sessionToken] = {
      email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    return sessionToken;
  }

  validateSession(sessionToken) {
    const sessions = this.getSessions();
    const session = sessions[sessionToken];
    if (!session) return null;
    const expiresAt = new Date(session.expiresAt);
    if (expiresAt < new Date()) {
      delete sessions[sessionToken];
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
      return null;
    }
    return session.email;
  }

  deleteSession(sessionToken) {
    const sessions = this.getSessions();
    delete sessions[sessionToken];
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
  }

  login(email, password) {
    try {
      const user = this.getUserWithPassword(email);
      if (!user) {
        return { success: false, message: 'User not found. Please sign up first.' };
      }
      const hashedPassword = hashPassword(password);
      if (user.passwordHash !== hashedPassword) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
      const token = this.createSession(email);
      return { success: true, user: this.sanitizeUser(user), token };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  // Check if user exists (for password reset)
  userExists(email) {
    const users = this.getUsers();
    return !!users[email];
  }

  // Reset password
  resetPassword(email, newPassword) {
    try {
      const users = this.getUsers();
      if (!users[email]) {
        return { success: false, message: 'User not found.' };
      }
      users[email].passwordHash = hashPassword(newPassword);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return { success: true, message: 'Password reset successfully.' };
    } catch (error) {
      return { success: false, message: 'Failed to reset password.' };
    }
  }

  // Get user usage status (for Dashboard)
  getUserUsageStatus(email) {
    return this.canTakeAssessment(email);
  }

  canTakeAssessment(email) {
    const user = this.getUser(email);
    if (!user) return { canTake: false, remaining: 0 };
    if (user.subscriptionLevel === 'premium') {
      return { canTake: true, remaining: Infinity, isPremium: true };
    }
    const count = user.monthlyAssessmentCount || 0;
    return { 
      canTake: count < 1, 
      remaining: Math.max(0, 1 - count),
      isPremium: false 
    };
  }

  // MÉTODO NUEVO: Necesario para que el Questionnaire guarde datos
  saveAssessment(email, assessmentData) {
    const users = this.getUsers();
    if (users[email]) {
      users[email].assessmentCount += 1;
      users[email].monthlyAssessmentCount += 1;
      users[email].lastAssessmentDate = new Date().toISOString();
      if (!users[email].assessments) users[email].assessments = [];
      users[email].assessments.push(assessmentData);
      
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return true;
    }
    return false;
  }
}

// EXPORTACIONES PARA EL RESTO DE LA APP
export const kywardDB = new KywardDatabase();

export const hashPassword = (password) => {
  return btoa(password + 'kyward_salt_2024_secure');
};