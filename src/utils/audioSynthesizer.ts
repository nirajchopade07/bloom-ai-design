/**
 * Pure Web Audio API Synthesizer for Bloom AI.
 * Creates generative crystalline harmonics, ambient ethereal drones, and glass chimes.
 * Requires zero audio assets, 100% synthesized in real-time.
 */

class BotanicalAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = true;
  private isInitialized: boolean = false;
  private ambientOscs: { osc: OscillatorNode; gain: GainNode }[] = [];
  private lfo: OscillatorNode | null = null;

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
    this.isInitialized = true;
  }

  public toggleMute(): boolean {
    this.initContext();
    if (!this.ctx || !this.masterGain) return true;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      if (this.ambientOscs.length === 0) {
        this.startAmbientDrone();
      }
      this.masterGain.gain.setTargetAtTime(0.18, this.ctx.currentTime, 0.4);
      this.playChime(660);
    } else {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
    }

    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  private startAmbientDrone() {
    if (!this.ctx || !this.masterGain) return;

    // Harmonic frequencies for crystalline botanical resonance: A minor 9 / airy crystal chord
    const freqs = [110, 164.81, 220, 277.18, 329.63, 440];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);
    filter.Q.setValueAtTime(2, this.ctx.currentTime);
    filter.connect(this.masterGain);

    // Subtle LFO for breathing movement
    this.lfo = this.ctx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
    this.lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    this.lfo.start();

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const amp = 0.08 / (idx + 1);
      gain.gain.setValueAtTime(amp, this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(filter);
      osc.start();

      this.ambientOscs.push({ osc, gain });
    });
  }

  public playChime(freq = 880) {
    if (this.isMuted || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      // Subtle pitch bend
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // Audio fallback silent
    }
  }

  public playClick() {
    if (this.isMuted) return;
    this.playChime(1174.66); // D6 glass tap
  }

  public playHover() {
    if (this.isMuted) return;
    this.playChime(1760); // A6 delicate glass harmonic
  }
}

export const audioEngine = new BotanicalAudioEngine();
