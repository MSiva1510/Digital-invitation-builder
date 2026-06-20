/**
 * WhatsApp Sharing Module - Phase 3
 * Generates WhatsApp sharing links with customizable messages
 */

class WhatsAppSharing {
  constructor() {
    this.baseURL = window.location.origin + window.location.pathname.split('admin')[0];
    this.shareMessages = {
      en: {
        default: 'You are invited to a special celebration! Check out the details: {URL}',
        wedding: 'You are cordially invited to the wedding of {couple}! Please join us: {URL}',
        engagement: 'Join us for the engagement celebration of {couple}! {URL}',
        birthday: 'You are invited to celebrate the birthday of {name}! {URL}',
        babyshower: 'Join us for the baby shower celebration! {URL}'
      },
      ta: {
        default: 'ஒரு சிறப்பான விழாவுக்கு நீங்கள் வரவழைக்கப்பட்டுள்ளீர்கள்! விவரங்களைப் பாருங்கள்: {URL}',
        wedding: '{couple} இன் திருமணத்திற்கு நீங்கள் அன்புடன் வரவழைக்கப்பட்டுள்ளீர்கள்! {URL}',
        engagement: '{couple} இன் நிச்சयதார்த்த விழாவுக்கு எங்களுடன் சேர்ந்து கொள்ளுங்கள்! {URL}',
        birthday: '{name} இன் பிறந்தநாள் கொண்டாட்டத்தை கொண்டாடுவதற்கு வரவழைக்கப்பட்டுள்ளீர்கள்! {URL}',
        babyshower: 'பேபி ஷவர் விழாவுக்கு எங்களுடன் சேர்ந்து கொள்ளுங்கள்! {URL}'
      }
    };
  }

  /**
   * Generate WhatsApp share link
   */
  generateShareLink(message, invitationURL) {
    if (!message) {
      message = this.shareMessages.en.default;
    }

    const invURL = invitationURL || this.baseURL + 'invitation.html';
    const finalMessage = message.replace('{URL}', invURL);

    // WhatsApp Web API
    const encodedMessage = encodeURIComponent(finalMessage);
    return `https://wa.me/?text=${encodedMessage}`;
  }

  /**
   * Get default message by language and event type
   */
  getDefaultMessage(language = 'en', eventType = 'default') {
    const messages = this.shareMessages[language] || this.shareMessages.en;
    return messages[eventType] || messages.default;
  }

  /**
   * Replace template variables in message
   */
  formatMessage(message, variables = {}) {
    let formattedMessage = message;

    Object.keys(variables).forEach(key => {
      const placeholder = '{' + key + '}';
      formattedMessage = formattedMessage.replace(placeholder, variables[key]);
    });

    return formattedMessage;
  }

  /**
   * Create WhatsApp share button
   */
  createShareButton(message, options = {}) {
    const {
      text = '💬 Share on WhatsApp',
      className = '',
      buttonStyle = 'primary'
    } = options;

    const button = document.createElement('a');
    button.href = this.generateShareLink(message);
    button.target = '_blank';
    button.textContent = text;
    button.className = `whatsapp-share-btn ${buttonStyle} ${className}`;
    button.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #25d366;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
    `;

    button.onmouseover = () => {
      button.style.background = '#1fa856';
      button.style.transform = 'translateY(-2px)';
    };

    button.onmouseout = () => {
      button.style.background = '#25d366';
      button.style.transform = 'translateY(0)';
    };

    return button;
  }

  /**
   * Share to specific contact
   */
  generateContactShare(phoneNumber, message) {
    // WhatsApp Business API format
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  /**
   * Get share message with event details
   */
  getDetailedMessage(eventData, language = 'en') {
    const coupleNames = `${eventData.couple?.name1} & ${eventData.couple?.name2}`.trim();
    const eventDate = eventData.mainEvent?.date || '';
    const venue = eventData.mainEvent?.venue?.en || '';

    let message = this.getDefaultMessage(language, eventData.eventType);

    const variables = {
      couple: coupleNames,
      name: eventData.groom?.name || eventData.bride?.name || 'our loved ones',
      date: eventDate,
      venue: venue,
      URL: this.baseURL + 'invitation.html'
    };

    return this.formatMessage(message, variables);
  }

  /**
   * Generate multiple share links for different contacts
   */
  generateBulkShareLinks(contacts, message) {
    return contacts.map(contact => ({
      name: contact.name,
      phone: contact.phone,
      link: this.generateContactShare(contact.phone, message),
      message: message
    }));
  }

  /**
   * Create share dialog
   */
  createShareDialog(eventData, options = {}) {
    const { language = 'en' } = options;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    // Title
    const title = document.createElement('h3');
    title.textContent = language === 'en' ? 'Share Invitation' : 'அழைப்பை பகிரவும்';
    title.style.marginBottom = '15px';
    dialog.appendChild(title);

    // Message preview
    const message = this.getDetailedMessage(eventData, language);
    const preview = document.createElement('textarea');
    preview.value = message;
    preview.readOnly = true;
    preview.style.cssText = `
      width: 100%;
      min-height: 100px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 12px;
      margin-bottom: 15px;
      font-family: monospace;
    `;
    dialog.appendChild(preview);

    // Share button
    const shareBtn = this.createShareButton(message, { text: '💬 Open WhatsApp' });
    shareBtn.style.width = '100%';
    shareBtn.style.justifyContent = 'center';
    dialog.appendChild(shareBtn);

    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy Message';
    copyBtn.style.cssText = `
      width: 100%;
      padding: 10px 20px;
      margin-top: 10px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    `;
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(message).then(() => {
        alert(language === 'en' ? 'Message copied!' : 'செய்தி நகலெடுக்கப்பட்டது!');
      });
    };
    dialog.appendChild(copyBtn);

    return dialog;
  }

  /**
   * Get share statistics
   */
  getShareStats() {
    const shares = JSON.parse(localStorage.getItem('whatsappShares') || '[]');
    return {
      totalShares: shares.length,
      lastShare: shares.length > 0 ? shares[shares.length - 1].timestamp : null,
      uniqueContacts: new Set(shares.map(s => s.phone)).size
    };
  }

  /**
   * Track share action
   */
  trackShare(phoneNumber, message) {
    const shares = JSON.parse(localStorage.getItem('whatsappShares') || '[]');
    shares.push({
      timestamp: new Date().toISOString(),
      phone: phoneNumber,
      messagePreview: message.substring(0, 100)
    });
    localStorage.setItem('whatsappShares', JSON.stringify(shares));
  }

  /**
   * Validate phone number
   */
  isValidPhoneNumber(phone) {
    // Basic validation - at least 7 digits
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 7;
  }

  /**
   * Format phone number for WhatsApp
   */
  formatPhoneForWhatsApp(phone) {
    // Remove all non-digit characters except +
    return phone.replace(/[^\d+]/g, '');
  }
}

// Create global instance
const whatsAppSharing = new WhatsAppSharing();
