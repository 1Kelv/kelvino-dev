/*
  Generative ambient engine.
  Everything is synthesised in the browser with the Web Audio API, so there is
  no audio file to download and nothing to license. It plays a slow chord
  progression of soft detuned pads, sprinkles a gentle arpeggio on top and adds
  a whisper of filtered noise for a lo-fi "tape" feel.
*/

type Chord = number[]; // MIDI note numbers

// A calm progression in D Dorian: Dm9 · G6 · Fmaj7 · Am7 (repeat)
const PROGRESSION: Chord[] = [
  [50, 57, 60, 64, 67],
  [43, 55, 59, 62, 64],
  [41, 53, 57, 60, 64],
  [45, 52, 55, 60, 64],
];

const CHORD_SECONDS = 9;
const MASTER_LEVEL = 0.22;

const midiToHz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private convolver: ConvolverNode | null = null;
  private noiseSrc: AudioBufferSourceNode | null = null;
  private timer: number | null = null;
  private arpTimer: number | null = null;
  private chordIndex = 0;
  private currentChord: Chord = PROGRESSION[0];
  private running = false;

  get isRunning() {
    return this.running;
  }

  async start(): Promise<boolean> {
    if (this.running) return true;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return false;

    try {
      if (!this.ctx) {
        this.ctx = new AC();
        this.buildGraph();
      }
      await this.ctx.resume();
    } catch {
      return false;
    }

    const ctx = this.ctx;
    const master = this.master!;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(MASTER_LEVEL, ctx.currentTime + 2.5);

    this.running = true;
    this.chordIndex = 0;
    this.startNoise();
    this.scheduleChord();
    this.timer = window.setInterval(() => this.scheduleChord(), CHORD_SECONDS * 1000);
    this.arpTimer = window.setInterval(() => this.pluck(), 1400);
    return true;
  }

  stop() {
    if (!this.running || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    this.running = false;
    if (this.timer) window.clearInterval(this.timer);
    if (this.arpTimer) window.clearInterval(this.arpTimer);
    this.timer = null;
    this.arpTimer = null;

    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime);
    this.master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

    const noise = this.noiseSrc;
    this.noiseSrc = null;
    window.setTimeout(() => {
      try { noise?.stop(); } catch { /* already stopped */ }
      if (!this.running) ctx.suspend().catch(() => {});
    }, 1400);
  }

  /** Frequency data for the little visualiser, 0-255 per bin. */
  levels(bins = 5): number[] {
    if (!this.analyser || !this.running) return new Array(bins).fill(0);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    const out: number[] = [];
    const usable = Math.floor(data.length / 6); // low end is where the pads live
    const step = Math.floor(usable / bins);
    for (let i = 0; i < bins; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) sum += data[i * step + j];
      out.push(sum / step);
    }
    return out;
  }

  private buildGraph() {
    const ctx = this.ctx!;
    this.master = ctx.createGain();
    this.master.gain.value = 0.0001;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 2200;
    lowpass.Q.value = 0.4;

    this.convolver = ctx.createConvolver();
    this.convolver.buffer = this.makeImpulse(3.2, 2.4);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    const dry = ctx.createGain();
    dry.gain.value = 0.8;

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.85;

    this.master.connect(lowpass);
    lowpass.connect(dry);
    lowpass.connect(this.convolver);
    this.convolver.connect(wet);
    dry.connect(this.analyser);
    wet.connect(this.analyser);
    this.analyser.connect(ctx.destination);
  }

  private makeImpulse(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const length = Math.floor(rate * seconds);
    const buffer = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return buffer;
  }

  private startNoise() {
    const ctx = this.ctx!;
    const seconds = 4;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      // Brown-ish noise: integrate white noise, keep it tame.
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.5;
    const gain = ctx.createGain();
    gain.gain.value = 0.035;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master!);
    src.start();
    this.noiseSrc = src;
  }

  private scheduleChord() {
    if (!this.ctx || !this.master || !this.running) return;
    const ctx = this.ctx;
    const chord = PROGRESSION[this.chordIndex % PROGRESSION.length];
    this.currentChord = chord;
    this.chordIndex++;

    const start = ctx.currentTime + 0.05;
    const attack = 2.8;
    const release = 3.5;
    const hold = CHORD_SECONDS;

    chord.forEach((note, i) => {
      const hz = midiToHz(note);
      const level = i === 0 ? 0.12 : 0.075;
      [-6, 5].forEach(detune => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.value = hz;
        osc.detune.value = detune;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, start);
        g.gain.exponentialRampToValueAtTime(level, start + attack);
        g.gain.setValueAtTime(level, start + hold);
        g.gain.exponentialRampToValueAtTime(0.0001, start + hold + release);
        osc.connect(g);
        g.connect(this.master!);
        osc.start(start);
        osc.stop(start + hold + release + 0.1);
      });
    });
  }

  private pluck() {
    if (!this.ctx || !this.master || !this.running) return;
    if (Math.random() > 0.55) return; // leave some space
    const ctx = this.ctx;
    const chord = this.currentChord;
    const note = chord[Math.floor(Math.random() * chord.length)] + 12 * (Math.random() > 0.5 ? 1 : 2);
    const start = ctx.currentTime + 0.02;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = midiToHz(note);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.09, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 1.6);
    osc.connect(g);
    g.connect(this.master);
    osc.start(start);
    osc.stop(start + 1.7);
  }
}

export const ambient = new AmbientEngine();
