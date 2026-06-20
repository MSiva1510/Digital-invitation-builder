/**
 * Rendering Engine Module
 * Dynamically generates invitation HTML from JSON data
 */

class RenderingEngine {
  constructor(languageManager, dataLoader) {
    this.languageManager = languageManager;
    this.dataLoader = dataLoader;
  }

  /**
   * Render the complete invitation
   */
  async render(containerId = 'app') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return false;
    }

    try {
      const invitation = await this.dataLoader.loadInvitation();
      if (!invitation) {
        container.innerHTML = '<p>Error loading invitation data</p>';
        return false;
      }

      const html = await this.renderInvitation(invitation);
      container.innerHTML = html;
      return true;
    } catch (error) {
      console.error('Error rendering invitation:', error);
      container.innerHTML = '<p>Error rendering invitation</p>';
      return false;
    }
  }

  /**
   * Main invitation renderer
   */
  async renderInvitation(invitation) {
    const t = this.languageManager;
    let html = '';

    // Header with names
    html += this.renderHeader(invitation);

    // Main event section
    if (invitation.mainEvent) {
      html += this.renderEventSection(invitation.mainEvent, true);
    }

    // Additional events
    if (invitation.events && Array.isArray(invitation.events)) {
      html += '<div class="events-section">';
      for (const event of invitation.events) {
        html += this.renderEventSection(event, false);
      }
      html += '</div>';
    }

    // Gallery section
    if (invitation.gallery && invitation.gallery.enabled && invitation.gallery.images) {
      html += this.renderGallery(invitation.gallery);
    }

    // RSVP section
    html += this.renderRSVP();

    return html;
  }

  /**
   * Render header with couple names
   */
  renderHeader(invitation) {
    const t = this.languageManager;
    let html = '<div class="invitation-header">';

    if (invitation.couple) {
      const couple = invitation.couple;
      html += '<div class="monogram-section">';
      html += `<div class="monogram">`;
      html += `<span class="letter first">${couple.monogramFirst || 'R'}</span>`;
      html += `<span class="amp">&</span>`;
      html += `<span class="letter second">${couple.monogramSecond || 'N'}</span>`;
      html += `</div>`;
      html += `</div>`;

      html += '<div class="couple-names">';
      html += `<h1 class="couple-name">${t.getText(couple.firstName)}</h1>`;
      html += `<p class="and-text">&</p>`;
      html += `<h1 class="couple-name">${t.getText(couple.secondName)}</h1>`;
      html += '</div>';
    }

    if (invitation.eventType) {
      const config = this.dataLoader.getCached('config');
      if (config) {
        const eventType = config.eventTypes.find(e => e.id === invitation.eventType);
        if (eventType) {
          html += `<p class="event-type">${t.getText(eventType.name)}</p>`;
        }
      }
    }

    html += '</div>';
    return html;
  }

  /**
   * Render event details section
   */
  renderEventSection(event, isMain = false) {
    const t = this.languageManager;
    let html = `<div class="event-section ${isMain ? 'main-event' : 'additional-event'}">`;

    // Event name
    if (event.name) {
      html += `<h2 class="event-name">${t.getText(event.name)}</h2>`;
    }

    // Event details grid
    html += '<div class="event-details">';

    // Date and Time
    if (event.date || event.time) {
      html += '<div class="detail-item date-time">';
      html += '<span class="detail-icon">📅</span>';
      html += '<div class="detail-content">';
      
      if (event.date) {
        html += `<div class="detail-label">${t.formatDate(event.date)}</div>`;
      }
      
      if (event.time) {
        const timeStr = t.formatTime(event.time, event.meridiem);
        html += `<div class="detail-value">${timeStr}</div>`;
      }
      
      html += '</div></div>';
    }

    // Venue
    if (event.venue) {
      html += '<div class="detail-item venue">';
      html += '<span class="detail-icon">📍</span>';
      html += '<div class="detail-content">';
      
      if (event.venue.name) {
        html += `<div class="detail-label">${t.getText(event.venue.name)}</div>`;
      }
      
      if (event.venue.address) {
        html += `<div class="detail-value">${t.getText(event.venue.address)}</div>`;
      }
      
      if (event.venue.googleMapsUrl) {
        html += `<a href="${event.venue.googleMapsUrl}" class="maps-link" target="_blank">View on Maps →</a>`;
      }
      
      html += '</div></div>';
    }

    // Description
    if (event.description) {
      html += `<div class="detail-item description">`;
      html += `<p>${t.getText(event.description)}</p>`;
      html += `</div>`;
    }

    html += '</div>';
    html += '</div>';

    return html;
  }

  /**
   * Render gallery section
   */
  renderGallery(gallery) {
    const t = this.languageManager;
    let html = '<div class="gallery-section">';
    html += '<h2 class="gallery-title">Gallery</h2>';
    html += '<div class="gallery-grid">';

    if (gallery.images && Array.isArray(gallery.images)) {
      for (const image of gallery.images) {
        html += '<div class="gallery-item">';
        html += `<img src="${image.url}" alt="${t.getText(image.caption)}" class="gallery-image">`;
        if (image.caption) {
          html += `<p class="gallery-caption">${t.getText(image.caption)}</p>`;
        }
        html += '</div>';
      }
    }

    html += '</div>';
    html += '</div>';

    return html;
  }

  /**
   * Render RSVP section
   */
  renderRSVP() {
    const t = this.languageManager;
    let html = '<div class="rsvp-section">';
    html += '<h2 class="rsvp-title">RSVP</h2>';
    html += `<p class="rsvp-text">${t.currentLanguage === 'ta' ? 'உங்களின் பதிலை உறுதிப்படுத்தவும்' : 'Please confirm your attendance'}</p>`;
    html += '<div class="rsvp-buttons">';
    html += `<button class="rsvp-btn attending">${t.currentLanguage === 'ta' ? 'பங்கேற்கிறேன்' : 'I will Attend'}</button>`;
    html += `<button class="rsvp-btn not-attending">${t.currentLanguage === 'ta' ? 'பங்கேற்க முடியாது' : 'Cannot Attend'}</button>`;
    html += '</div>';
    html += '</div>';

    return html;
  }

  /**
   * Render event list (for multiple events)
   */
  async renderEventsList() {
    const t = this.languageManager;
    const events = await this.dataLoader.getAllEvents();
    
    let html = '<div class="events-list">';
    html += '<h2>Events</h2>';
    html += '<div class="events-grid">';

    for (const event of events) {
      html += '<div class="event-card">';
      html += `<h3>${t.getText(event.name)}</h3>`;
      
      if (event.date) {
        html += `<p class="event-date">${t.formatDate(event.date)}</p>`;
      }
      
      if (event.venue && event.venue.name) {
        html += `<p class="event-venue">${t.getText(event.venue.name)}</p>`;
      }
      
      html += '</div>';
    }

    html += '</div>';
    html += '</div>';

    return html;
  }
}

// Create global instance
const renderingEngine = new RenderingEngine(languageManager, dataLoader);
