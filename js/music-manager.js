/**
 * Music Manager Module - Phase 2
 * Manages music playback with controls
 */

class MusicManager {
  constructor(dataLoader) {
    this.dataLoader = dataLoader;
    this.musicData = null;
    this.audioElement = null;
    this.isPlaying = false;
    this.currentTrackIndex = 0;
  }

  /**
   * Initialize music manager
   */
  async initialize() {
    try {
      const response = await fetch('data/music.json');
      this.musicData = await response.json();
      this.createAudioElement();
    } catch (error) {
      console.error('Error loading music:', error);
      this.musicData = { enabled: false };
    }
  }

  /**
   * Create audio element
   */
  createAudioElement() {
    this.audioElement = new Audio();
    this.audioElement.volume = this.musicData.volume || 0.7;
    this.audioElement.loop = this.musicData.loop || false;

    this.audioElement.addEventListener('ended', () => {
      this.handleTrackEnd();
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this.updateProgress();
    });

    if (this.musicData.track) {
      this.audioElement.src = this.musicData.track.url;
    }
  }

  /**
   * Render music player HTML
   */
  renderPlayer(containerId = 'music-player') {
    if (!this.musicData || !this.musicData.enabled) {
      return '';
    }

    let html = `
      <div class="music-player">
        <div class="player-header">
          <div class="track-info">
            <div class="track-title">${this.musicData.track?.title?.en || 'Background Music'}</div>
            <div class="track-artist">${this.musicData.track?.artist?.en || 'Artist'}</div>
          </div>
        </div>

        <div class="player-controls">
          <button class="player-btn prev-btn" onclick="musicManager.previousTrack()">⏮</button>
          <button class="player-btn play-btn" id="play-btn" onclick="musicManager.togglePlay()">▶</button>
          <button class="player-btn next-btn" onclick="musicManager.nextTrack()">⏭</button>
          <button class="player-btn mute-btn" id="mute-btn" onclick="musicManager.toggleMute()">🔊</button>
          <button class="player-btn loop-btn ${this.musicData.loop ? 'active' : ''}" onclick="musicManager.toggleLoop()">🔁</button>
        </div>

        <div class="player-progress">
          <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
          </div>
          <div class="progress-time">
            <span class="current-time">0:00</span>
            <span class="duration">0:00</span>
          </div>
        </div>

        <div class="player-volume">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value="${(this.musicData.volume || 0.7) * 100}" 
            class="volume-slider"
            onchange="musicManager.setVolume(this.value)"
          >
        </div>
    `;

    if (this.musicData.playlist && this.musicData.playlist.length > 0) {
      html += this.renderPlaylist();
    }

    html += '</div>';

    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = html;
    }

    // Set initial state
    if (this.musicData.autoplay) {
      setTimeout(() => this.play(), 500);
    }

    return html;
  }

  /**
   * Render playlist
   */
  renderPlaylist() {
    let html = '<div class="playlist"><div class="playlist-title">Playlist</div>';

    this.musicData.playlist.forEach((track, index) => {
      html += `
        <div class="playlist-item ${index === this.currentTrackIndex ? 'active' : ''}" onclick="musicManager.playTrack(${index})">
          <span class="track-name">${track.title.en}</span>
          <span class="track-duration">${this.formatTime(track.duration)}</span>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  /**
   * Play audio
   */
  play() {
    if (!this.audioElement) return;
    this.audioElement.play().catch(e => console.error('Play error:', e));
    this.isPlaying = true;
    this.updatePlayButton();
  }

  /**
   * Pause audio
   */
  pause() {
    if (!this.audioElement) return;
    this.audioElement.pause();
    this.isPlaying = false;
    this.updatePlayButton();
  }

  /**
   * Toggle play/pause
   */
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Stop audio
   */
  stop() {
    if (!this.audioElement) return;
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.isPlaying = false;
    this.updatePlayButton();
  }

  /**
   * Set volume
   */
  setVolume(value) {
    const volume = value / 100;
    if (this.audioElement) {
      this.audioElement.volume = volume;
      this.musicData.volume = volume;
      this.updateMuteButton();
    }
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    if (this.audioElement) {
      if (this.audioElement.volume > 0) {
        this.audioElement.volume = 0;
      } else {
        this.audioElement.volume = this.musicData.volume || 0.7;
      }
      this.updateMuteButton();
    }
  }

  /**
   * Toggle loop
   */
  toggleLoop() {
    this.musicData.loop = !this.musicData.loop;
    if (this.audioElement) {
      this.audioElement.loop = this.musicData.loop;
    }
    const btn = document.querySelector('.loop-btn');
    if (btn) {
      btn.classList.toggle('active', this.musicData.loop);
    }
    this.saveMusic();
  }

  /**
   * Next track
   */
  nextTrack() {
    if (this.musicData.playlist && this.currentTrackIndex < this.musicData.playlist.length - 1) {
      this.playTrack(this.currentTrackIndex + 1);
    }
  }

  /**
   * Previous track
   */
  previousTrack() {
    if (this.currentTrackIndex > 0) {
      this.playTrack(this.currentTrackIndex - 1);
    }
  }

  /**
   * Play specific track
   */
  playTrack(index) {
    if (this.musicData.playlist && this.musicData.playlist[index]) {
      this.currentTrackIndex = index;
      const track = this.musicData.playlist[index];
      if (this.audioElement) {
        this.audioElement.src = track.url;
        this.play();
        this.updatePlaylist();
      }
    }
  }

  /**
   * Update play button
   */
  updatePlayButton() {
    const btn = document.getElementById('play-btn');
    if (btn) {
      btn.textContent = this.isPlaying ? '⏸' : '▶';
    }
  }

  /**
   * Update mute button
   */
  updateMuteButton() {
    const btn = document.getElementById('mute-btn');
    if (btn) {
      const isMuted = this.audioElement && this.audioElement.volume === 0;
      btn.textContent = isMuted ? '🔇' : '🔊';
    }
  }

  /**
   * Update playlist UI
   */
  updatePlaylist() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
      item.classList.toggle('active', index === this.currentTrackIndex);
    });
  }

  /**
   * Update progress
   */
  updateProgress() {
    if (!this.audioElement) return;

    const percent = (this.audioElement.currentTime / this.audioElement.duration) * 100;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = percent + '%';
    }

    const currentTime = document.querySelector('.current-time');
    const duration = document.querySelector('.duration');

    if (currentTime) {
      currentTime.textContent = this.formatTime(this.audioElement.currentTime);
    }
    if (duration && this.audioElement.duration) {
      duration.textContent = this.formatTime(this.audioElement.duration);
    }
  }

  /**
   * Handle track end
   */
  handleTrackEnd() {
    if (this.musicData.playlist) {
      this.nextTrack();
    }
  }

  /**
   * Format time
   */
  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Add track to playlist
   */
  addTrack(trackData) {
    if (!this.musicData.playlist) {
      this.musicData.playlist = [];
    }

    const track = {
      id: this.musicData.playlist.length + 1,
      url: trackData.url,
      title: trackData.title || { en: 'Track', ta: 'பாடல்' },
      duration: trackData.duration || 0
    };

    this.musicData.playlist.push(track);
    this.saveMusic();
    return track;
  }

  /**
   * Remove track
   */
  removeTrack(index) {
    if (this.musicData.playlist && this.musicData.playlist[index]) {
      const removed = this.musicData.playlist.splice(index, 1);
      this.saveMusic();
      return removed[0];
    }
    return null;
  }

  /**
   * Save music to localStorage
   */
  saveMusic() {
    localStorage.setItem('music', JSON.stringify(this.musicData));
  }

  /**
   * Get music data
   */
  getMusic() {
    return JSON.parse(JSON.stringify(this.musicData));
  }

  /**
   * Export music as JSON
   */
  exportMusic() {
    return JSON.stringify(this.musicData, null, 2);
  }

  /**
   * Import music from JSON
   */
  importMusic(jsonString) {
    try {
      const music = JSON.parse(jsonString);
      this.musicData = music;
      this.createAudioElement();
      this.saveMusic();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Create global instance
const musicManager = new MusicManager(dataLoader);
