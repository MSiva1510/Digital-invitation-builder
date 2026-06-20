/**
 * SEO Optimization Module - Phase 3
 * Generates meta tags, structured data, and SEO optimization
 */

class SEOOptimization {
  constructor() {
    this.baseURL = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/') + '/';
  }

  /**
   * Initialize SEO optimization
   */
  initialize() {
    this.generateMetaTags();
    this.generateStructuredData();
  }

  /**
   * Generate meta tags from invitation data
   */
  generateMetaTags() {
    const invitation = this.getInvitationData();
    const meta = this.buildMetaTags(invitation);

    // Update document title
    document.title = meta.title;

    // Set or update meta tags
    this.setMetaTag('description', meta.description);
    this.setMetaTag('og:title', meta.ogTitle, 'property');
    this.setMetaTag('og:description', meta.ogDescription, 'property');
    this.setMetaTag('og:image', meta.ogImage, 'property');
    this.setMetaTag('og:url', meta.ogUrl, 'property');
    this.setMetaTag('og:type', 'website', 'property');
    this.setMetaTag('twitter:card', 'summary_large_image');
    this.setMetaTag('twitter:title', meta.title);
    this.setMetaTag('twitter:description', meta.description);
    this.setMetaTag('twitter:image', meta.ogImage);
    this.setMetaTag('keywords', meta.keywords);
    this.setMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  }

  /**
   * Build meta tags from data
   */
  buildMetaTags(invitation) {
    const couple = invitation.couple || {};
    const event = invitation.mainEvent || {};
    const gallery = invitation.gallery || {};

    const title = `${couple.name1} & ${couple.name2} - Digital Invitation`;
    const description = `Join us for our celebration on ${this.formatDate(event.date)} at ${event.venue?.en || 'a special venue'}. View our digital invitation with photos, music, and RSVP.`;
    const keywords = `${couple.name1}, ${couple.name2}, wedding, invitation, digital, celebration, ${event.venue?.en || ''}`;

    // Get first image from gallery
    let ogImage = this.baseURL + 'images/default-og.jpg';
    if (gallery.images && gallery.images.length > 0) {
      ogImage = gallery.images[0].url || ogImage;
    }

    return {
      title: title,
      description: description,
      keywords: keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage: ogImage,
      ogUrl: this.baseURL + 'invitation.html'
    };
  }

  /**
   * Generate structured data (JSON-LD)
   */
  generateStructuredData() {
    const invitation = this.getInvitationData();
    const structured = this.buildStructuredData(invitation);

    // Create script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structured);

    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(script);
  }

  /**
   * Build structured data
   */
  buildStructuredData(invitation) {
    const couple = invitation.couple || {};
    const event = invitation.mainEvent || {};

    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      'name': `${couple.name1} & ${couple.name2} Celebration`,
      'description': event.description?.en || 'Digital invitation',
      'startDate': event.date + 'T' + (event.time || '00:00'),
      'endDate': this.getEndDate(event.date, event.time),
      'eventStatus': 'EventScheduled',
      'eventAttendanceMode': 'OfflineEventAttendanceMode',
      'location': {
        '@type': 'Place',
        'name': event.venue?.en || 'Venue',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': event.venue?.en || ''
        }
      },
      'organizer': {
        '@type': 'Organization',
        'name': `${couple.name1} & ${couple.name2}`,
        'url': this.baseURL
      },
      'image': this.getFirstImage(invitation),
      'url': this.baseURL + 'invitation.html'
    };
  }

  /**
   * Set meta tag
   */
  setMetaTag(name, content, type = 'name') {
    let tag = document.querySelector(`meta[${type}="${name}"]`);

    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(type, name);
      document.head.appendChild(tag);
    }

    tag.setAttribute('content', content);
  }

  /**
   * Get invitation data
   */
  getInvitationData() {
    const saved = localStorage.getItem('invitation');
    return saved ? JSON.parse(saved) : {};
  }

  /**
   * Format date
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Get end date (assuming 4 hours duration)
   */
  getEndDate(startDate, time) {
    const date = new Date(startDate + 'T' + (time || '00:00'));
    date.setHours(date.getHours() + 4);
    return date.toISOString();
  }

  /**
   * Get first image from gallery
   */
  getFirstImage(invitation) {
    const gallery = invitation.gallery || {};
    if (gallery.images && gallery.images.length > 0) {
      return gallery.images[0].url || '';
    }
    return this.baseURL + 'images/default-og.jpg';
  }

  /**
   * Generate sitemap
   */
  generateSitemap() {
    const urls = [
      { url: this.baseURL, changefreq: 'daily', priority: 1.0 },
      { url: this.baseURL + 'invitation.html', changefreq: 'weekly', priority: 0.9 },
      { url: this.baseURL + 'index.html', changefreq: 'daily', priority: 0.8 },
      { url: this.baseURL + 'admin/index.html', changefreq: 'monthly', priority: 0.5 }
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(item => {
      xml += '  <url>\n';
      xml += `    <loc>${item.url}</loc>\n`;
      xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
      xml += `    <priority>${item.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    return xml;
  }

  /**
   * Generate robots.txt
   */
  generateRobotsTxt() {
    return `User-agent: *
Allow: /
Allow: /invitation.html
Disallow: /admin/
Disallow: /js/
Sitemap: ${this.baseURL}sitemap.xml`;
  }

  /**
   * Get SEO score
   */
  getSEOScore() {
    const invitation = this.getInvitationData();
    let score = 0;

    // Check for required fields
    if (invitation.couple?.name1) score += 15;
    if (invitation.couple?.name2) score += 15;
    if (invitation.mainEvent?.date) score += 15;
    if (invitation.mainEvent?.venue?.en) score += 10;
    if (invitation.mainEvent?.venue?.ta) score += 10;

    // Check for gallery
    const gallery = JSON.parse(localStorage.getItem('gallery') || '{}');
    if (gallery.images && gallery.images.length > 0) score += 15;

    // Check for theme
    const theme = JSON.parse(localStorage.getItem('theme') || '{}');
    if (theme.primary) score += 5;

    return Math.min(score, 100);
  }

  /**
   * Get SEO recommendations
   */
  getSEORecommendations() {
    const recommendations = [];
    const invitation = this.getInvitationData();
    const seoScore = this.getSEOScore();

    if (seoScore < 100) {
      if (!invitation.couple?.name1 || !invitation.couple?.name2) {
        recommendations.push('Add couple names for better SEO');
      }

      if (!invitation.mainEvent?.date) {
        recommendations.push('Set event date to help search engines');
      }

      const gallery = JSON.parse(localStorage.getItem('gallery') || '{}');
      if (!gallery.images || gallery.images.length === 0) {
        recommendations.push('Add images to improve engagement and SEO');
      }

      if (!invitation.mainEvent?.description?.en) {
        recommendations.push('Add event description for better search visibility');
      }
    }

    return {
      score: seoScore,
      recommendations: recommendations
    };
  }

  /**
   * Generate meta tags string for export
   */
  getMetaTagsHTML() {
    const invitation = this.getInvitationData();
    const meta = this.buildMetaTags(invitation);

    let html = `<!-- SEO Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
<meta name="keywords" content="${meta.keywords}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${meta.ogUrl}">
<meta property="og:title" content="${meta.ogTitle}">
<meta property="og:description" content="${meta.ogDescription}">
<meta property="og:image" content="${meta.ogImage}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${meta.ogUrl}">
<meta property="twitter:title" content="${meta.title}">
<meta property="twitter:description" content="${meta.description}">
<meta property="twitter:image" content="${meta.ogImage}">`;

    return html;
  }
}

// Create global instance
const seoOptimization = new SEOOptimization();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  seoOptimization.initialize();
});
