/**
 * Media Manager Module - Phase 3
 * Handles image, video, and audio file management
 */

class MediaManager {
  constructor() {
    this.media = {
      images: [],
      videos: [],
      audio: []
    };
  }

  /**
   * Initialize media manager
   */
  async initialize() {
    this.loadFromStorage();
  }

  /**
   * Add media file
   */
  addMedia(mediaData) {
    const media = {
      id: this.generateId(),
      name: mediaData.name,
      type: mediaData.type,
      size: mediaData.size,
      data: mediaData.data,
      uploadedAt: new Date().toISOString()
    };

    const category = mediaData.category || 'images';
    if (!this.media[category]) {
      this.media[category] = [];
    }

    this.media[category].push(media);
    this.saveToStorage();
    return media;
  }

  /**
   * Get media by category
   */
  getMediaByCategory(category) {
    return this.media[category] || [];
  }

  /**
   * Get all media
   */
  getallMedia() {
    return [
      ...this.media.images,
      ...this.media.videos,
      ...this.media.audio
    ];
  }

  /**
   * Delete media
   */
  deleteMedia(index, category) {
    if (this.media[category] && this.media[category][index]) {
      this.media[category].splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  /**
   * Reorder media
   */
  reorderMedia(category, fromIndex, toIndex) {
    if (!this.media[category]) return false;

    const items = this.media[category];
    const item = items.splice(fromIndex, 1)[0];
    items.splice(toIndex, 0, item);
    this.saveToStorage();
    return true;
  }

  /**
   * Get media statistics
   */
  getStats() {
    const all = this.getallMedia();
    return {
      totalImages: this.media.images.length,
      totalVideos: this.media.videos.length,
      totalAudio: this.media.audio.length,
      totalFiles: all.length,
      totalSize: all.reduce((sum, item) => sum + (item.size || 0), 0),
      formattedSize: (all.reduce((sum, item) => sum + (item.size || 0), 0) / 1024 / 1024).toFixed(2) + ' MB'
    };
  }

  /**
   * Export media list
   */
  exportMediaList() {
    return JSON.stringify(this.getallMedia(), null, 2);
  }

  /**
   * Save to localStorage
   */
  saveToStorage() {
    localStorage.setItem('media', JSON.stringify(this.media));
  }

  /**
   * Load from localStorage
   */
  loadFromStorage() {
    const saved = localStorage.getItem('media');
    if (saved) {
      try {
        this.media = JSON.parse(saved);
      } catch (e) {
        console.error('Error loading media:', e);
      }
    }
  }

  /**
   * Clear all media
   */
  clearAll() {
    this.media = { images: [], videos: [], audio: [] };
    this.saveToStorage();
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get media by ID
   */
  getMediaById(id) {
    return this.getallMedia().find(m => m.id === id);
  }

  /**
   * Search media
   */
  searchMedia(term) {
    const term_lower = term.toLowerCase();
    return this.getallMedia().filter(m => 
      m.name.toLowerCase().includes(term_lower)
    );
  }

  /**
   * Get media by type
   */
  getMediaByType(type) {
    return this.getallMedia().filter(m => m.type.includes(type));
  }
}

// Create global instance
const mediaManager = new MediaManager();
