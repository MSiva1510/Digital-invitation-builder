/**
 * Data Loader Module
 * Fetches and manages JSON configuration and invitation data
 */

class DataLoader {
  constructor(basePath = './') {
    this.basePath = basePath;
    this.config = null;
    this.invitation = null;
    this.templates = {};
    this.cache = new Map();
  }

  /**
   * Load configuration from config.json
   */
  async loadConfig() {
    if (this.config) return this.config;

    try {
      const response = await fetch(this.basePath + 'data/config.json');
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`);
      }
      this.config = await response.json();
      this.cache.set('config', this.config);
      return this.config;
    } catch (error) {
      console.error('Error loading config:', error);
      return null;
    }
  }

  /**
   * Load invitation data from invitation.json
   */
  async loadInvitation(filename = 'invitation.json') {
    if (this.invitation) return this.invitation;

    try {
      const response = await fetch(this.basePath + 'data/' + filename);
      if (!response.ok) {
        throw new Error(`Failed to load invitation: ${response.statusText}`);
      }
      this.invitation = await response.json();
      this.cache.set('invitation', this.invitation);
      return this.invitation;
    } catch (error) {
      console.error('Error loading invitation:', error);
      return null;
    }
  }

  /**
   * Load template by event type
   */
  async loadTemplate(eventType) {
    if (this.templates[eventType]) {
      return this.templates[eventType];
    }

    try {
      const response = await fetch(this.basePath + `templates/${eventType}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`);
      }
      const template = await response.json();
      this.templates[eventType] = template;
      return template;
    } catch (error) {
      console.error(`Error loading template for ${eventType}:`, error);
      return null;
    }
  }

  /**
   * Load all templates
   */
  async loadAllTemplates() {
    const config = await this.loadConfig();
    if (!config) return false;

    for (const eventType of config.eventTypes.map(et => et.id)) {
      await this.loadTemplate(eventType);
    }
    return true;
  }

  /**
   * Get cached data
   */
  getCached(key) {
    return this.cache.get(key);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    this.config = null;
    this.invitation = null;
    this.templates = {};
  }

  /**
   * Get event by ID from invitation data
   */
  async getEvent(eventId) {
    const invitation = await this.loadInvitation();
    if (!invitation) return null;

    if (eventId === 'main' || eventId === 'mainEvent') {
      return invitation.mainEvent;
    }

    if (invitation.events && Array.isArray(invitation.events)) {
      return invitation.events.find(e => e.id === eventId);
    }

    return null;
  }

  /**
   * Get all events from invitation
   */
  async getAllEvents() {
    const invitation = await this.loadInvitation();
    if (!invitation) return [];

    const events = [];
    if (invitation.mainEvent) {
      events.push({ ...invitation.mainEvent, id: 'main' });
    }
    if (invitation.events && Array.isArray(invitation.events)) {
      events.push(...invitation.events);
    }
    return events;
  }

  /**
   * Get gallery images
   */
  async getGalleryImages() {
    const invitation = await this.loadInvitation();
    if (!invitation || !invitation.gallery) return [];
    return invitation.gallery.images || [];
  }

  /**
   * Get music configuration
   */
  async getMusicConfig() {
    const invitation = await this.loadInvitation();
    if (!invitation || !invitation.music) return null;
    return invitation.music;
  }

  /**
   * Get theme configuration
   */
  async getThemeConfig() {
    const invitation = await this.loadInvitation();
    if (!invitation || !invitation.theme) {
      // Return default theme
      const config = await this.loadConfig();
      return config ? config.theme : null;
    }
    return invitation.theme;
  }

  /**
   * Load JSON file with error handling
   */
  async loadJSON(path) {
    try {
      const response = await fetch(this.basePath + path);
      if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading JSON from ${path}:`, error);
      return null;
    }
  }
}

// Create global instance
const dataLoader = new DataLoader('./');
