/**
 * Publish Manager Module - Phase 3
 * Handles validation and publishing of invitations
 */

class PublishManager {
  constructor() {
    this.checklist = [];
    this.publishData = null;
  }

  /**
   * Initialize publish manager
   */
  async initialize() {
    this.generateChecklist();
  }

  /**
   * Generate checklist
   */
  generateChecklist() {
    this.checklist = [
      this.checkEventExists(),
      this.checkCoupleNames(),
      this.checkVenue(),
      this.checkDate(),
      this.checkLanguageComplete(),
      this.checkImagesAvailable(),
      this.checkTheme(),
      this.checkLayout()
    ];
  }

  /**
   * Check if event exists
   */
  checkEventExists() {
    const invitation = JSON.parse(localStorage.getItem('invitation') || '{}');
    const passed = invitation.mainEvent && invitation.mainEvent.date;

    return {
      id: 'event_exists',
      title: '📅 Event Details',
      message: passed ? 'Event date and time are configured' : 'Please set event date and time',
      passed: passed
    };
  }

  /**
   * Check couple names
   */
  checkCoupleNames() {
    const invitation = JSON.parse(localStorage.getItem('invitation') || '{}');
    const name1 = invitation.couple?.name1 || '';
    const name2 = invitation.couple?.name2 || '';
    const passed = name1.trim() && name2.trim();

    return {
      id: 'couple_names',
      title: '👥 Couple Names',
      message: passed ? 'Names are configured' : 'Please enter couple names',
      passed: passed
    };
  }

  /**
   * Check venue
   */
  checkVenue() {
    const invitation = JSON.parse(localStorage.getItem('invitation') || '{}');
    const venue = invitation.mainEvent?.venue?.en || '';
    const passed = venue.trim().length > 0;

    return {
      id: 'venue',
      title: '📍 Venue',
      message: passed ? 'Venue is configured' : 'Please set the event venue',
      passed: passed
    };
  }

  /**
   * Check date
   */
  checkDate() {
    const invitation = JSON.parse(localStorage.getItem('invitation') || '{}');
    const date = invitation.mainEvent?.date;
    const passed = date && new Date(date) > new Date();

    return {
      id: 'date',
      title: '⏰ Event Date',
      message: passed ? 'Event date is set to future' : 'Event date must be in future',
      passed: passed
    };
  }

  /**
   * Check language completion
   */
  checkLanguageComplete() {
    const invitation = JSON.parse(localStorage.getItem('invitation') || '{}');
    const en = invitation.couple?.name1 && invitation.mainEvent?.venue?.en;
    const ta = invitation.mainEvent?.venue?.ta;
    const passed = en && ta;

    return {
      id: 'languages',
      title: '🌐 Bilingual Content',
      message: passed ? 'Both English and Tamil are complete' : 'Please complete bilingual content',
      passed: passed
    };
  }

  /**
   * Check images available
   */
  checkImagesAvailable() {
    const gallery = JSON.parse(localStorage.getItem('gallery') || '{"images":[]}');
    const passed = gallery.images && gallery.images.length > 0;

    return {
      id: 'images',
      title: '🖼️ Gallery Images',
      message: passed ? `${gallery.images.length} images uploaded` : 'Please add at least one image',
      passed: passed
    };
  }

  /**
   * Check theme
   */
  checkTheme() {
    const theme = JSON.parse(localStorage.getItem('theme') || '{}');
    const passed = theme.primary && theme.secondary;

    return {
      id: 'theme',
      title: '🎨 Theme Configuration',
      message: passed ? 'Theme colors are set' : 'Please configure theme colors',
      passed: passed
    };
  }

  /**
   * Check layout
   */
  checkLayout() {
    const layout = JSON.parse(localStorage.getItem('layout') || '{"sections":[]}');
    const passed = layout.sections && layout.sections.length > 0;

    return {
      id: 'layout',
      title: '📐 Page Layout',
      message: passed ? `${layout.sections.length} sections configured` : 'Please configure page layout',
      passed: passed
    };
  }

  /**
   * Get checklist
   */
  getChecklist() {
    return this.checklist;
  }

  /**
   * Validate all checks
   */
  validateAll() {
    const allPassed = this.checklist.every(check => check.passed);

    return {
      valid: allPassed,
      passed: this.checklist.filter(c => c.passed).length,
      total: this.checklist.length
    };
  }

  /**
   * Get progress
   */
  getProgress() {
    const validation = this.validateAll();
    const percentage = (validation.passed / validation.total) * 100;

    return {
      passed: validation.passed,
      total: validation.total,
      percentage: percentage
    };
  }

  /**
   * Publish invitation
   */
  publish() {
    const validation = this.validateAll();

    if (!validation.valid) {
      return {
        success: false,
        error: 'Not all requirements are met'
      };
    }

    this.publishData = {
      version: '3.0.0',
      timestamp: new Date().toISOString(),
      url: window.location.origin + window.location.pathname.split('admin')[0] + 'invitation.html',
      published: true,
      lastPublished: new Date().toISOString(),
      checksCompleted: validation
    };

    localStorage.setItem('publishData', JSON.stringify(this.publishData));

    return {
      success: true,
      data: this.publishData
    };
  }

  /**
   * Get publish data
   */
  getPublishData() {
    if (!this.publishData) {
      const saved = localStorage.getItem('publishData');
      if (saved) {
        this.publishData = JSON.parse(saved);
      }
    }

    return this.publishData;
  }

  /**
   * Export complete package
   */
  exportPackage() {
    const invitation = JSON.parse(localStorage.getItem('invitation') || '{}');
    const gallery = JSON.parse(localStorage.getItem('gallery') || '{}');
    const music = JSON.parse(localStorage.getItem('music') || '{}');
    const theme = JSON.parse(localStorage.getItem('theme') || '{}');
    const layout = JSON.parse(localStorage.getItem('layout') || '{}');
    const events = JSON.parse(localStorage.getItem('invitation_events') || '{}');

    return {
      version: '3.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        invitation,
        gallery,
        music,
        theme,
        layout,
        events
      }
    };
  }

  /**
   * Import package
   */
  importPackage(packageData) {
    try {
      const pkg = JSON.parse(packageData);

      if (pkg.version !== '3.0.0') {
        return { success: false, error: 'Incompatible version' };
      }

      localStorage.setItem('invitation', JSON.stringify(pkg.data.invitation));
      localStorage.setItem('gallery', JSON.stringify(pkg.data.gallery));
      localStorage.setItem('music', JSON.stringify(pkg.data.music));
      localStorage.setItem('theme', JSON.stringify(pkg.data.theme));
      localStorage.setItem('layout', JSON.stringify(pkg.data.layout));
      localStorage.setItem('invitation_events', JSON.stringify(pkg.data.events));

      return { success: true, message: 'Package imported successfully' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Get validation report
   */
  getValidationReport() {
    const validation = this.validateAll();
    const checklist = this.checklist;

    return {
      overallStatus: validation.valid ? 'READY' : 'NOT_READY',
      completionPercentage: (validation.passed / validation.total) * 100,
      checks: checklist.map(c => ({
        name: c.id,
        title: c.title,
        status: c.passed ? 'PASS' : 'FAIL',
        message: c.message
      })),
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Get URL for published invitation
   */
  getInvitationURL() {
    return window.location.origin + window.location.pathname.split('admin')[0] + 'invitation.html';
  }

  /**
   * Check if invitation is published
   */
  isPublished() {
    const data = this.getPublishData();
    return data && data.published;
  }

  /**
   * Get time since published
   */
  getTimeSincePublished() {
    const data = this.getPublishData();

    if (!data || !data.lastPublished) {
      return null;
    }

    const published = new Date(data.lastPublished);
    const now = new Date();
    const diff = now - published;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  }
}

// Create global instance
const publishManager = new PublishManager();
