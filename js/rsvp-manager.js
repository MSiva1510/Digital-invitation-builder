/**
 * RSVP Manager Module - Phase 3
 * Manages guest responses and RSVP tracking
 */

class RSVPManager {
  constructor() {
    this.rsvps = [];
  }

  /**
   * Initialize RSVP manager
   */
  async initialize() {
    this.loadRSVPs();
  }

  /**
   * Add new RSVP
   */
  addRSVP(rsvpData) {
    const rsvp = {
      id: this.generateId(),
      name: rsvpData.name,
      phone: rsvpData.phone,
      guests: parseInt(rsvpData.guests) || 1,
      message: rsvpData.message || '',
      attending: rsvpData.attending !== false,
      timestamp: new Date().toISOString(),
      notes: ''
    };

    this.rsvps.push(rsvp);
    this.saveRSVPs();
    return rsvp;
  }

  /**
   * Get all RSVPs
   */
  getAllRSVPs() {
    return this.rsvps;
  }

  /**
   * Get RSVP by index
   */
  getRSVP(index) {
    return this.rsvps[index];
  }

  /**
   * Delete RSVP
   */
  deleteRSVP(index) {
    if (index >= 0 && index < this.rsvps.length) {
      this.rsvps.splice(index, 1);
      this.saveRSVPs();
      return true;
    }
    return false;
  }

  /**
   * Update RSVP
   */
  updateRSVP(index, data) {
    if (index >= 0 && index < this.rsvps.length) {
      this.rsvps[index] = {
        ...this.rsvps[index],
        ...data
      };
      this.saveRSVPs();
      return true;
    }
    return false;
  }

  /**
   * Get RSVP statistics
   */
  getStats() {
    const attending = this.rsvps.filter(r => r.attending).length;
    const notAttending = this.rsvps.filter(r => !r.attending).length;
    const totalGuests = this.rsvps.reduce((sum, r) => sum + r.guests, 0);

    return {
      total: this.rsvps.length,
      attending: attending,
      notAttending: notAttending,
      totalGuests: totalGuests,
      attendingPercentage: this.rsvps.length > 0 ? ((attending / this.rsvps.length) * 100).toFixed(1) : 0
    };
  }

  /**
   * Search RSVPs
   */
  searchRSVPs(term) {
    const term_lower = term.toLowerCase();
    return this.rsvps.filter(r =>
      r.name.toLowerCase().includes(term_lower) ||
      r.phone.includes(term) ||
      r.message.toLowerCase().includes(term_lower)
    );
  }

  /**
   * Get RSVPs by status
   */
  getRSVPsByStatus(attending) {
    return this.rsvps.filter(r => r.attending === attending);
  }

  /**
   * Export as CSV
   */
  exportCSV() {
    const headers = ['Name', 'Phone', 'Guests', 'Attending', 'Message', 'Date'];
    const rows = this.rsvps.map(r => [
      r.name,
      r.phone,
      r.guests,
      r.attending ? 'Yes' : 'No',
      r.message,
      new Date(r.timestamp).toLocaleDateString()
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    return csv;
  }

  /**
   * Export as JSON
   */
  exportJSON() {
    return JSON.stringify(this.rsvps, null, 2);
  }

  /**
   * Clear all RSVPs
   */
  clearAll() {
    this.rsvps = [];
    this.saveRSVPs();
  }

  /**
   * Save RSVPs to localStorage
   */
  saveRSVPs() {
    localStorage.setItem('rsvp_responses', JSON.stringify(this.rsvps));
  }

  /**
   * Load RSVPs from localStorage
   */
  loadRSVPs() {
    const saved = localStorage.getItem('rsvp_responses');
    if (saved) {
      try {
        this.rsvps = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading RSVPs:', e);
      }
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return 'rsvp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get guest list by date range
   */
  getGuestsByDateRange(startDate, endDate) {
    return this.rsvps.filter(r => {
      const rDate = new Date(r.timestamp);
      return rDate >= startDate && rDate <= endDate;
    });
  }

  /**
   * Validate RSVP data
   */
  validateRSVP(data) {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!data.phone || data.phone.trim() === '') {
      errors.push('Phone number is required');
    }

    if (!data.guests || parseInt(data.guests) < 1) {
      errors.push('Number of guests must be at least 1');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
}

// Create global instance
const rsvpManager = new RSVPManager();
