/**
 * Layout Manager Module - Phase 3
 * Manages page layout and sections
 */

class LayoutManager {
  constructor() {
    this.layout = {
      sections: [],
      settings: {}
    };
    this.defaultLayout = ['hero', 'countdown', 'events', 'gallery', 'rsvp', 'footer'];
  }

  /**
   * Initialize layout manager
   */
  async initialize() {
    this.loadLayout();
  }

  /**
   * Get sections
   */
  getSections() {
    return this.layout.sections;
  }

  /**
   * Add section
   */
  addSection(sectionType) {
    const section = {
      id: this.generateId(),
      type: sectionType,
      visible: true,
      settings: this.getDefaultSettings(sectionType)
    };
    this.layout.sections.push(section);
    this.saveLayout();
    return section;
  }

  /**
   * Delete section
   */
  deleteSection(index) {
    if (index >= 0 && index < this.layout.sections.length) {
      this.layout.sections.splice(index, 1);
      this.saveLayout();
      return true;
    }
    return false;
  }

  /**
   * Reorder sections
   */
  reorderSection(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.layout.sections.length) return false;
    if (toIndex < 0 || toIndex >= this.layout.sections.length) return false;

    const item = this.layout.sections.splice(fromIndex, 1)[0];
    this.layout.sections.splice(toIndex, 0, item);
    this.saveLayout();
    return true;
  }

  /**
   * Toggle section visibility
   */
  toggleSection(index) {
    if (index >= 0 && index < this.layout.sections.length) {
      this.layout.sections[index].visible = !this.layout.sections[index].visible;
      this.saveLayout();
      return true;
    }
    return false;
  }

  /**
   * Duplicate section
   */
  duplicateSection(index) {
    if (index >= 0 && index < this.layout.sections.length) {
      const section = JSON.parse(JSON.stringify(this.layout.sections[index]));
      section.id = this.generateId();
      this.layout.sections.splice(index + 1, 0, section);
      this.saveLayout();
      return section;
    }
    return null;
  }

  /**
   * Update section settings
   */
  updateSectionSettings(index, settings) {
    if (index >= 0 && index < this.layout.sections.length) {
      this.layout.sections[index].settings = {
        ...this.layout.sections[index].settings,
        ...settings
      };
      this.saveLayout();
      return true;
    }
    return false;
  }

  /**
   * Get default settings for section type
   */
  getDefaultSettings(sectionType) {
    const defaults = {
      hero: { title: 'true', subtitle: 'true', image: 'true' },
      countdown: { show_label: 'true', show_progress: 'false' },
      events: { columns: '2', show_description: 'true' },
      gallery: { columns: '3', enable_lightbox: 'true' },
      music: { autoplay: 'false', show_playlist: 'true' },
      rsvp: { show_message: 'true', required_fields: 'name,phone' },
      map: { show_directions: 'true', zoom: '15' },
      contact: { show_social: 'true' },
      footer: { show_credits: 'true' }
    };
    return defaults[sectionType] || {};
  }

  /**
   * Save layout
   */
  saveLayout() {
    localStorage.setItem('layout', JSON.stringify(this.layout));
  }

  /**
   * Load layout
   */
  loadLayout() {
    const saved = localStorage.getItem('layout');
    if (saved) {
      try {
        this.layout = JSON.parse(saved);
      } catch (e) {
        this.resetLayout();
      }
    } else {
      this.resetLayout();
    }
  }

  /**
   * Reset to default layout
   */
  resetLayout() {
    this.layout.sections = this.defaultLayout.map(type => ({
      id: this.generateId(),
      type: type,
      visible: true,
      settings: this.getDefaultSettings(type)
    }));
    this.saveLayout();
  }

  /**
   * Export layout as JSON
   */
  exportLayout() {
    return JSON.stringify(this.layout, null, 2);
  }

  /**
   * Import layout from JSON
   */
  importLayout(jsonString) {
    try {
      const layout = JSON.parse(jsonString);
      this.layout = layout;
      this.saveLayout();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Get layout statistics
   */
  getStats() {
    return {
      totalSections: this.layout.sections.length,
      visibleSections: this.layout.sections.filter(s => s.visible).length,
      hiddenSections: this.layout.sections.filter(s => !s.visible).length,
      sectionTypes: [...new Set(this.layout.sections.map(s => s.type))]
    };
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return 'section-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get visible sections
   */
  getVisibleSections() {
    return this.layout.sections.filter(s => s.visible);
  }

  /**
   * Clear all sections
   */
  clearAll() {
    this.layout.sections = [];
    this.saveLayout();
  }

  /**
   * Validate layout
   */
  validateLayout() {
    const errors = [];
    const visibleSections = this.getVisibleSections();

    if (visibleSections.length === 0) {
      errors.push('At least one section must be visible');
    }

    if (!visibleSections.find(s => s.type === 'hero')) {
      errors.push('Hero section is recommended');
    }

    if (!visibleSections.find(s => s.type === 'rsvp')) {
      errors.push('RSVP section is recommended');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
}

// Create global instance
const layoutManager = new LayoutManager();
