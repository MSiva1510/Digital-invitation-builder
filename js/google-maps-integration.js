/**
 * Google Maps Integration Module - Phase 2
 * Handles map display and location management
 */

class GoogleMapsIntegration {
  constructor(languageManager) {
    this.languageManager = languageManager;
    this.locations = [];
    this.mapInstances = {};
  }

  /**
   * Add location
   */
  addLocation(locationData) {
    const location = {
      id: locationData.id || 'loc-' + Date.now(),
      name: locationData.name || { en: 'Location', ta: 'இடம்' },
      address: locationData.address || { en: '', ta: '' },
      latitude: locationData.latitude || 0,
      longitude: locationData.longitude || 0,
      googleMapsUrl: locationData.googleMapsUrl || '',
      eventType: locationData.eventType || 'venue'
    };

    this.locations.push(location);
    return location;
  }

  /**
   * Get location by ID
   */
  getLocation(locationId) {
    return this.locations.find(loc => loc.id === locationId);
  }

  /**
   * Get all locations
   */
  getAllLocations() {
    return [...this.locations];
  }

  /**
   * Update location
   */
  updateLocation(locationId, locationData) {
    const location = this.getLocation(locationId);
    if (location) {
      Object.assign(location, locationData);
      return location;
    }
    return null;
  }

  /**
   * Delete location
   */
  deleteLocation(locationId) {
    const index = this.locations.findIndex(loc => loc.id === locationId);
    if (index !== -1) {
      return this.locations.splice(index, 1)[0];
    }
    return null;
  }

  /**
   * Render embedded map
   */
  renderEmbeddedMap(googleMapsUrl, containerId) {
    if (!googleMapsUrl) return '';

    // Extract coordinates or location from URL
    const embedUrl = this.convertToEmbedUrl(googleMapsUrl);

    let html = `
      <div class="maps-container" id="${containerId}">
        <iframe 
          width="100%" 
          height="400" 
          style="border:0" 
          src="${embedUrl}" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    `;

    return html;
  }

  /**
   * Render maps buttons
   */
  renderMapsButtons(locationData) {
    const mapsUrl = locationData.googleMapsUrl || '';
    const directionUrl = locationData.googleMapsUrl || '';

    let html = '<div class="maps-buttons">';

    if (mapsUrl) {
      html += `
        <a href="${mapsUrl}" target="_blank" class="btn btn-maps">
          <span class="icon">📍</span>
          ${this.languageManager.currentLanguage === 'ta' ? 'வரைபடத்தில் பார்க்கவும்' : 'View on Maps'}
        </a>
      `;
    }

    if (directionUrl) {
      html += `
        <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          this.languageManager.getText(locationData.address)
        )}" target="_blank" class="btn btn-directions">
          <span class="icon">🧭</span>
          ${this.languageManager.currentLanguage === 'ta' ? 'திசைகளைப் பெறுங்கள்' : 'Get Directions'}
        </a>
      `;
    }

    html += '</div>';
    return html;
  }

  /**
   * Convert Google Maps URL to embed URL
   */
  convertToEmbedUrl(mapsUrl) {
    // If already an embed URL, return as is
    if (mapsUrl.includes('embed')) {
      return mapsUrl;
    }

    // Extract coordinates from URL like https://maps.google.com/?q=13.8303,79.7292
    const coordMatch = mapsUrl.match(/[?&]q=([^&]+)/);
    if (coordMatch) {
      const location = decodeURIComponent(coordMatch[1]);
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyDummyKey&q=${encodeURIComponent(location)}`;
    }

    // Fallback: create embed URL from original URL
    return mapsUrl.replace('maps.google.com', 'www.google.com/maps/embed/v1');
  }

  /**
   * Get coordinates from address
   */
  async getCoordinatesFromAddress(address) {
    // Note: This would require a backend service in production
    // For Phase 2, we'll use a static implementation
    const commonLocations = {
      'Puducherry': { lat: 12.9716, lng: 79.8589 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Delhi': { lat: 28.7041, lng: 77.1025 },
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 }
    };

    for (const [city, coords] of Object.entries(commonLocations)) {
      if (address.includes(city)) {
        return coords;
      }
    }

    return { lat: 0, lng: 0 };
  }

  /**
   * Generate share location link
   */
  generateShareLink(latitude, longitude) {
    return `https://maps.google.com/?q=${latitude},${longitude}`;
  }

  /**
   * Generate directions link
   */
  generateDirectionsLink(address) {
    return `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
  }

  /**
   * Validate Google Maps URL
   */
  validateMapsUrl(url) {
    return /^https:\/\/(maps\.)?google\.com\//.test(url) || url.includes('maps.google.com');
  }

  /**
   * Extract location from URL
   */
  extractLocationFromUrl(url) {
    const match = url.match(/[?&]q=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  /**
   * Create maps marker
   */
  createMarker(lat, lng, label) {
    return {
      position: { lat, lng },
      title: label,
      animation: 'DROP'
    };
  }

  /**
   * Calculate distance between two points
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Render venue card with map
   */
  renderVenueCard(locationData, showMap = true) {
    let html = '<div class="venue-card">';

    // Header
    html += `<div class="venue-header">`;
    html += `<h3 class="venue-name">${this.languageManager.getText(locationData.name)}</h3>`;
    html += `</div>`;

    // Address
    if (locationData.address) {
      html += `<p class="venue-address">${this.languageManager.getText(locationData.address)}</p>`;
    }

    // Map if available
    if (showMap && locationData.googleMapsUrl) {
      html += this.renderEmbeddedMap(locationData.googleMapsUrl, 'map-' + locationData.id);
    }

    // Buttons
    html += this.renderMapsButtons(locationData);

    html += '</div>';
    return html;
  }

  /**
   * Export locations as JSON
   */
  exportLocations() {
    return JSON.stringify(this.locations, null, 2);
  }

  /**
   * Import locations from JSON
   */
  importLocations(jsonString) {
    try {
      const locations = JSON.parse(jsonString);
      this.locations = locations;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get locations by type
   */
  getLocationsByType(eventType) {
    return this.locations.filter(loc => loc.eventType === eventType);
  }

  /**
   * Create directions HTML
   */
  createDirectionsHTML(origin, destination) {
    const directionUrl = `https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}`;
    return `
      <div class="directions-widget">
        <a href="${directionUrl}" target="_blank" class="btn btn-directions">
          <span class="icon">🧭</span>
          Get Directions
        </a>
      </div>
    `;
  }
}

// Create global instance
const googleMapsIntegration = new GoogleMapsIntegration(languageManager);
