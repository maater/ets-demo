/**
 * Regenerates only the 5 VO lines that changed from review feedback.
 * Run: node scripts/generate-vo-fixes.mjs
 *
 * Changes from review:
 *  00c-preamble3  — removed "from the customer's perspective"
 *  01-intro       — shorter; just introduces Meridian Partners (Panel 1 match)
 *  01b-company    — NEW: company stats VO for Panel 2 (was silent)
 *  02-pain        — introduces Sarah by name before the quote
 *  15-cta         — adds a real call-to-action at the end
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'sfx', 'vo');
mkdirSync(OUT, { recursive: true });

const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_d57f0904d22590b4f6dc909b18bbb062a12327d9f313d781';
const VOICE_ID = 'XB0fDUnXU5powFXDhCwa'; // Charlotte
const MODEL    = 'eleven_multilingual_v2';

const FIXES = [
  {
    id: '00c-preamble3',
    text: 'This is what Service as Software feels like.',
  },
  {
    id: '01-intro',
    text: 'Meet Meridian Partners.',
  },
  {
    id: '01b-company',
    text: 'Mid-market manufacturing. Twenty-two hundred employees. Running SAP ECC.',
  },
  {
    id: '02-pain',
    text: "Sarah Mitchell, their VP of IT, puts it plainly: our SAP system has ten years of procurement data. Nobody knows what to do with it.",
  },
  {
    id: '15-cta',
    text: "Axon Labs is a hypothetical company. But this is the future we're building at Vixul. Reach out to learn more.",
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
      voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.4 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed ${line.id}: ${res.status} ${err}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const path = join(OUT, `${line.id}.mp3`);
  writeFileSync(path, buffer);
  const dur = (buffer.length / 1024 / 128).toFixed(1); // rough estimate
  console.log(`✓ ${line.id}.mp3  (${(buffer.length/1024).toFixed(1)} KB)  — "${line.text.slice(0, 60)}..."`);
}

console.log(`Regenerating ${FIXES.length} VO lines (Charlotte)...\n`);
for (const line of FIXES) {
  await generateLine(line);
  await new Promise(r => setTimeout(r, 500));
}
console.log('\nDone. Verify durations with: afinfo public/sfx/vo/<file>.mp3');
