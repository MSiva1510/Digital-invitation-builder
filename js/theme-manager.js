/**
 * Theme Manager Module
 * Handles dynamic theme application and color management
 */

class ThemeManager {
  constructor(dataLoader) {
    this.dataLoader = dataLoader;
    this.currentTheme = null;
    this.isDarkMode = this.loadDarkModePreference();
  }

  /**
   * Load dark mode preference from localStorage
   */
  loadDarkModePreference() {
    const stored = localStorage.getItem('invitationDarkMode');
    if (stored !== null) {
      return stored === 'true';
    }
    // Default to dark mode
    return true;
  }

  /**
   * Toggle dark/light mode
   */
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('invitationDarkMode', this.isDarkMode.toString());
    this.applyTheme();
    return this.isDarkMode;
  }

  /**
   * Apply theme to document
   */
  async applyTheme() {
    const theme = await this.dataLoader.getThemeConfig();
    if (!theme) {
      console.warn('No theme configuration found');
      return;
    }

    this.currentTheme = theme;
    
    // Apply CSS variables
    const root = document.documentElement;
    const colors = theme.colors || {};

    // Set color variables
    root.style.setProperty('--primary-color', colors.primary || '#C8A96E');
    root.style.setProperty('--secondary-color', colors.secondary || '#D4849A');
    root.style.setProperty('--background-color', this.isDarkMode ? colors.background : '#fdf6e3');
    root.style.setProperty('--surface-color', this.isDarkMode ? colors.surface : '#fffaf2');
    root.style.setProperty('--text-color', this.isDarkMode ? colors.text : '#222');

    // Set font variables
    const fonts = theme.fonts || {};
    root.style.setProperty('--font-heading', fonts.heading || "'Playfair Display', serif");
    root.style.setProperty('--font-body', fonts.body || "'Cormorant Garamond', serif");
    root.style.setProperty('--font-accent', fonts.accent || "'Great Vibes', cursive");

    // Apply dark/light mode class
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    document.body.classList.toggle('light-mode', !this.isDarkMode);

    // Apply background image if provided
    if (theme.backgroundImage) {
      document.body.style.backgroundImage = `url(${theme.backgroundImage})`;
    }
  }

  /**
   * Update theme colors
   */
  updateColors(colorConfig) {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(colorConfig)) {
      root.style.setProperty(`--${key}-color`, value);
    }
    this.currentTheme.colors = { ...this.currentTheme.colors, ...colorConfig };
  }

  /**
   * Update theme fonts
   */
  updateFonts(fontConfig) {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(fontConfig)) {
      root.style.setProperty(`--font-${key}`, value);
    }
    this.currentTheme.fonts = { ...this.currentTheme.fonts, ...fontConfig };
  }

  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Initialize theme on page load
   */
  async initialize() {
    await this.applyTheme();
  }

  /**
   * Create theme toggle button
   */
  createThemeToggleButton() {
    const button = document.createElement('button');
    button.id = 'theme-toggle-btn';
    button.className = 'theme-toggle-button';
    button.innerHTML = this.isDarkMode ? '☀️' : '🌙';
    button.title = this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
    button.addEventListener('click', () => {
      this.toggleDarkMode();
      button.innerHTML = this.isDarkMode ? '☀️' : '🌙';
      button.title = this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
    });
    return button;
  }

  /**
   * Get contrast color for text
   */
  getContrastColor(hexColor) {
    // Convert hex to RGB
    const rgb = parseInt(hexColor.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}

// Create global instance
const themeManager = new ThemeManager(dataLoader);
