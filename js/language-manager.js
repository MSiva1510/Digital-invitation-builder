/**
 * Language Utility Module
 * Handles multilingual content rendering and switching
 */

class LanguageManager {
  constructor(defaultLanguage = 'en', supportedLanguages = ['en', 'ta']) {
    this.currentLanguage = this.loadLanguage() || defaultLanguage;
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;
  }

  /**
   * Load language from localStorage or browser preference
   */
  loadLanguage() {
    const stored = localStorage.getItem('invitationLanguage');
    if (stored && this.supportedLanguages.includes(stored)) {
      return stored;
    }
    return null;
  }

  /**
   * Set current language and persist to localStorage
   */
  setLanguage(lang) {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLanguage = lang;
      localStorage.setItem('invitationLanguage', lang);
      document.documentElement.lang = lang;
      return true;
    }
    return false;
  }

  /**
   * Get content in current language
   * Handles fallback to default language if not available
   */
  getText(content) {
    if (typeof content === 'string') {
      return content;
    }

    if (typeof content === 'object' && content !== null) {
      // If content has language keys
      if (content[this.currentLanguage]) {
        return content[this.currentLanguage];
      }
      // Fallback to default language
      if (content[this.defaultLanguage]) {
        return content[this.defaultLanguage];
      }
      // Return first available language
      const firstKey = Object.keys(content)[0];
      return content[firstKey] || '';
    }

    return '';
  }

  /**
   * Get language name
   */
  getLanguageName(lang) {
    const names = {
      'en': 'English',
      'ta': 'தமிழ்'
    };
    return names[lang] || lang;
  }

  /**
   * Format date based on language preference
   */
  formatDate(dateString, lang = null) {
    const language = lang || this.currentLanguage;
    const date = new Date(dateString);

    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return new Intl.DateTimeFormat(language === 'ta' ? 'ta-IN' : 'en-US', options).format(date);
  }

  /**
   * Format time
   */
  formatTime(timeString, meridiem = '') {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    let hour = parseInt(hours);
    let period = meridiem;

    if (!period) {
      period = hour >= 12 ? 'PM' : 'AM';
      if (hour > 12) hour -= 12;
      if (hour === 0) hour = 12;
    }

    return `${hour}:${minutes} ${period}`;
  }

  /**
   * Get all content in a specific language
   */
  getFullContent(content, lang) {
    if (typeof content === 'object' && content !== null) {
      if (typeof content === 'object' && !Array.isArray(content)) {
        const result = {};
        for (const key in content) {
          result[key] = this.getFullContent(content[key], lang);
        }
        return result;
      }
    }
    return content;
  }
}

// Create global instance
const languageManager = new LanguageManager('en', ['en', 'ta']);
