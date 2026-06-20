/**
 * Utility Functions
 * Common helper functions for the invitation system
 */

class UtilityFunctions {
  /**
   * Format currency value
   */
  static formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  /**
   * Generate unique ID
   */
  static generateUniqueId(prefix = 'inv') {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 9);
    return `${prefix}-${timestamp}-${randomStr}`;
  }

  /**
   * Validate email
   */
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  static validateDate(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  /**
   * Validate time format (HH:MM)
   */
  static validateTime(timeString) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  }

  /**
   * Calculate days until event
   */
  static daysUntilEvent(eventDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);
    
    const timeDiff = event - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if event is upcoming (within 30 days)
   */
  static isUpcoming(eventDate) {
    const daysRemaining = this.daysUntilEvent(eventDate);
    return daysRemaining > 0 && daysRemaining <= 30;
  }

  /**
   * Check if event is today
   */
  static isToday(eventDate) {
    const today = new Date();
    const event = new Date(eventDate);
    return today.toDateString() === event.toDateString();
  }

  /**
   * Check if event has passed
   */
  static hasPassed(eventDate) {
    return this.daysUntilEvent(eventDate) < 0;
  }

  /**
   * Get event status
   */
  static getEventStatus(eventDate) {
    const daysRemaining = this.daysUntilEvent(eventDate);
    
    if (daysRemaining < 0) return 'passed';
    if (daysRemaining === 0) return 'today';
    if (daysRemaining <= 7) return 'week';
    if (daysRemaining <= 30) return 'month';
    return 'future';
  }

  /**
   * Format countdown text
   */
  static getCountdownText(eventDate, language = 'en') {
    const days = this.daysUntilEvent(eventDate);
    
    if (days < 0) {
      return language === 'ta' ? 'நடந்துவிட்டது' : 'Event has passed';
    }
    
    if (days === 0) {
      return language === 'ta' ? 'இன்று' : 'Today!';
    }
    
    if (days === 1) {
      return language === 'ta' ? 'நாளை' : 'Tomorrow';
    }
    
    if (days <= 7) {
      return language === 'ta' 
        ? `${days} நாட்கள்`
        : `${days} days`;
    }
    
    const weeks = Math.floor(days / 7);
    return language === 'ta'
      ? `${weeks} வாரங்கள்`
      : `${weeks} weeks`;
  }

  /**
   * Copy text to clipboard
   */
  static copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then(() => {
      return true;
    }).catch(() => {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    });
  }

  /**
   * Share via URL
   */
  static getShareUrl(platform = 'whatsapp', text = '', url = '') {
    const currentUrl = url || window.location.href;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(currentUrl);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
    };
    
    return shareUrls[platform] || shareUrls.whatsapp;
  }

  /**
   * Deep clone object
   */
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Merge objects
   */
  static mergeObjects(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null) {
          result[key] = this.mergeObjects(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    return result;
  }

  /**
   * Escape HTML special characters
   */
  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Debounce function
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle function
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Get browser info
   */
  static getBrowserInfo() {
    const ua = navigator.userAgent;
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
      isChrome: /Chrome/.test(ua),
      isFirefox: /Firefox/.test(ua),
      isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
      isEdge: /Edge/.test(ua),
      isIE: /Trident/.test(ua),
    };
  }

  /**
   * Check if element is in viewport
   */
  static isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Lazy load image
   */
  static lazyLoadImage(imgElement) {
    const loadImage = () => {
      imgElement.src = imgElement.dataset.src;
      imgElement.onload = () => imgElement.classList.add('loaded');
      imgElement.classList.add('loading');
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadImage();
            observer.unobserve(entry.target);
          }
        });
      });
      observer.observe(imgElement);
    } else {
      loadImage();
    }
  }

  /**
   * Smooth scroll to element
   */
  static smoothScroll(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Get URL parameters
   */
  static getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (let [key, value] of params) {
      result[key] = value;
    }
    return result;
  }

  /**
   * Store to localStorage
   */
  static setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('localStorage error:', e);
      return false;
    }
  }

  /**
   * Get from localStorage
   */
  static getLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('localStorage error:', e);
      return defaultValue;
    }
  }

  /**
   * Remove from localStorage
   */
  static removeLocalStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('localStorage error:', e);
      return false;
    }
  }

  /**
   * Create element with attributes
   */
  static createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      if (key === 'class') {
        element.className = value;
      } else if (key === 'style') {
        Object.assign(element.style, value);
      } else {
        element.setAttribute(key, value);
      }
    }
    if (content) {
      element.innerHTML = content;
    }
    return element;
  }

  /**
   * Add event listener with cleanup
   */
  static addEventListener(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    
    // Return cleanup function
    return () => {
      element.removeEventListener(event, handler, options);
    };
  }

  /**
   * Animate element
   */
  static animate(element, keyframes, options = {}) {
    return element.animate(keyframes, {
      duration: 300,
      easing: 'ease-in-out',
      ...options
    });
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UtilityFunctions;
}
