/**
 * Event Manager Module - Phase 2
 * Handles event creation, editing, deletion, and reordering
 */

class EventManager {
  constructor(dataLoader, languageManager) {
    this.dataLoader = dataLoader;
    this.languageManager = languageManager;
    this.events = [];
    this.mainEvent = null;
  }

  /**
   * Initialize event manager
   */
  async initialize() {
    const invitation = await this.dataLoader.loadInvitation();
    if (invitation) {
      this.mainEvent = invitation.mainEvent;
      this.events = invitation.events || [];
    }
  }

  /**
   * Add new event
   */
  addEvent(eventData) {
    const event = {
      id: this.generateEventId(),
      ...eventData,
      createdAt: new Date().toISOString()
    };
    this.events.push(event);
    this.saveEvents();
    return event;
  }

  /**
   * Edit existing event
   */
  editEvent(eventId, eventData) {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      this.events[index] = {
        ...this.events[index],
        ...eventData,
        updatedAt: new Date().toISOString()
      };
      this.saveEvents();
      return this.events[index];
    }
    return null;
  }

  /**
   * Delete event
   */
  deleteEvent(eventId) {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
      const deleted = this.events.splice(index, 1);
      this.saveEvents();
      return deleted[0];
    }
    return null;
  }

  /**
   * Reorder events
   */
  reorderEvents(eventIds) {
    const ordered = [];
    eventIds.forEach(id => {
      const event = this.events.find(e => e.id === id);
      if (event) ordered.push(event);
    });
    this.events = ordered;
    this.saveEvents();
    return this.events;
  }

  /**
   * Move event up
   */
  moveEventUp(eventId) {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index > 0) {
      [this.events[index - 1], this.events[index]] = [this.events[index], this.events[index - 1]];
      this.saveEvents();
      return true;
    }
    return false;
  }

  /**
   * Move event down
   */
  moveEventDown(eventId) {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index < this.events.length - 1) {
      [this.events[index], this.events[index + 1]] = [this.events[index + 1], this.events[index]];
      this.saveEvents();
      return true;
    }
    return false;
  }

  /**
   * Get event by ID
   */
  getEvent(eventId) {
    return this.events.find(e => e.id === eventId);
  }

  /**
   * Get all events
   */
  getAllEvents() {
    return [...this.events];
  }

  /**
   * Duplicate event
   */
  duplicateEvent(eventId) {
    const event = this.getEvent(eventId);
    if (event) {
      const duplicate = {
        ...JSON.parse(JSON.stringify(event)),
        id: this.generateEventId(),
        createdAt: new Date().toISOString()
      };
      this.events.push(duplicate);
      this.saveEvents();
      return duplicate;
    }
    return null;
  }

  /**
   * Save events to localStorage (Phase 2)
   */
  saveEvents() {
    const data = {
      events: this.events,
      mainEvent: this.mainEvent,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('invitation_events', JSON.stringify(data));
    return true;
  }

  /**
   * Generate unique event ID
   */
  generateEventId() {
    return 'event-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Validate event data
   */
  validateEvent(eventData) {
    const required = ['title', 'date', 'time', 'venue'];
    const errors = [];

    for (const field of required) {
      if (!eventData[field]) {
        errors.push(`${field} is required`);
      }
    }

    // Validate date format
    if (eventData.date && !this.isValidDate(eventData.date)) {
      errors.push('Invalid date format (use YYYY-MM-DD)');
    }

    // Validate time format
    if (eventData.time && !this.isValidTime(eventData.time)) {
      errors.push('Invalid time format (use HH:MM)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if date is valid (YYYY-MM-DD)
   */
  isValidDate(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  /**
   * Check if time is valid (HH:MM)
   */
  isValidTime(timeString) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  }

  /**
   * Export events as JSON
   */
  exportEvents() {
    return JSON.stringify({
      events: this.events,
      mainEvent: this.mainEvent,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  /**
   * Import events from JSON
   */
  importEvents(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.events = data.events || [];
      if (data.mainEvent) this.mainEvent = data.mainEvent;
      this.saveEvents();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get upcoming events
   */
  getUpcomingEvents(days = 30) {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= futureDate;
    });
  }

  /**
   * Search events
   */
  searchEvents(keyword) {
    const term = keyword.toLowerCase();
    return this.events.filter(event => {
      const title = this.languageManager.getText(event.title).toLowerCase();
      const venue = this.languageManager.getText(event.venue).toLowerCase();
      const description = this.languageManager.getText(event.description || '').toLowerCase();

      return title.includes(term) || venue.includes(term) || description.includes(term);
    });
  }

  /**
   * Get events by date range
   */
  getEventsByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= start && eventDate <= end;
    });
  }

  /**
   * Get event statistics
   */
  getStatistics() {
    return {
      totalEvents: this.events.length,
      upcomingEvents: this.getUpcomingEvents().length,
      eventTypes: this.getEventTypesCount(),
      oldestEvent: this.getOldestEvent(),
      newestEvent: this.getNewestEvent()
    };
  }

  /**
   * Get event types count
   */
  getEventTypesCount() {
    const types = {};
    this.events.forEach(event => {
      const type = event.eventType || 'custom';
      types[type] = (types[type] || 0) + 1;
    });
    return types;
  }

  /**
   * Get oldest event
   */
  getOldestEvent() {
    if (this.events.length === 0) return null;
    return this.events.reduce((oldest, event) => {
      return new Date(event.date) < new Date(oldest.date) ? event : oldest;
    });
  }

  /**
   * Get newest event
   */
  getNewestEvent() {
    if (this.events.length === 0) return null;
    return this.events.reduce((newest, event) => {
      return new Date(event.date) > new Date(newest.date) ? event : newest;
    });
  }
}

// Create global instance
const eventManager = new EventManager(dataLoader, languageManager);
