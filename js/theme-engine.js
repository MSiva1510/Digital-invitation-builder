/**
 * Theme Engine Module - Phase 2
 * Manages dynamic theme colors, fonts, and styling
 */

class ThemeEngine {
  constructor(dataLoader) {
    this.dataLoader = dataLoader;
    this.currentTheme = null;
    this.defaultTheme = null;
    this.cssVariables = {};
  }

  /**
   * Initialize theme engine
   */
  async initialize() {
    await this.loadTheme();
    this.applyTheme();
  }

  /**
   * Load theme from theme.json
   */
  async loadTheme() {
    try {
      const response = await fetch('data/theme.json');
      this.currentTheme = await response.json();
      this.defaultTheme = JSON.parse(JSON.stringify(this.currentTheme));
    } catch (error) {
      console.error('Error loading theme:', error);
      this.currentTheme = this.getDefaultTheme();
    }
  }

  /**
   * Apply theme to document
   */
  applyTheme() {
    if (!this.currentTheme) return;

    const root = document.documentElement;

    // Apply colors
    root.style.setProperty('--primary-color', this.currentTheme.primary);
    root.style.setProperty('--secondary-color', this.currentTheme.secondary);
    root.style.setProperty('--accent-color', this.currentTheme.accent);
    root.style.setProperty('--text-color', this.currentTheme.text);
    root.style.setProperty('--text-light', this.currentTheme.textLight);
    root.style.setProperty('--background-color', this.currentTheme.background);
    root.style.setProperty('--surface-color', this.currentTheme.surface);
    root.style.setProperty('--border-color', this.currentTheme.border);
    root.style.setProperty('--success-color', this.currentTheme.success);
    root.style.setProperty('--warning-color', this.currentTheme.warning);
    root.style.setProperty('--error-color', this.currentTheme.error);

    // Apply fonts
    if (this.currentTheme.fonts) {
      root.style.setProperty('--font-heading', `'${this.currentTheme.fonts.heading}', sans-serif`);
      root.style.setProperty('--font-body', `'${this.currentTheme.fonts.body}', sans-serif`);
      root.style.setProperty('--font-accent', `'${this.currentTheme.fonts.accent}', cursive`);
    }

    // Apply hero background
    if (this.currentTheme.hero && this.currentTheme.hero.background) {
      const hero = document.querySelector('.hero-section');
      if (hero) {
        hero.style.background = this.currentTheme.hero.background;
        if (this.currentTheme.hero.opacity) {
          hero.style.opacity = this.currentTheme.hero.opacity;
        }
      }
    }

    // Apply button style
    if (this.currentTheme.buttons) {
      document.body.setAttribute('data-button-style', this.currentTheme.buttons.style);
      document.body.setAttribute('data-button-size', this.currentTheme.buttons.size);
    }

    this.loadGoogleFonts();
  }

  /**
   * Update color
   */
  updateColor(colorName, colorValue) {
    if (this.currentTheme.hasOwnProperty(colorName)) {
      this.currentTheme[colorName] = colorValue;
      document.documentElement.style.setProperty(`--${this.camelToKebab(colorName)}-color`, colorValue);
      this.saveTheme();
      return true;
    }
    return false;
  }

  /**
   * Update multiple colors
   */
  updateColors(colorMap) {
    Object.entries(colorMap).forEach(([key, value]) => {
      this.updateColor(key, value);
    });
  }

  /**
   * Update font
   */
  updateFont(fontCategory, fontName) {
    if (!this.currentTheme.fonts) {
      this.currentTheme.fonts = {};
    }

    this.currentTheme.fonts[fontCategory] = fontName;
    document.documentElement.style.setProperty(`--font-${fontCategory}`, `'${fontName}', sans-serif`);
    this.saveTheme();
    this.loadGoogleFonts();
    return true;
  }

  /**
   * Update multiple fonts
   */
  updateFonts(fontMap) {
    Object.entries(fontMap).forEach(([key, value]) => {
      this.updateFont(key, value);
    });
  }

  /**
   * Load Google Fonts
   */
  loadGoogleFonts() {
    const fonts = [
      ...Object.values(this.currentTheme.fonts || {})
    ].filter((f, i, a) => a.indexOf(f) === i);

    if (fonts.length === 0) return;

    const fontQuery = fonts.map(f => f.replace(/\s+/g, '+')).join('|');
    const link = document.querySelector('link[href*="fonts.googleapis.com"]') || document.createElement('link');

    link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
    link.rel = 'stylesheet';

    if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
      document.head.appendChild(link);
    }
  }

  /**
   * Apply template preset
   */
  async applyTemplate(templateId) {
    try {
      const response = await fetch(`templates/${templateId}-preset.json`);
      const template = await response.json();

      if (template.theme) {
        this.currentTheme = {
          ...this.currentTheme,
          ...template.theme
        };
      }

      if (template.fonts) {
        this.currentTheme.fonts = template.fonts;
      }

      this.applyTheme();
      this.saveTheme();
      return true;
    } catch (error) {
      console.error('Error loading template:', error);
      return false;
    }
  }

  /**
   * Reset to default theme
   */
  resetTheme() {
    this.currentTheme = JSON.parse(JSON.stringify(this.defaultTheme));
    this.applyTheme();
    this.saveTheme();
  }

  /**
   * Save theme to localStorage
   */
  saveTheme() {
    localStorage.setItem('theme', JSON.stringify(this.currentTheme));
  }

  /**
   * Get current theme
   */
  getTheme() {
    return JSON.parse(JSON.stringify(this.currentTheme));
  }

  /**
   * Export theme as JSON
   */
  exportTheme() {
    return JSON.stringify(this.currentTheme, null, 2);
  }

  /**
   * Import theme from JSON
   */
  importTheme(jsonString) {
    try {
      const theme = JSON.parse(jsonString);
      this.currentTheme = theme;
      this.applyTheme();
      this.saveTheme();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get color contrast
   */
  getContrastColor(hexColor) {
    const rgb = parseInt(hexColor.replace('#', ''), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  /**
   * Generate color palette from primary
   */
  generatePalette(primaryColor) {
    return {
      primary: primaryColor,
      light: this.lightenColor(primaryColor, 20),
      dark: this.darkenColor(primaryColor, 20),
      contrast: this.getContrastColor(primaryColor)
    };
  }

  /**
   * Lighten color
   */
  lightenColor(color, percent) {
    const rgb = parseInt(color.replace('#', ''), 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >> 8) & 0xff;
    let b = (rgb >> 0) & 0xff;

    r = Math.min(255, Math.round(r + 255 * (percent / 100)));
    g = Math.min(255, Math.round(g + 255 * (percent / 100)));
    b = Math.min(255, Math.round(b + 255 * (percent / 100)));

    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Darken color
   */
  darkenColor(color, percent) {
    const rgb = parseInt(color.replace('#', ''), 16);
    let r = (rgb >> 16) & 0xff;
    let g = (rgb >> 8) & 0xff;
    let b = (rgb >> 0) & 0xff;

    r = Math.max(0, Math.round(r - 255 * (percent / 100)));
    g = Math.max(0, Math.round(g - 255 * (percent / 100)));
    b = Math.max(0, Math.round(b - 255 * (percent / 100)));

    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Convert camelCase to kebab-case
   */
  camelToKebab(str) {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  }

  /**
   * Get default theme
   */
  getDefaultTheme() {
    return {
      primary: '#D4AF37',
      secondary: '#FFFFFF',
      accent: '#8B4513',
      text: '#333333',
      textLight: '#FFFFFF',
      background: '#F5F5F5',
      surface: '#FFFFFF',
      border: '#DDDDDD',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      fonts: {
        heading: 'Poppins',
        body: 'Lato',
        accent: 'Great Vibes'
      }
    };
  }

  /**
   * Create CSS for theme
   */
  generateCSS() {
    let css = ':root {\n';

    for (const [key, value] of Object.entries(this.currentTheme)) {
      if (key !== 'fonts' && key !== 'hero' && key !== 'buttons') {
        css += `  --${this.camelToKebab(key)}-color: ${value};\n`;
      }
    }

    if (this.currentTheme.fonts) {
      css += `  --font-heading: '${this.currentTheme.fonts.heading}';\n`;
      css += `  --font-body: '${this.currentTheme.fonts.body}';\n`;
      css += `  --font-accent: '${this.currentTheme.fonts.accent}';\n`;
    }

    css += '}\n';
    return css;
  }
}

// Create global instance
const themeEngine = new ThemeEngine(dataLoader);
