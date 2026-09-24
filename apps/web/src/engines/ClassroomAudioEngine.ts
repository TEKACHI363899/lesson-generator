/**
 * Classroom Web Audio API Procedural Synthesizer
 * Zero external audio file dependencies. Synthesizes Whistle, Cheer, Buzzer, Correct, Wrong.
 */
export class ClassroomAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;

  public init(): void {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  public setMute(mute: boolean): void {
    this.isMuted = mute;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(mute ? 0 : 0.8, this.ctx.currentTime);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playWhistle(): void {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    const modOsc = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(2800, now);
    osc2.frequency.setValueAtTime(2850, now);

    // Pea vibration modulation
    modOsc.type = 'sine';
    modOsc.frequency.setValueAtTime(28, now);
    modGain.gain.setValueAtTime(0.25, now);

    modOsc.connect(modGain);
    modGain.connect(whistleGain.gain);

    whistleGain.gain.setValueAtTime(0.01, now);
    whistleGain.gain.exponentialRampToValueAtTime(0.6, now + 0.05);
    whistleGain.gain.setValueAtTime(0.6, now + 0.18);
    whistleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    whistleGain.gain.setValueAtTime(0.01, now + 0.26);
    whistleGain.gain.exponentialRampToValueAtTime(0.7, now + 0.3);
    whistleGain.gain.setValueAtTime(0.7, now + 0.65);
    whistleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc1.connect(whistleGain);
    osc2.connect(whistleGain);
    whistleGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    modOsc.start(now);
    osc1.stop(now + 0.8);
    osc2.stop(now + 0.8);
    modOsc.stop(now + 0.8);
  }

  public playCheer(): void {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 2.2);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57 * b2 + white * 1.0526913;
      output[i] = (b0 + b1 + b2) * 0.08;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.6);
    filter.frequency.exponentialRampToValueAtTime(700, now + 2.2);
    filter.Q.setValueAtTime(1.2, now);

    const cheerGain = this.ctx.createGain();
    cheerGain.gain.setValueAtTime(0.01, now);
    cheerGain.gain.linearRampToValueAtTime(0.85, now + 0.4);
    cheerGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    whiteNoise.connect(filter);
    filter.connect(cheerGain);
    cheerGain.connect(this.masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 2.2);
  }

  public playBuzzer(): void {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const buzzGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130, now);
    osc2.frequency.setValueAtTime(136, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, now);

    buzzGain.gain.setValueAtTime(0.01, now);
    buzzGain.gain.linearRampToValueAtTime(0.65, now + 0.03);
    buzzGain.gain.setValueAtTime(0.65, now + 0.45);
    buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(buzzGain);
    buzzGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.55);
    osc2.stop(now + 0.55);
  }

  public playCorrect(): void {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.01, noteTime);
      gain.gain.linearRampToValueAtTime(0.45, noteTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  }

  public playWrong(): void {
    this.init();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.38);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }
}

export const globalClassroomAudio = new ClassroomAudioEngine();
