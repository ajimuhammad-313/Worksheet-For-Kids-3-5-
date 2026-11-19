import { Language } from '../types';

class AudioManager {
  private ctx: AudioContext | null = null;
  private soundEnabled = true;
  private voiceEnabled = true;
  private volume = 0.7;

  public configure(opts: { soundEnabled: boolean; voiceEnabled: boolean; volume: number }) {
    this.soundEnabled = opts.soundEnabled;
    this.voiceEnabled = opts.voiceEnabled;
    this.volume = Math.max(0, Math.min(1, opts.volume));
    if (!this.voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    delay = 0,
    gainScale = 0.22
  ) {
    if (!this.soundEnabled || this.volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    const peak = this.volume * gainScale;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, peak), now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playTap() {
    this.playTone(520, 0.09, 'sine', 0, 0.14);
  }

  public playCorrect() {
    // Cheerful ascending major triad
    this.playTone(523.25, 0.14, 'triangle', 0, 0.22); // C5
    this.playTone(659.25, 0.14, 'triangle', 0.09, 0.22); // E5
    this.playTone(783.99, 0.24, 'triangle', 0.18, 0.25); // G5
  }

  public playHint() {
    // Soft gentle xylophone boop - never a harsh buzzer
    this.playTone(349.23, 0.16, 'sine', 0, 0.16);
    this.playTone(329.63, 0.18, 'sine', 0.1, 0.14);
  }

  public playCelebration() {
    const notes = [523.25, 587.33, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.22, 'triangle', idx * 0.09, 0.24);
    });
  }

  public playSnip() {
    this.playTone(880, 0.05, 'triangle', 0, 0.14);
    this.playTone(1120, 0.06, 'triangle', 0.05, 0.14);
  }

  public playAnimalSound(animalKey: string, language: Language) {
    if (!this.soundEnabled && !this.voiceEnabled) return;
    // Synthesized playful pitch contours + bilingual vocalization
    switch (animalKey) {
      case 'cat':
        this.playGlide(720, 480, 0.45, 'sine');
        break;
      case 'dog':
        this.playTone(220, 0.12, 'triangle', 0, 0.25);
        this.playTone(250, 0.14, 'triangle', 0.16, 0.25);
        break;
      case 'cow':
        this.playGlide(150, 125, 0.65, 'sawtooth', 0.12);
        break;
      case 'duck':
        this.playTone(420, 0.11, 'square', 0, 0.1);
        this.playTone(420, 0.12, 'square', 0.15, 0.1);
        break;
      case 'frog':
        this.playGlide(190, 390, 0.16, 'triangle', 0.22);
        this.playGlide(190, 410, 0.16, 'triangle', 0.22, 0.22);
        break;
      case 'lion':
        this.playGlide(170, 95, 0.6, 'sawtooth', 0.15);
        break;
      case 'sheep':
        this.playTone(330, 0.14, 'triangle', 0, 0.18);
        this.playTone(310, 0.14, 'triangle', 0.14, 0.18);
        this.playTone(330, 0.16, 'triangle', 0.28, 0.18);
        break;
      case 'rooster':
        this.playTone(620, 0.12, 'triangle', 0, 0.2);
        this.playTone(740, 0.12, 'triangle', 0.14, 0.2);
        this.playTone(880, 0.28, 'triangle', 0.28, 0.22);
        break;
      default:
        this.playCorrect();
    }

    const spokenMap: Record<string, { en: string; id: string }> = {
      cat: { en: 'Meow! Meow!', id: 'Meong! Meong!' },
      dog: { en: 'Woof! Woof!', id: 'Guk! Guk!' },
      cow: { en: 'Mooo!', id: 'Mooo!' },
      duck: { en: 'Quack! Quack!', id: 'Kwek! Kwek!' },
      frog: { en: 'Ribbit! Ribbit!', id: 'Krok! Krok!' },
      lion: { en: 'Roaaar!', id: 'Auuuum!' },
      sheep: { en: 'Baa! Baa!', id: 'Mbeek! Mbeek!' },
      rooster: { en: 'Cock-a-doodle-doo!', id: 'Kukuruyuk!' },
    };

    if (spokenMap[animalKey]) {
      setTimeout(() => {
        this.speak(spokenMap[animalKey][language], language);
      }, 280);
    }
  }

  private playGlide(
    startFreq: number,
    endFreq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainScale = 0.2,
    delay = 0
  ) {
    if (!this.soundEnabled || this.volume <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, this.volume * gainScale), now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  public speak(text: string, language: Language) {
    if (!this.voiceEnabled || this.volume <= 0) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'id' ? 'id-ID' : 'en-US';
      utterance.rate = 0.92;
      utterance.pitch = 1.12;
      utterance.volume = this.volume;

      const voices = window.speechSynthesis.getVoices();
      const langPrefix = language === 'id' ? 'id' : 'en';
      const preferred = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
      if (preferred) {
        utterance.voice = preferred;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Fail gracefully if speechSynthesis is unavailable
    }
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioManager = new AudioManager();
