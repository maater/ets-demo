/**
 * Generates synthesized WAV sound effects for the teaser video.
 * Run: node scripts/generate-sfx.mjs
 * Outputs to public/sfx/
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'sfx');
mkdirSync(OUT, { recursive: true });

const SAMPLE_RATE = 44100;

// ── WAV encoder ──────────────────────────────────────────
function encodeWav(samples, sampleRate = SAMPLE_RATE) {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);       // chunk size
  buffer.writeUInt16LE(1, 20);        // PCM
  buffer.writeUInt16LE(1, 22);        // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32);        // block align
  buffer.writeUInt16LE(16, 34);       // bits per sample

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }

  return buffer;
}

// ── Synthesis helpers ────────────────────────────────────
function sine(freq, t) {
  return Math.sin(2 * Math.PI * freq * t);
}

function noise() {
  return Math.random() * 2 - 1;
}

function envelope(t, attack, decay, sustain, release, duration) {
  if (t < attack) return t / attack;
  if (t < attack + decay) return 1 - (1 - sustain) * ((t - attack) / decay);
  if (t < duration - release) return sustain;
  if (t < duration) return sustain * (1 - (t - (duration - release)) / release);
  return 0;
}

function expDecay(t, rate) {
  return Math.exp(-t * rate);
}

// ── Sound effects ────────────────────────────────────────

/** Soft UI click — gentle low-pitched thud, like a soft button press */
function generateClick() {
  const duration = 0.1;
  const samples = new Float64Array(Math.floor(SAMPLE_RATE * duration));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    // Low-pitched soft thud, no sharp high frequencies
    const freq = 400 - 200 * (t / duration); // gentle pitch drop
    samples[i] = sine(freq, t) * expDecay(t, 30) * 0.2
               + sine(220, t) * expDecay(t, 25) * 0.1;
  }
  // Extra smoothing to remove any sharpness
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < samples.length - 1; i++) {
      samples[i] = (samples[i - 1] * 0.3 + samples[i] * 0.4 + samples[i + 1] * 0.3);
    }
  }
  return samples;
}

/** Chip selection pop — soft bubble pop, rounded and warm */
function generatePop() {
  const duration = 0.15;
  const samples = new Float64Array(Math.floor(SAMPLE_RATE * duration));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    // Gentle frequency drop from 600 to 300 — much lower than before
    const freq = 600 - 300 * (t / duration);
    samples[i] = sine(freq, t) * expDecay(t, 20) * 0.2
               + sine(freq * 0.5, t) * expDecay(t, 18) * 0.1;
  }
  // Smooth out any transients
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 1; i < samples.length - 1; i++) {
      samples[i] = (samples[i - 1] * 0.3 + samples[i] * 0.4 + samples[i + 1] * 0.3);
    }
  }
  return samples;
}

/** Keyboard tap — very soft, muted tap like a cushioned key */
function generateTap() {
  const duration = 0.06;
  const samples = new Float64Array(Math.floor(SAMPLE_RATE * duration));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    // Soft sine thud instead of noise burst
    samples[i] = sine(350, t) * expDecay(t, 40) * 0.12
               + noise() * expDecay(t, 80) * 0.03; // tiny noise for texture
  }
  // Heavy smoothing
  for (let pass = 0; pass < 6; pass++) {
    for (let i = 1; i < samples.length - 1; i++) {
      samples[i] = (samples[i - 1] * 0.3 + samples[i] * 0.4 + samples[i + 1] * 0.3);
    }
  }
  return samples;
}

/** Whoosh — filtered noise sweep for transitions */
function generateWhoosh() {
  const duration = 0.5;
  const samples = new Float64Array(Math.floor(SAMPLE_RATE * duration));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.05, 0.1, 0.6, 0.25, duration);
    samples[i] = noise() * env * 0.25;
  }
  // Multi-pass low-pass for smoother whoosh
  for (let pass = 0; pass < 8; pass++) {
    for (let i = 1; i < samples.length - 1; i++) {
      samples[i] = (samples[i - 1] * 0.3 + samples[i] * 0.4 + samples[i + 1] * 0.3);
    }
  }
  // Add a subtle pitch sweep
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const sweepFreq = 200 + 600 * (t / duration);
    samples[i] += sine(sweepFreq, t) * envelope(t, 0.05, 0.15, 0.3, 0.2, duration) * 0.08;
  }
  return samples;
}

/** Reveal chime — two overlapping sine tones, pleasant interval */
function generateChime() {
  const duration = 0.8;
  const samples = new Float64Array(Math.floor(SAMPLE_RATE * duration));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    // Major third interval: C5 + E5
    samples[i] = sine(523, t) * expDecay(t, 4) * 0.25
               + sine(659, t) * expDecay(t, 5) * 0.2
               + sine(784, t) * expDecay(t, 6) * 0.1; // G5 for brightness
  }
  return samples;
}

/** Ping — high sine with quick decay, for knowledge loop */
function generatePing() {
  const duration = 0.4;
  const samples = new Float64Array(Math.floor(SAMPLE_RATE * duration));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    samples[i] = sine(1047, t) * expDecay(t, 8) * 0.3  // C6
               + sine(1319, t) * expDecay(t, 10) * 0.15; // E6
  }
  return samples;
}

/** Success — ascending three-note arpeggio for results reveal */
function generateSuccess() {
  const duration = 0.6;
  const samples = new Float64Array(Math.floor(SAMPLE_RATE * duration));
  const notes = [523, 659, 784]; // C5, E5, G5
  const noteDelay = 0.12;
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    for (let n = 0; n < notes.length; n++) {
      const nt = t - n * noteDelay;
      if (nt >= 0) {
        samples[i] += sine(notes[n], nt) * expDecay(nt, 5) * 0.2;
      }
    }
  }
  return samples;
}

/** Ambient pad — very subtle low drone for background texture */
function generatePad() {
  const duration = 5.0;
  const samples = new Float64Array(Math.floor(SAMPLE_RATE * duration));
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 1.0, 0.5, 0.6, 1.5, duration);
    // Low C3 + G2 with slow beating
    samples[i] = sine(131, t) * 0.08 * env
               + sine(98, t) * 0.06 * env
               + sine(196, t + 0.001 * sine(0.5, t)) * 0.04 * env; // slight vibrato
  }
  return samples;
}

// ── Generate all ─────────────────────────────────────────
const effects = {
  'click': generateClick,
  'pop': generatePop,
  'tap': generateTap,
  'whoosh': generateWhoosh,
  'chime': generateChime,
  'ping': generatePing,
  'success': generateSuccess,
  'pad': generatePad,
};

for (const [name, gen] of Object.entries(effects)) {
  const samples = gen();
  const wav = encodeWav(samples);
  const path = join(OUT, `${name}.wav`);
  writeFileSync(path, wav);
  console.log(`✓ ${name}.wav (${(wav.length / 1024).toFixed(1)} KB, ${(samples.length / SAMPLE_RATE).toFixed(2)}s)`);
}

console.log('\nAll sound effects generated in public/sfx/');
