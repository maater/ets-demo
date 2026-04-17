/**
 * Generates a light, upbeat background music track for the teaser video.
 * Run: node scripts/generate-music.mjs
 * Outputs to public/sfx/music.wav
 *
 * 70 seconds, 44100 Hz, 16-bit PCM, mono.
 * Simple 4-chord loop (C-G-Am-F) with shimmer notes and gentle pulse.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'sfx');
mkdirSync(OUT, { recursive: true });

const SAMPLE_RATE = 44100;
const DURATION = 70; // seconds
const TOTAL_SAMPLES = SAMPLE_RATE * DURATION;
const BPM = 110;
const BEAT_SEC = 60 / BPM; // ~0.545s per beat
const BAR_SEC = BEAT_SEC * 4; // ~2.18s per bar
const CHORD_BARS = 4; // each chord lasts 4 bars
const CHORD_SEC = BAR_SEC * CHORD_BARS; // ~8.73s per chord

// ── WAV encoder ──────────────────────────────────────────
function encodeWav(samples, sampleRate = SAMPLE_RATE) {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);

  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);        // PCM
  buffer.writeUInt16LE(1, 22);        // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);

  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }

  return buffer;
}

// ── Helpers ──────────────────────────────────────────────
function sine(freq, t) {
  return Math.sin(2 * Math.PI * freq * t);
}

// Soft triangle wave — warmer than sine, less harsh than square
function triangle(freq, t) {
  const p = (freq * t) % 1;
  return 4 * Math.abs(p - 0.5) - 1;
}

// ── Chord definitions (frequencies in Hz) ────────────────
// C major:  C3, E3, G3, C4
// G major:  G2, B3, D3, G3
// A minor:  A2, C3, E3, A3
// F major:  F2, A2, C3, F3

const CHORDS = [
  { name: 'C',  freqs: [130.81, 164.81, 196.00, 261.63] },
  { name: 'G',  freqs: [98.00,  123.47, 146.83, 196.00] },
  { name: 'Am', freqs: [110.00, 130.81, 164.81, 220.00] },
  { name: 'F',  freqs: [87.31,  110.00, 130.81, 174.61] },
];

// Shimmer notes — higher octave arpeggiated tones per chord
const SHIMMER = [
  [523.25, 659.25, 783.99],   // C5, E5, G5
  [392.00, 493.88, 587.33],   // G4, B4, D5
  [440.00, 523.25, 659.25],   // A4, C5, E5
  [349.23, 440.00, 523.25],   // F4, A4, C5
];

// ── Generate ─────────────────────────────────────────────
console.log(`Generating ${DURATION}s background music at ${SAMPLE_RATE} Hz...`);
console.log(`BPM: ${BPM}, beat: ${BEAT_SEC.toFixed(3)}s, bar: ${BAR_SEC.toFixed(3)}s, chord: ${CHORD_SEC.toFixed(3)}s`);

const samples = new Float64Array(TOTAL_SAMPLES);

for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;

  // Global position within chord progression
  const progressionTime = t % (CHORD_SEC * 4); // full loop = 4 chords
  const chordIndex = Math.floor(progressionTime / CHORD_SEC);
  const chord = CHORDS[chordIndex];
  const shimmerNotes = SHIMMER[chordIndex];
  const chordT = progressionTime - chordIndex * CHORD_SEC; // time within current chord

  // ── Fade in/out envelope for the whole track ──
  let globalEnv = 1.0;
  if (t < 3.0) globalEnv = t / 3.0; // 3s fade in
  if (t > DURATION - 4.0) globalEnv = (DURATION - t) / 4.0; // 4s fade out

  // ── Layer 1: Pad — warm sustained chords ──
  let pad = 0;
  for (const freq of chord.freqs) {
    // Slight detuning for warmth (chorus effect)
    pad += sine(freq, t) * 0.06;
    pad += sine(freq * 1.003, t) * 0.04; // detuned copy
    pad += triangle(freq * 0.5, t) * 0.02; // sub-octave warmth
  }

  // Gentle volume modulation on the pad (slow LFO)
  pad *= 0.9 + 0.1 * sine(0.25, t);

  // ── Layer 2: Rhythmic pulse — gentle eighth-note volume modulation ──
  const eighthNote = BEAT_SEC / 2;
  const pulsePhase = (t % eighthNote) / eighthNote;
  // Smooth pulse: peaks at start of each eighth, dips in between
  const pulse = 0.6 + 0.4 * Math.cos(2 * Math.PI * pulsePhase);

  // Apply pulse to a filtered sine bass
  const bassFreq = chord.freqs[0]; // root note
  let rhythmBass = sine(bassFreq, t) * 0.08 * pulse;

  // ── Layer 3: Shimmer / sparkle — arpeggiated high notes ──
  let shimmer = 0;
  const shimmerBeatPos = (t % BAR_SEC) / BEAT_SEC; // which beat in the bar (0-4)
  const shimmerNoteIndex = Math.floor(shimmerBeatPos) % shimmerNotes.length;
  const shimmerFreq = shimmerNotes[shimmerNoteIndex];

  // Each shimmer note has a soft attack and decay within the beat
  const notePosInBeat = shimmerBeatPos - Math.floor(shimmerBeatPos);
  const shimmerEnv = Math.exp(-notePosInBeat * 4) * 0.8; // quick exponential decay
  shimmer = sine(shimmerFreq, t) * shimmerEnv * 0.04;
  // Add a higher octave for extra sparkle
  shimmer += sine(shimmerFreq * 2, t) * shimmerEnv * 0.015;

  // Only bring shimmer in after first 4 seconds, and fade it
  let shimmerGate = 1.0;
  if (t < 4.0) shimmerGate = 0;
  else if (t < 6.0) shimmerGate = (t - 4.0) / 2.0;

  // ── Layer 4: Very subtle high-freq texture (tinkle) ──
  // Random-ish pitched pings based on beat position
  let tinkle = 0;
  const tinkleRate = BEAT_SEC * 2; // every 2 beats
  const tinklePos = (t % tinkleRate) / tinkleRate;
  if (tinklePos < 0.15) {
    const tinkleFreq = shimmerFreq * 2 * (1 + 0.1 * sine(0.7, t)); // slight waver
    tinkle = sine(tinkleFreq, t) * Math.exp(-tinklePos * 30) * 0.02;
  }

  // ── Mix everything ──
  let mix = pad + rhythmBass + (shimmer + tinkle) * shimmerGate;
  mix *= globalEnv;

  samples[i] = mix;
}

// ── Post-processing: gentle soft-clip to avoid any harshness ──
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const x = samples[i];
  // Soft tanh-style clipping
  samples[i] = Math.tanh(x * 1.5) / Math.tanh(1.5);
}

// ── Normalize to ~70% peak to leave headroom ──
let peak = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const abs = Math.abs(samples[i]);
  if (abs > peak) peak = abs;
}
if (peak > 0) {
  const targetPeak = 0.7;
  const gain = targetPeak / peak;
  for (let i = 0; i < TOTAL_SAMPLES; i++) {
    samples[i] *= gain;
  }
  console.log(`Peak normalized: ${peak.toFixed(4)} -> ${targetPeak} (gain: ${gain.toFixed(2)}x)`);
}

// ── Write WAV ────────────────────────────────────────────
const wav = encodeWav(samples);
const outPath = join(OUT, 'music.wav');
writeFileSync(outPath, wav);

const fileSizeMB = (wav.length / (1024 * 1024)).toFixed(2);
console.log(`\n=> music.wav (${fileSizeMB} MB, ${DURATION}s, ${SAMPLE_RATE} Hz, 16-bit mono)`);
console.log(`   Saved to ${outPath}`);
