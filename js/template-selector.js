/**
 * Template Selector Module - Phase 2
 * Allows switching between different event templates
 */

class TemplateSelector {
  constructor(themeEngine, languageManager) {
    this.themeEngine = themeEngine;
    this.languageManager = languageManager;
    this.availableTemplates = [];
    this.currentTemplate = 'wedding';
  }

  /**
   * Initialize template selector
   */
  async initialize() {
    await this.loadAvailableTemplates();
    this.loadCurrentTemplate();
  }

  /**
   * Load available templates
   */
  async loadAvailableTemplates() {
    const templateFiles = [
      'wedding-preset',
      'birthday-preset',
      'engagement-preset',
      'corporate-preset'
    ];

    for (const file of templateFiles) {
      try {
        const response = await fetch(`templates/${file}.json`);
        const template = await response.json();
        this.availableTemplates.push(template);
      } catch (error) {
        console.error(`Error loading template ${file}:`, error);
      }
    }
  }

  /**
   * Load current template from localStorage
   */
  loadCurrentTemplate() {
    const saved = localStorage.getItem('currentTemplate');
    if (saved) {
      this.currentTemplate = saved;
    }
  }

  /**
   * Render template selector
   */
  renderSelector(containerId = 'template-selector') {
    let html = '<div class="template-selector">';
    html += '<h3 class="template-title">';
    html += this.languageManager.currentLanguage === 'ta' 
      ? 'டெம்பிளேட் தேர்வு' 
      : 'Select Template';
    html += '</h3>';
    html += '<div class="template-grid">';

    this.availableTemplates.forEach(template => {
      const isActive = this.currentTemplate === template.id;
      html += `
        <div class="template-card ${isActive ? 'active' : ''}" onclick="templateSelector.selectTemplate('${template.id}')">
          <div class="template-preview" style="background: linear-gradient(135deg, ${template.theme.primary} 0%, ${template.theme.accent} 100%);">
            <div class="template-icon">${this.getTemplateIcon(template.id)}</div>
          </div>
          <div class="template-name">${this.languageManager.getText(template.name)}</div>
          <div class="template-desc">${this.languageManager.getText(template.description)}</div>
        </div>
      `;
    });

    html += '</div></div>';

    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = html;
    }

    return html;
  }

  /**
   * Get template icon
   */
  getTemplateIcon(templateId) {
    const icons = {
      'wedding': '💍',
      'birthday': '🎂',
      'engagement': '💕',
      'corporate': '🏢'
    };
    return icons[templateId] || '✨';
  }

  /**
   * Select template
   */
  async selectTemplate(templateId) {
    const template = this.availableTemplates.find(t => t.id === templateId);
    if (!template) return false;

    this.currentTemplate = templateId;
    localStorage.setItem('currentTemplate', templateId);

    // Apply theme from template
    await this.themeEngine.applyTemplate(templateId);

    // Update UI
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.remove('active');
    });
    document.querySelector(`[onclick*="'${templateId}'"]`)?.classList.add('active');

    return true;
  }

  /**
   * Get current template
   */
  getCurrentTemplate() {
    return this.availableTemplates.find(t => t.id === this.currentTemplate);
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId) {
    return this.availableTemplates.find(t => t.id === templateId);
  }

  /**
   * Get all templates
   */
  getAllTemplates() {
    return [...this.availableTemplates];
  }

  /**
   * Create custom template
   */
  createTemplate(templateData) {
    const template = {
      id: templateData.id || 'custom-' + Date.now(),
      name: templateData.name || { en: 'Custom Template', ta: 'தனிப்பயனி டெம்பிளேட்' },
      description: templateData.description || { en: 'Custom template', ta: 'தனிப்பயனி டெம்பிளேட்' },
      theme: templateData.theme || {},
      fonts: templateData.fonts || {}
    };

    this.availableTemplates.push(template);
    this.saveTemplate(template);
    return template;
  }

  /**
   * Save template to localStorage
   */
  saveTemplate(template) {
    const templates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
    const index = templates.findIndex(t => t.id === template.id);

    if (index !== -1) {
      templates[index] = template;
    } else {
      templates.push(template);
    }

    localStorage.setItem('customTemplates', JSON.stringify(templates));
  }

  /**
   * Delete template
   */
  deleteTemplate(templateId) {
    const index = this.availableTemplates.findIndex(t => t.id === templateId);
    if (index !== -1) {
      const deleted = this.availableTemplates.splice(index, 1);
      const templates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
      const customIndex = templates.findIndex(t => t.id === templateId);
      if (customIndex !== -1) {
        templates.splice(customIndex, 1);
        localStorage.setItem('customTemplates', JSON.stringify(templates));
      }
      return deleted[0];
    }
    return null;
  }

  /**
   * Export template
   */
  exportTemplate(templateId) {
    const template = this.getTemplate(templateId);
    if (!template) return null;
    return JSON.stringify(template, null, 2);
  }

  /**
   * Import template
   */
  importTemplate(jsonString) {
    try {
      const template = JSON.parse(jsonString);
      this.createTemplate(template);
      return { success: true, template };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Duplicate template
   */
  duplicateTemplate(templateId) {
    const template = this.getTemplate(templateId);
    if (!template) return null;

    const duplicate = {
      ...JSON.parse(JSON.stringify(template)),
      id: 'copy-' + template.id + '-' + Date.now(),
      name: {
        en: (template.name.en || '') + ' (Copy)',
        ta: (template.name.ta || '') + ' (நகल்)'
      }
    };

    this.createTemplate(duplicate);
    return duplicate;
  }

  /**
   * Render template grid for admin
   */
  renderAdminGrid(containerId = 'templates-grid') {
    let html = '<div class="admin-templates-grid">';

    this.availableTemplates.forEach(template => {
      html += `
        <div class="admin-template-card">
          <div class="template-header" style="background: linear-gradient(135deg, ${template.theme.primary} 0%, ${template.theme.accent} 100%);">
            <h3>${this.languageManager.getText(template.name)}</h3>
          </div>
          <div class="template-body">
            <p>${this.languageManager.getText(template.description)}</p>
            <div class="color-preview">
              <div class="color-box" style="background: ${template.theme.primary}"></div>
              <div class="color-box" style="background: ${template.theme.secondary}"></div>
              <div class="color-box" style="background: ${template.theme.accent}"></div>
            </div>
          </div>
          <div class="template-actions">
            <button onclick="templateSelector.selectTemplate('${template.id}')" class="btn-small">Use</button>
            <button onclick="templateSelector.duplicateTemplate('${template.id}')" class="btn-small">Duplicate</button>
            ${template.id.startsWith('custom-') ? `
              <button onclick="templateSelector.deleteTemplate('${template.id}')" class="btn-small btn-danger">Delete</button>
            ` : ''}
          </div>
        </div>
      `;
    });

    html += '</div>';

    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = html;
    }

    return html;
  }

  /**
   * Get template statistics
   */
  getStatistics() {
    return {
      totalTemplates: this.availableTemplates.length,
      customTemplates: this.availableTemplates.filter(t => t.id.startsWith('custom-')).length,
      currentTemplate: this.currentTemplate
    };
  }
}

// Create global instance
const templateSelector = new TemplateSelector(themeEngine, languageManager);
