/**
 * Import/Export Module - Phase 3
 * Handles importing and exporting invitation packages
 */

class ImportExportManager {
  constructor() {
    this.version = '3.0.0';
    this.dataKeys = [
      'invitation',
      'gallery',
      'music',
      'theme',
      'layout',
      'invitation_events',
      'media',
      'rsvp_responses',
      'publishData'
    ];
  }

  /**
   * Export complete package as JSON
   */
  exportAsJSON(filename = 'invitation-package.json') {
    const pkg = this.buildPackage();
    const json = JSON.stringify(pkg, null, 2);
    this.downloadFile(json, filename, 'application/json');
    return pkg;
  }

  /**
   * Export as ZIP (requires external library in browser)
   */
  async exportAsZIP(filename = 'invitation-package.zip') {
    const pkg = this.buildPackage();
    // Note: Would need JSZip library for actual ZIP export
    // For now, we'll return the package and user can download
    return pkg;
  }

  /**
   * Build complete package
   */
  buildPackage() {
    const pkg = {
      version: this.version,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Digital Invitation Builder v3.0',
      data: {}
    };

    // Collect all data
    this.dataKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          pkg.data[key] = JSON.parse(data);
        } catch (e) {
          pkg.data[key] = data;
        }
      }
    });

    return pkg;
  }

  /**
   * Export as CSV (for RSVPs)
   */
  exportRSVPsAsCSV(filename = 'rsvp-responses.csv') {
    const rsvps = JSON.parse(localStorage.getItem('rsvp_responses') || '[]');

    let csv = 'Name,Phone,Guests,Attending,Message,Date\n';

    rsvps.forEach(rsvp => {
      const row = [
        this.escapeCSV(rsvp.name),
        this.escapeCSV(rsvp.phone),
        rsvp.guests,
        rsvp.attending ? 'Yes' : 'No',
        this.escapeCSV(rsvp.message || ''),
        new Date(rsvp.timestamp).toLocaleDateString()
      ];
      csv += row.join(',') + '\n';
    });

    this.downloadFile(csv, filename, 'text/csv');
    return csv;
  }

  /**
   * Import package from JSON
   */
  importFromJSON(jsonString) {
    try {
      const pkg = JSON.parse(jsonString);

      // Validate package
      const validation = this.validatePackage(pkg);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Clear existing data
      this.clearAllData();

      // Import data
      Object.keys(pkg.data).forEach(key => {
        if (this.dataKeys.includes(key)) {
          localStorage.setItem(key, JSON.stringify(pkg.data[key]));
        }
      });

      return {
        success: true,
        message: 'Package imported successfully',
        itemsImported: Object.keys(pkg.data).length
      };
    } catch (e) {
      return { success: false, error: 'Invalid JSON: ' + e.message };
    }
  }

  /**
   * Import from file upload
   */
  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const result = this.importFromJSON(content);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  }

  /**
   * Validate package structure
   */
  validatePackage(pkg) {
    const errors = [];

    if (!pkg.version) {
      errors.push('Missing version');
    }

    if (!pkg.data || typeof pkg.data !== 'object') {
      errors.push('Invalid data structure');
    }

    if (pkg.version !== this.version) {
      errors.push(`Version mismatch: package is ${pkg.version}, expected ${this.version}`);
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Get import preview
   */
  getImportPreview(jsonString) {
    try {
      const pkg = JSON.parse(jsonString);
      const preview = {
        version: pkg.version,
        exportedAt: pkg.exportedAt,
        dataItems: Object.keys(pkg.data || {}),
        itemCount: Object.keys(pkg.data || {}).length
      };

      if (pkg.data.invitation) {
        preview.coupleName = `${pkg.data.invitation.couple?.name1 || ''} & ${pkg.data.invitation.couple?.name2 || ''}`;
        preview.eventDate = pkg.data.invitation.mainEvent?.date;
      }

      if (pkg.data.rsvp_responses) {
        preview.rsvpCount = pkg.data.rsvp_responses.length;
      }

      if (pkg.data.gallery) {
        preview.imageCount = (pkg.data.gallery.images || []).length;
      }

      return preview;
    } catch (e) {
      return null;
    }
  }

  /**
   * Export specific data
   */
  exportSpecific(keys, filename = 'export.json') {
    const pkg = {
      version: this.version,
      exportedAt: new Date().toISOString(),
      data: {}
    };

    keys.forEach(key => {
      if (this.dataKeys.includes(key)) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            pkg.data[key] = JSON.parse(data);
          } catch (e) {
            pkg.data[key] = data;
          }
        }
      }
    });

    const json = JSON.stringify(pkg, null, 2);
    this.downloadFile(json, filename, 'application/json');
    return pkg;
  }

  /**
   * Clear all data
   */
  clearAllData() {
    this.dataKeys.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Backup current data
   */
  backupCurrentData() {
    const backup = {
      timestamp: new Date().toISOString(),
      package: this.buildPackage()
    };

    const backups = JSON.parse(localStorage.getItem('backups') || '[]');
    backups.push(backup);

    // Keep only last 5 backups
    if (backups.length > 5) {
      backups.shift();
    }

    localStorage.setItem('backups', JSON.stringify(backups));
    return backup;
  }

  /**
   * Restore from backup
   */
  restoreFromBackup(backupIndex) {
    const backups = JSON.parse(localStorage.getItem('backups') || '[]');

    if (backupIndex < 0 || backupIndex >= backups.length) {
      return { success: false, error: 'Invalid backup index' };
    }

    const backup = backups[backupIndex];
    return this.importFromJSON(JSON.stringify(backup.package));
  }

  /**
   * Get list of backups
   */
  getBackups() {
    const backups = JSON.parse(localStorage.getItem('backups') || '[]');
    return backups.map((b, index) => ({
      index: index,
      timestamp: b.timestamp,
      date: new Date(b.timestamp).toLocaleString()
    }));
  }

  /**
   * Download file
   */
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Escape CSV special characters
   */
  escapeCSV(text) {
    if (typeof text !== 'string') return text;
    return '"' + text.replace(/"/g, '""') + '"';
  }

  /**
   * Get storage statistics
   */
  getStorageStats() {
    let totalSize = 0;
    const items = {};

    this.dataKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        const size = new Blob([data]).size;
        totalSize += size;
        items[key] = size;
      }
    });

    return {
      totalSize: totalSize,
      totalSizeFormatted: (totalSize / 1024).toFixed(2) + ' KB',
      items: items,
      itemsUsed: Object.keys(items).length
    };
  }

  /**
   * Export as HTML report
   */
  exportAsHTML(filename = 'invitation-report.html') {
    const pkg = this.buildPackage();
    const html = this.generateHTMLReport(pkg);
    this.downloadFile(html, filename, 'text/html');
    return html;
  }

  /**
   * Generate HTML report
   */
  generateHTMLReport(pkg) {
    const invitation = pkg.data.invitation || {};
    const couple = invitation.couple || {};
    const event = invitation.mainEvent || {};
    const stats = this.getStorageStats();

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invitation Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #667eea; }
    .section { margin: 20px 0; border-bottom: 1px solid #eee; padding-bottom: 15px; }
    .item { margin: 10px 0; }
    .label { font-weight: bold; color: #666; }
    .value { color: #333; margin-left: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>💒 Invitation Report</h1>
    
    <div class="section">
      <h2>Event Information</h2>
      <div class="item">
        <span class="label">Couple Names:</span>
        <span class="value">${couple.name1 || 'N/A'} & ${couple.name2 || 'N/A'}</span>
      </div>
      <div class="item">
        <span class="label">Event Date:</span>
        <span class="value">${event.date || 'N/A'}</span>
      </div>
      <div class="item">
        <span class="label">Venue:</span>
        <span class="value">${event.venue?.en || 'N/A'}</span>
      </div>
    </div>

    <div class="section">
      <h2>Storage Statistics</h2>
      <div class="item">
        <span class="label">Total Size:</span>
        <span class="value">${stats.totalSizeFormatted}</span>
      </div>
      <div class="item">
        <span class="label">Data Items:</span>
        <span class="value">${stats.itemsUsed}</span>
      </div>
    </div>

    <div class="section">
      <h2>Export Information</h2>
      <div class="item">
        <span class="label">Package Version:</span>
        <span class="value">${pkg.version}</span>
      </div>
      <div class="item">
        <span class="label">Exported At:</span>
        <span class="value">${pkg.exportedAt}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
  }
}

// Create global instance
const importExportManager = new ImportExportManager();
