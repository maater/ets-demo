/**
 * Generates voiceover narration using ElevenLabs TTS API.
 * Run: node scripts/generate-vo.mjs
 * Outputs to public/sfx/vo/
 *
 * Voice: Charlotte (XB0fDUnXU5powFXDhCwa)
 * Model: eleven_multilingual_v2
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'sfx', 'vo');
mkdirSync(OUT, { recursive: true });

const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_d57f0904d22590b4f6dc909b18bbb062a12327d9f313d781';
const VOICE_ID = 'XB0fDUnXU5powFXDhCwa'; // Charlotte
const MODEL = 'eleven_multilingual_v2';

const LINES = [
  {
    id: '01-intro',
    text: 'Meridian Partners. A mid-market manufacturer, twenty-two hundred employees.',
  },
  {
    id: '02-pain',
    text: 'Our SAP system has ten years of procurement data. Nobody knows what to do with it.',
  },
  {
    id: '03-finds',
    text: 'Then one day, Sarah finds Axon Labs.',
  },
  {
    id: '04-visits',
    text: "Sarah visits Axon's website and starts finding answers to her everyday problems.",
  },
  {
    id: '05-assessment',
    text: "Sarah shares details about her SAP environment. But this isn't ChatGPT. These questions come from deep SAP domain expertise and real engagement patterns.",
  },
  {
    id: '06-preview',
    text: 'And Sarah gets a project preview. AI-generated. Tailored to her exact SAP environment.',
  },
  {
    id: '07-nosales',
    text: 'From problem to solution preview. Before any sales call.',
  },
  {
    id: '08-onestep',
    text: 'What you just experienced was one step in this engagement.',
  },
  {
    id: '09-imagine',
    text: 'Imagine an entire customer engagement that is AI-enabled.',
  },
  {
    id: '10-proposal',
    text: 'An interactive, AI-enabled proposal.',
  },
  {
    id: '11-tower',
    text: 'A live engagement control tower.',
  },
  {
    id: '12-dashboard',
    text: 'An always up-to-date customer dashboard.',
  },
  {
    id: '13-allsteps',
    text: 'All steps are AI-enabled, for both Sarah and the service provider.',
  },
  {
    id: '14-smarter',
    text: 'And Axon Labs keeps getting smarter.',
  },
  {
    id: '15-cta',
    text: "Axon Labs is a hypothetical company, but these are exactly the kind of companies we're building at Vixul.",
  },
];

async function generateLine(line) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: line.text,
      model_id: MODEL,
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.8,
        style: 0.4,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed ${line.id}: ${res.status} ${err}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const path = join(OUT, `${line.id}.mp3`);
  writeFileSync(path, buffer);
  console.log(`✓ ${line.id}.mp3 (${(buffer.length / 1024).toFixed(1)} KB) — "${line.text.slice(0, 50)}..."`);
}

console.log(`Generating ${LINES.length} voiceover lines with Charlotte...\n`);

for (const line of LINES) {
  await generateLine(line);
  // Small delay to avoid rate limiting
  await new Promise(r => setTimeout(r, 500));
}

console.log(`\nAll voiceover lines generated in public/sfx/vo/`);
