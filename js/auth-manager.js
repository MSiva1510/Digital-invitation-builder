/**
 * Authentication Manager Module - Phase 3
 * Handles admin authentication and session management
 */

class AuthManager {
  constructor() {
    this.sessionKey = 'admin_session';
    this.passwordKey = 'admin_password';
    this.defaultPassword = 'change-me';
    this.sessionDuration = 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Initialize auth manager
   */
  initialize() {
    this.ensurePasswordExists();
    this.checkSession();
  }

  /**
   * Ensure password exists
   */
  ensurePasswordExists() {
    if (!localStorage.getItem(this.passwordKey)) {
      this.setPassword(this.defaultPassword);
    }
  }

  /**
   * Login
   */
  login(password) {
    const storedPassword = localStorage.getItem(this.passwordKey);

    if (password === storedPassword) {
      const sessionToken = this.generateToken();
      const sessionData = {
        token: sessionToken,
        loginTime: Date.now(),
        lastActivity: Date.now()
      };

      sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
      localStorage.setItem('lastLogin', new Date().toISOString());

      return { success: true, token: sessionToken };
    }

    return { success: false, error: 'Invalid password' };
  }

  /**
   * Logout
   */
  logout() {
    sessionStorage.removeItem(this.sessionKey);
    localStorage.removeItem('admin_session');
  }

  /**
   * Check if authenticated
   */
  isAuthenticated() {
    const session = sessionStorage.getItem(this.sessionKey);

    if (!session) {
      return false;
    }

    try {
      const data = JSON.parse(session);
      const age = Date.now() - data.loginTime;

      if (age > this.sessionDuration) {
        this.logout();
        return false;
      }

      // Update last activity
      data.lastActivity = Date.now();
      sessionStorage.setItem(this.sessionKey, JSON.stringify(data));

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get session info
   */
  getSession() {
    const session = sessionStorage.getItem(this.sessionKey);

    if (!session) {
      return null;
    }

    try {
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  }

  /**
   * Change password
   */
  changePassword(newPassword) {
    if (newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    this.setPassword(newPassword);
    return { success: true, message: 'Password changed successfully' };
  }

  /**
   * Set password
   */
  setPassword(password) {
    localStorage.setItem(this.passwordKey, password);
  }

  /**
   * Get password (for verification only)
   */
  getPassword() {
    return localStorage.getItem(this.passwordKey) || this.defaultPassword;
  }

  /**
   * Reset password to default
   */
  resetPassword() {
    this.setPassword(this.defaultPassword);
    this.logout();
  }

  /**
   * Set remember me
   */
  setRememberMe(days) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    localStorage.setItem('rememberMeExpiry', expiry.toISOString());
    localStorage.setItem('rememberMe', 'true');
  }

  /**
   * Check remember me
   */
  isRemembered() {
    const expiry = localStorage.getItem('rememberMeExpiry');

    if (!expiry) {
      return false;
    }

    const expiryDate = new Date(expiry);
    const now = new Date();

    if (now > expiryDate) {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberMeExpiry');
      return false;
    }

    return true;
  }

  /**
   * Clear remember me
   */
  clearRememberMe() {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberMeExpiry');
  }

  /**
   * Get login history
   */
  getLoginHistory() {
    const history = JSON.parse(localStorage.getItem('loginHistory') || '[]');
    return history.slice(-10); // Last 10 logins
  }

  /**
   * Add login history
   */
  addLoginHistory() {
    const history = JSON.parse(localStorage.getItem('loginHistory') || '[]');
    history.push({
      timestamp: new Date().toISOString(),
      ip: 'N/A', // Would need server for real IP
      userAgent: navigator.userAgent
    });

    if (history.length > 50) {
      history.shift(); // Keep only last 50
    }

    localStorage.setItem('loginHistory', JSON.stringify(history));
  }

  /**
   * Check session validity
   */
  checkSession() {
    if (!this.isAuthenticated()) {
      // On admin pages, redirect to login
      if (window.location.pathname.includes('/admin/')) {
        if (!window.location.pathname.includes('login.html')) {
          // Only redirect if not already on login page
          if (window.location.pathname.includes('index.html') ||
              window.location.pathname.includes('events.html') ||
              window.location.pathname.includes('gallery.html') ||
              window.location.pathname.includes('music.html') ||
              window.location.pathname.includes('theme.html') ||
              window.location.pathname.includes('templates.html') ||
              window.location.pathname.includes('media.html') ||
              window.location.pathname.includes('builder.html') ||
              window.location.pathname.includes('rsvp.html') ||
              window.location.pathname.includes('publish.html')) {
            // Commented out to avoid redirect loops during development
            // window.location.href = 'login.html';
          }
        }
      }
    }
  }

  /**
   * Generate authentication token
   */
  generateToken() {
    return 'token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get session duration remaining
   */
  getSessionTimeRemaining() {
    const session = this.getSession();

    if (!session) {
      return 0;
    }

    const age = Date.now() - session.loginTime;
    const remaining = this.sessionDuration - age;

    return Math.max(0, remaining);
  }

  /**
   * Extend session
   */
  extendSession() {
    const session = this.getSession();

    if (session) {
      session.loginTime = Date.now();
      sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    }
  }

  /**
   * Get all admin settings
   */
  getSettings() {
    return {
      sessionDuration: this.sessionDuration,
      passwordRequired: true,
      sessionActive: this.isAuthenticated(),
      lastLogin: localStorage.getItem('lastLogin'),
      rememberMeEnabled: this.isRemembered()
    };
  }
}

// Create global instance
const authManager = new AuthManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  authManager.initialize();
});
