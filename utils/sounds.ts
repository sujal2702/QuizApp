// Sound effects for the quiz app
// Note: Add actual audio files to public/sounds/ directory

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    this.initSounds();
    // Load sound preference from localStorage
    const savedEnabled = localStorage.getItem('soundEnabled');
    this.enabled = savedEnabled !== 'false';
  }

  private initSounds() {
    const soundFiles = {
      correct: '/sounds/correct.mp3',
      wrong: '/sounds/wrong.mp3',
      tick: '/sounds/tick.mp3',
      countdown: '/sounds/countdown.mp3',
      applause: '/sounds/applause.mp3',
      whoosh: '/sounds/whoosh.mp3',
      join: '/sounds/join.mp3',
      bell: '/sounds/bell.mp3',
      success: '/sounds/success.mp3',
      powerup: '/sounds/powerup.mp3',
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.volume = this.volume;
      audio.preload = 'auto';
      this.sounds.set(key, audio);
    });
  }

  play(soundName: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      // Reset to start if already playing
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.warn('Sound play failed:', error);
      });
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled.toString());
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSound = (soundName: string) => soundManager.play(soundName);
export const toggleSound = () => soundManager.toggle();
export const isSoundEnabled = () => soundManager.isEnabled();
