/**
 * Generates an upbeat, dynamic background music track for the teaser video.
 * Run: node scripts/generate-music.mjs
 * Outputs to public/sfx/music.wav
 *
 * 80 seconds, 44100 Hz, 16-bit PCM, mono.
 * Driving synth pop feel — 138 BPM, bright chords, punchy bass, crisp hats.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'sfx');
mkdirSync(OUT, { recursive: true });

const SAMPLE_RATE = 44100;
const DURATION = 80; // seconds — covers 78s video
const TOTAL_SAMPLES = SAMPLE_RATE * DURATION;
const BPM = 138;
const BEAT_SEC = 60 / BPM; // ~0.435s
const BAR_SEC = BEAT_SEC * 4; // ~1.74s

// ── WAV encoder ──────────────────────────────────────────
function encodeWav(samples, sampleRate = SAMPLE_RATE) {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
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

// ── Oscillators ──────────────────────────────────────────
function sine(freq, t) {
  return Math.sin(2 * Math.PI * freq * t);
}

function saw(freq, t) {
  const p = (freq * t) % 1;
  return 2 * p - 1;
}

function square(freq, t, pw = 0.5) {
  const p = (freq * t) % 1;
  return p < pw ? 1 : -1;
}

// Noise (deterministic per sample index for consistency)
function noise(i) {
  // Simple hash
  let x = i * 1103515245 + 12345;
  x = ((x >> 16) & 0x7FFF) / 0x7FFF;
  return x * 2 - 1;
}

// ── Chord progression: Cm - Ab - Eb - Bb (dark pop energy) ──
// Then switches to C - F - Am - G (bright lift) at the halfway mark

const CHORDS_A = [
  { root: 130.81, freqs: [130.81, 155.56, 196.00] },  // Cm (C3, Eb3, G3)
  { root: 103.83, freqs: [103.83, 130.81, 155.56] },  // Ab (Ab2, C3, Eb3)
  { root: 155.56, freqs: [155.56, 196.00, 233.08] },  // Eb (Eb3, G3, Bb3)
  { root: 116.54, freqs: [116.54, 146.83, 174.61] },  // Bb (Bb2, D3, F3)
];

const CHORDS_B = [
  { root: 130.81, freqs: [130.81, 164.81, 196.00] },  // C  (C3, E3, G3)
  { root: 174.61, freqs: [174.61, 220.00, 261.63] },  // F  (F3, A3, C4)
  { root: 110.00, freqs: [110.00, 130.81, 164.81] },  // Am (A2, C3, E3)
  { root: 98.00,  freqs: [98.00,  123.47, 146.83] },  // G  (G2, B2, D3)
];

// Each chord = 2 bars (short cycle for energy)
const CHORD_SEC = BAR_SEC * 2;
const PROG_SEC = CHORD_SEC * 4; // full progression cycle

// ── Generate ─────────────────────────────────────────────
console.log(`Generating ${DURATION}s dynamic music at ${SAMPLE_RATE} Hz, ${BPM} BPM...`);

const samples = new Float64Array(TOTAL_SAMPLES);

for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;

  // Switch chord set at ~36s for a lift
  const useB = t >= 36 && t < 64;
  const chords = useB ? CHORDS_B : CHORDS_A;

  const progT = t % PROG_SEC;
  const chordIdx = Math.floor(progT / CHORD_SEC) % 4;
  const chord = chords[chordIdx];

  // Beat position
  const beatInBar = (t % BAR_SEC) / BEAT_SEC; // 0-4
  const beatFrac = beatInBar % 1;
  const beatNum = Math.floor(beatInBar);

  // ── Global envelope ──
  let env = 1.0;
  if (t < 2.0) env = t / 2.0;
  if (t > DURATION - 3.0) env = (DURATION - t) / 3.0;

  // Energy build: starts at 0.6, builds to full by 8s
  const energy = Math.min(1.0, 0.6 + t * 0.05);

  // ── Layer 1: Punchy bass — saw + sub sine, on beats 1 and 3 ──
  let bass = 0;
  const bassFreq = chord.root;
  if (beatNum === 0 || beatNum === 2) {
    const bassEnv = Math.exp(-beatFrac * 8);
    bass = (saw(bassFreq, t) * 0.5 + sine(bassFreq * 0.5, t) * 0.5) * bassEnv * 0.12;
  }
  // Add a persistent sub for warmth
  bass += sine(bassFreq * 0.5, t) * 0.04;

  // ── Layer 2: Bright chord stabs — off-beat (syncopated) ──
  let stab = 0;
  // Hit on the "and" of each beat (eighth note offsets)
  const eighthPos = (t % (BEAT_SEC / 2)) / (BEAT_SEC / 2);
  const isOffBeat = beatFrac > 0.4 && beatFrac < 0.9;
  if (isOffBeat) {
    const stabEnv = Math.exp(-(beatFrac - 0.5) * 12);
    for (const freq of chord.freqs) {
      // Bright saw with slight detuning
      stab += saw(freq * 2, t) * 0.015 * stabEnv;
      stab += saw(freq * 2 * 1.005, t) * 0.01 * stabEnv;
    }
  }

  // ── Layer 3: Soft hi-hat pattern ──
  let hat = 0;
  // Sixteenth note pattern: every 1/4 beat
  const sixteenthSec = BEAT_SEC / 4;
  const sixteenthPos = (t % sixteenthSec) / sixteenthSec;
  const sixteenthInBeat = Math.floor((t % BEAT_SEC) / sixteenthSec);

  // Gentle accent pattern — lower volumes overall
  let hatVol = 0;
  if (sixteenthInBeat === 0) hatVol = 0.025;
  else if (sixteenthInBeat === 2) hatVol = 0.018;
  else hatVol = 0.01;

  // Softer decay — less sharp transient
  const isOpenHat = sixteenthInBeat === 2;
  const hatDecay = isOpenHat ? 3 : 6;
  // Mix noise with high sine for softer texture instead of pure noise
  hat = (noise(i) * 0.4 + sine(8000, t) * 0.6) * Math.exp(-sixteenthPos * hatDecay) * hatVol;

  // ── Layer 4: Soft snare on beats 2 and 4 ──
  let snare = 0;
  if (beatNum === 1 || beatNum === 3) {
    const snareEnv = Math.exp(-beatFrac * 6);
    // Much more tone, much less noise — soft rimshot feel
    snare = (noise(i) * 0.25 + sine(180, t) * 0.5 + sine(330, t) * 0.25) * snareEnv * 0.03;
  }

  // ── Layer 5: Bright arpeggio lead ──
  let arp = 0;
  const arpNotes = [...chord.freqs.map(f => f * 4), chord.freqs[0] * 8]; // high octave
  const arpSixteenth = Math.floor((t % BAR_SEC) / sixteenthSec);
  const arpNote = arpNotes[arpSixteenth % arpNotes.length];
  const arpEnv = Math.exp(-sixteenthPos * 6);
  arp = sine(arpNote, t) * arpEnv * 0.02;
  // Bring arp in after 6s
  let arpGate = 0;
  if (t >= 6 && t < 8) arpGate = (t - 6) / 2;
  else if (t >= 8) arpGate = 1;

  // ── Layer 6: Sustained pad for fullness ──
  let pad = 0;
  for (const freq of chord.freqs) {
    pad += sine(freq * 2, t) * 0.02;
    pad += sine(freq * 2 * 1.003, t) * 0.015; // detuned
  }
  // Gentle LFO modulation
  pad *= 0.85 + 0.15 * sine(0.5, t);

  // ── Layer 7: Soft kick drum on every beat ──
  let kick = 0;
  const kickEnv = Math.exp(-beatFrac * 10);
  // Gentler pitch sweep — less snappy attack
  const kickFreq = 55 + 60 * Math.exp(-beatFrac * 12);
  kick = sine(kickFreq, t) * kickEnv * 0.06;

  // ── Mix ──
  let mix = bass + stab + hat + snare + arp * arpGate + pad + kick;
  mix *= env * energy;

  samples[i] = mix;
}

// ── Post-processing: soft-clip ──
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  samples[i] = Math.tanh(samples[i] * 2.0) / Math.tanh(2.0);
}

// ── Normalize to ~75% peak ──
let peak = 0;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  if (Math.abs(samples[i]) > peak) peak = Math.abs(samples[i]);
}
if (peak > 0) {
  const target = 0.75;
  const gain = target / peak;
  for (let i = 0; i < TOTAL_SAMPLES; i++) samples[i] *= gain;
  console.log(`Peak: ${peak.toFixed(4)} -> ${target} (gain: ${gain.toFixed(2)}x)`);
}

// ── Write WAV ────────────────────────────────────────────
const wav = encodeWav(samples);
const outPath = join(OUT, 'music.wav');
writeFileSync(outPath, wav);

console.log(`\n=> music.wav (${(wav.length / 1024 / 1024).toFixed(2)} MB, ${DURATION}s, ${BPM} BPM)`);
console.log(`   ${outPath}`);
