/**
 * Gallery Builder Module - Phase 2
 * Manages gallery display with lightbox preview
 */

class GalleryBuilder {
  constructor(dataLoader, languageManager) {
    this.dataLoader = dataLoader;
    this.languageManager = languageManager;
    this.galleryData = null;
    this.currentImageIndex = 0;
    this.lightboxOpen = false;
  }

  /**
   * Initialize gallery
   */
  async initialize() {
    try {
      const response = await fetch('data/gallery.json');
      this.galleryData = await response.json();
    } catch (error) {
      console.error('Error loading gallery:', error);
      this.galleryData = { enabled: false, images: [] };
    }
  }

  /**
   * Render gallery HTML
   */
  renderGallery(containerId = 'gallery-container') {
    if (!this.galleryData || !this.galleryData.enabled || !this.galleryData.images.length) {
      return '';
    }

    let html = '<div class="gallery-section">';

    if (this.galleryData.title) {
      html += `<h2 class="gallery-title">${this.languageManager.getText(this.galleryData.title)}</h2>`;
    }

    const cols = this.galleryData.settings?.columns || 3;
    html += `<div class="gallery-grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: ${this.galleryData.settings?.spacing || 10}px;">`;

    this.galleryData.images.forEach((image, index) => {
      html += `
        <div class="gallery-item" data-index="${index}">
          <img 
            src="${image.url}" 
            alt="${this.languageManager.getText(image.caption)}"
            class="gallery-image"
            loading="lazy"
            onclick="galleryBuilder.openLightbox(${index})"
          >
          ${this.galleryData.settings?.enableCaptions ? `
            <div class="gallery-caption">
              ${this.languageManager.getText(image.caption)}
            </div>
          ` : ''}
        </div>
      `;
    });

    html += '</div>';
    html += this.renderLightbox();
    html += '</div>';

    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = html;
    }

    return html;
  }

  /**
   * Render lightbox HTML
   */
  renderLightbox() {
    return `
      <div id="lightbox" class="lightbox" style="display: none;">
        <div class="lightbox-content">
          <button class="lightbox-close" onclick="galleryBuilder.closeLightbox()">&times;</button>
          <button class="lightbox-prev" onclick="galleryBuilder.previousImage()">❮</button>
          <img id="lightbox-image" class="lightbox-image" src="" alt="">
          <button class="lightbox-next" onclick="galleryBuilder.nextImage()">❯</button>
          <div id="lightbox-caption" class="lightbox-caption"></div>
        </div>
      </div>
    `;
  }

  /**
   * Open lightbox
   */
  openLightbox(index) {
    if (!this.galleryData.settings?.enableLightbox) return;

    this.currentImageIndex = index;
    const image = this.galleryData.images[index];

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImage.src = image.url;
    lightboxCaption.textContent = this.languageManager.getText(image.caption);

    lightbox.style.display = 'flex';
    this.lightboxOpen = true;

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  /**
   * Close lightbox
   */
  closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    this.lightboxOpen = false;
  }

  /**
   * Next image
   */
  nextImage() {
    if (this.currentImageIndex < this.galleryData.images.length - 1) {
      this.currentImageIndex++;
      this.updateLightboxImage();
    }
  }

  /**
   * Previous image
   */
  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.updateLightboxImage();
    }
  }

  /**
   * Update lightbox image
   */
  updateLightboxImage() {
    const image = this.galleryData.images[this.currentImageIndex];
    document.getElementById('lightbox-image').src = image.url;
    document.getElementById('lightbox-caption').textContent = this.languageManager.getText(image.caption);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(e) {
    if (!this.lightboxOpen) return;

    switch (e.key) {
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'ArrowLeft':
        this.previousImage();
        break;
      case 'Escape':
        this.closeLightbox();
        break;
    }
  }

  /**
   * Add image to gallery
   */
  addImage(imageData) {
    if (!this.galleryData.images) {
      this.galleryData.images = [];
    }

    const image = {
      id: this.galleryData.images.length + 1,
      url: imageData.url,
      caption: imageData.caption || { en: '', ta: '' },
      type: imageData.type || 'jpg',
      thumbnail: imageData.thumbnail || imageData.url
    };

    this.galleryData.images.push(image);
    this.saveGallery();
    return image;
  }

  /**
   * Remove image from gallery
   */
  removeImage(imageId) {
    const index = this.galleryData.images.findIndex(img => img.id === imageId);
    if (index !== -1) {
      const removed = this.galleryData.images.splice(index, 1);
      this.saveGallery();
      return removed[0];
    }
    return null;
  }

  /**
   * Update image
   */
  updateImage(imageId, imageData) {
    const image = this.galleryData.images.find(img => img.id === imageId);
    if (image) {
      Object.assign(image, imageData);
      this.saveGallery();
      return image;
    }
    return null;
  }

  /**
   * Reorder images
   */
  reorderImages(imageIds) {
    const ordered = [];
    imageIds.forEach(id => {
      const image = this.galleryData.images.find(img => img.id === id);
      if (image) ordered.push(image);
    });
    this.galleryData.images = ordered;
    this.saveGallery();
    return this.galleryData.images;
  }

  /**
   * Move image up
   */
  moveImageUp(imageId) {
    const index = this.galleryData.images.findIndex(img => img.id === imageId);
    if (index > 0) {
      [this.galleryData.images[index - 1], this.galleryData.images[index]] = 
      [this.galleryData.images[index], this.galleryData.images[index - 1]];
      this.saveGallery();
      return true;
    }
    return false;
  }

  /**
   * Move image down
   */
  moveImageDown(imageId) {
    const index = this.galleryData.images.findIndex(img => img.id === imageId);
    if (index < this.galleryData.images.length - 1) {
      [this.galleryData.images[index], this.galleryData.images[index + 1]] = 
      [this.galleryData.images[index + 1], this.galleryData.images[index]];
      this.saveGallery();
      return true;
    }
    return false;
  }

  /**
   * Duplicate image
   */
  duplicateImage(imageId) {
    const image = this.galleryData.images.find(img => img.id === imageId);
    if (image) {
      const duplicate = {
        ...JSON.parse(JSON.stringify(image)),
        id: Math.max(...this.galleryData.images.map(i => i.id)) + 1
      };
      this.galleryData.images.push(duplicate);
      this.saveGallery();
      return duplicate;
    }
    return null;
  }

  /**
   * Save gallery to localStorage
   */
  saveGallery() {
    localStorage.setItem('gallery', JSON.stringify(this.galleryData));
  }

  /**
   * Get gallery data
   */
  getGallery() {
    return JSON.parse(JSON.stringify(this.galleryData));
  }

  /**
   * Export gallery as JSON
   */
  exportGallery() {
    return JSON.stringify(this.galleryData, null, 2);
  }

  /**
   * Import gallery from JSON
   */
  importGallery(jsonString) {
    try {
      const gallery = JSON.parse(jsonString);
      this.galleryData = gallery;
      this.saveGallery();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get gallery statistics
   */
  getStatistics() {
    return {
      totalImages: this.galleryData.images?.length || 0,
      formats: this.getFormatCount(),
      enabled: this.galleryData.enabled
    };
  }

  /**
   * Get image format count
   */
  getFormatCount() {
    const formats = {};
    this.galleryData.images?.forEach(img => {
      const type = img.type || 'unknown';
      formats[type] = (formats[type] || 0) + 1;
    });
    return formats;
  }

  /**
   * Enable/Disable gallery
   */
  toggleGallery(enabled) {
    this.galleryData.enabled = enabled;
    this.saveGallery();
    return enabled;
  }

  /**
   * Update gallery settings
   */
  updateSettings(settings) {
    this.galleryData.settings = {
      ...this.galleryData.settings,
      ...settings
    };
    this.saveGallery();
  }
}

// Create global instance
const galleryBuilder = new GalleryBuilder(dataLoader, languageManager);
