/**
 * Countdown Timer Module - Phase 2
 * Displays live countdown to event
 */

class CountdownTimer {
  constructor(languageManager) {
    this.languageManager = languageManager;
    this.targetDate = null;
    this.intervalId = null;
    this.isRunning = false;
  }

  /**
   * Initialize countdown timer
   */
  setTargetDate(dateString) {
    this.targetDate = new Date(dateString);
    if (isNaN(this.targetDate)) {
      console.error('Invalid target date:', dateString);
      return false;
    }
    return true;
  }

  /**
   * Render countdown HTML
   */
  renderCountdown(containerId = 'countdown-container') {
    let html = `
      <div class="countdown-section">
        <div class="countdown-title">${
          this.languageManager.currentLanguage === 'ta' 
            ? 'நாட்களில் எஞ்சியுள்ளது' 
            : 'Days Until'
        }</div>
        <div class="countdown-timer">
          <div class="countdown-item">
            <div class="countdown-value" id="days">0</div>
            <div class="countdown-label">${
              this.languageManager.currentLanguage === 'ta' ? 'நாட்கள்' : 'Days'
            }</div>
          </div>
          <div class="countdown-item">
            <div class="countdown-value" id="hours">0</div>
            <div class="countdown-label">${
              this.languageManager.currentLanguage === 'ta' ? 'மணிநேரம்' : 'Hours'
            }</div>
          </div>
          <div class="countdown-item">
            <div class="countdown-value" id="minutes">0</div>
            <div class="countdown-label">${
              this.languageManager.currentLanguage === 'ta' ? 'நிமிடங்கள்' : 'Minutes'
            }</div>
          </div>
          <div class="countdown-item">
            <div class="countdown-value" id="seconds">0</div>
            <div class="countdown-label">${
              this.languageManager.currentLanguage === 'ta' ? 'விநாடிகள்' : 'Seconds'
            }</div>
          </div>
        </div>
      </div>
    `;

    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = html;
    }

    this.start();
    return html;
  }

  /**
   * Start countdown
   */
  start() {
    if (!this.targetDate) return;

    this.isRunning = true;

    // Update immediately
    this.update();

    // Update every second
    this.intervalId = setInterval(() => {
      this.update();
    }, 1000);
  }

  /**
   * Stop countdown
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  /**
   * Update countdown display
   */
  update() {
    const now = new Date().getTime();
    const target = this.targetDate.getTime();
    const distance = target - now;

    if (distance < 0) {
      // Event has started
      this.setDisplayValues(0, 0, 0, 0);
      this.stop();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.setDisplayValues(days, hours, minutes, seconds);
  }

  /**
   * Set display values
   */
  setDisplayValues(days, hours, minutes, seconds) {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  /**
   * Get time remaining
   */
  getTimeRemaining() {
    if (!this.targetDate) return null;

    const now = new Date().getTime();
    const target = this.targetDate.getTime();
    const distance = target - now;

    if (distance < 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        passed: true
      };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
      totalSeconds: Math.floor(distance / 1000),
      passed: false
    };
  }

  /**
   * Get countdown text
   */
  getCountdownText() {
    const time = this.getTimeRemaining();
    if (!time || time.passed) {
      return this.languageManager.currentLanguage === 'ta' 
        ? 'நிகழ்வு நடந்துவிட்டது' 
        : 'Event has started';
    }

    if (time.days > 0) {
      return this.languageManager.currentLanguage === 'ta'
        ? `${time.days} நாட்களில்`
        : `In ${time.days} days`;
    }

    if (time.hours > 0) {
      return this.languageManager.currentLanguage === 'ta'
        ? `${time.hours} மணிநேரத்தில்`
        : `In ${time.hours} hours`;
    }

    if (time.minutes > 0) {
      return this.languageManager.currentLanguage === 'ta'
        ? `${time.minutes} நிமிடங்களில்`
        : `In ${time.minutes} minutes`;
    }

    return this.languageManager.currentLanguage === 'ta'
      ? 'மிகவும் விரைவில்'
      : 'Very soon!';
  }

  /**
   * Is event today
   */
  isToday() {
    if (!this.targetDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(this.targetDate);
    target.setHours(0, 0, 0, 0);

    return today.getTime() === target.getTime();
  }

  /**
   * Is event tomorrow
   */
  isTomorrow() {
    if (!this.targetDate) return false;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const target = new Date(this.targetDate);
    target.setHours(0, 0, 0, 0);

    return tomorrow.getTime() === target.getTime();
  }

  /**
   * Pause countdown
   */
  pause() {
    this.stop();
  }

  /**
   * Resume countdown
   */
  resume() {
    if (!this.isRunning) {
      this.start();
    }
  }

  /**
   * Destroy countdown
   */
  destroy() {
    this.stop();
    this.targetDate = null;
  }

  /**
   * Create visual progress bar
   */
  renderProgressBar(totalDays = 365) {
    const time = this.getTimeRemaining();
    if (!time) return '';

    const daysRemaining = time.days;
    const percentRemaining = (daysRemaining / totalDays) * 100;

    return `
      <div class="countdown-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentRemaining}%"></div>
        </div>
      </div>
    `;
  }

  /**
   * Get progress percentage
   */
  getProgressPercentage(totalDays = 365) {
    const time = this.getTimeRemaining();
    if (!time || time.passed) return 0;
    return Math.max(0, Math.min(100, (time.days / totalDays) * 100));
  }
}

// Create global instance
const countdownTimer = new CountdownTimer(languageManager);
