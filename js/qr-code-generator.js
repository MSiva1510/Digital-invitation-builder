/**
 * QR Code Generator Module - Phase 3
 * Generates QR codes for invitation URL, maps, and RSVP
 * Using pure JavaScript - no external dependencies
 */

class QRCodeGenerator {
  constructor() {
    this.baseURL = window.location.origin + window.location.pathname.split('admin')[0];
  }

  /**
   * Generate invitation URL QR code
   */
  generateInvitationQR(invitationURL) {
    return this.generateQRCode(invitationURL || this.baseURL + 'invitation.html');
  }

  /**
   * Generate maps QR code
   */
  generateMapsQR(mapsURL) {
    return this.generateQRCode(mapsURL);
  }

  /**
   * Generate RSVP QR code
   */
  generateRSVPQR(rsvpURL) {
    return this.generateQRCode(rsvpURL || this.baseURL + 'invitation.html#rsvp');
  }

  /**
   * Generate generic QR code from URL using external service
   * Using QR Server API (free, no authentication required)
   */
  generateQRCode(text, size = 300) {
    if (!text) {
      return null;
    }

    // Using QR Server API
    const encodedText = encodeURIComponent(text);
    const qrImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;

    return {
      url: qrImageURL,
      text: text,
      size: size,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Create QR code HTML element
   */
  createQRElement(qrData, options = {}) {
    const { width = 300, height = 300, includeLabel = false, label = '' } = options;

    const container = document.createElement('div');
    container.style.textAlign = 'center';
    container.style.padding = '20px';

    if (includeLabel && label) {
      const labelEl = document.createElement('p');
      labelEl.textContent = label;
      labelEl.style.marginBottom = '10px';
      labelEl.style.fontWeight = '600';
      labelEl.style.fontSize = '14px';
      container.appendChild(labelEl);
    }

    const img = document.createElement('img');
    img.src = qrData.url;
    img.alt = label || 'QR Code';
    img.width = width;
    img.height = height;
    img.style.border = '1px solid #ddd';
    img.style.borderRadius = '4px';

    container.appendChild(img);

    return container;
  }

  /**
   * Download QR code as image
   */
  downloadQRCode(qrData, filename = 'qrcode.png') {
    const link = document.createElement('a');
    link.href = qrData.url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Get QR code statistics
   */
  getStats() {
    return {
      service: 'QR Server API',
      maxSize: 1000,
      minSize: 50,
      formats: ['PNG', 'SVG', 'EPS'],
      errorCorrection: ['L', 'M', 'Q', 'H']
    };
  }

  /**
   * Generate batch QR codes
   */
  generateBatchQR(items) {
    return items.map(item => ({
      ...item,
      qr: this.generateQRCode(item.url, item.size || 300)
    }));
  }

  /**
   * Create printable QR code sheet
   */
  createPrintableSheet(qrArray, title = 'QR Codes') {
    const sheet = document.createElement('div');
    sheet.style.padding = '20px';
    sheet.style.fontFamily = 'Poppins, sans-serif';

    const titleEl = document.createElement('h1');
    titleEl.textContent = title;
    titleEl.style.textAlign = 'center';
    titleEl.style.marginBottom = '30px';
    sheet.appendChild(titleEl);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
    grid.style.gap = '30px';

    qrArray.forEach((item, index) => {
      const card = document.createElement('div');
      card.style.padding = '20px';
      card.style.border = '1px solid #ddd';
      card.style.borderRadius = '8px';
      card.style.textAlign = 'center';

      const label = document.createElement('h3');
      label.textContent = item.label || `QR Code ${index + 1}`;
      label.style.marginBottom = '15px';
      card.appendChild(label);

      const img = document.createElement('img');
      img.src = item.qr.url;
      img.width = 250;
      img.height = 250;
      img.style.border = '1px solid #ccc';
      card.appendChild(img);

      const urlText = document.createElement('p');
      urlText.textContent = item.url;
      urlText.style.fontSize = '11px';
      urlText.style.color = '#666';
      urlText.style.marginTop = '10px';
      urlText.style.wordBreak = 'break-all';
      card.appendChild(urlText);

      grid.appendChild(card);
    });

    sheet.appendChild(grid);
    return sheet;
  }

  /**
   * Validate URL
   */
  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get QR code as data URL (for canvas fallback)
   */
  async getQRAsDataURL(text, size = 300) {
    const qrData = this.generateQRCode(text, size);

    if (!qrData) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL());
      };
      img.onerror = () => reject(new Error('Failed to load QR code'));
      img.src = qrData.url;
    });
  }
}

// Create global instance
const qrCodeGenerator = new QRCodeGenerator();
