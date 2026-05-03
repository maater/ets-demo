/**
 * Regenerates 3 VO lines from timing feedback round 2.
 * Run: node scripts/generate-vo-fixes2.mjs
 *
 *  01b-company     — shorter; drops "Running SAP ECC" (visible on screen, was bleeding into Panel 3)
 *  02-pain         — reverted to just the quote (Sarah identified visually now)
 *  02b-supporting  — NEW: punchy echo of Panel 4 pain points
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'sfx', 'vo');
mkdirSync(OUT, { recursive: true });

const API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_d57f0904d22590b4f6dc909b18bbb062a12327d9f313d781';
const VOICE_ID = 'XB0fDUnXU5powFXDhCwa';
const MODEL    = 'eleven_multilingual_v2';

const FIXES = [
  {
    id: '01b-company',
    text: 'Mid-market manufacturing. Twenty-two hundred employees.',
  },
  {
    id: '02-pain',
    text: '"Our SAP system has ten years of procurement data. Nobody knows what to do with it."',
  },
  {
    id: '02b-supporting',
    text: 'Manual exports. Crystal Reports nobody trusts. No spend visibility.',
  },
];

async function generate(line) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: line.text,
      model_id: MODEL,
      voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.4 },
    }),
  });
  if (!res.ok) throw new Error(`${line.id}: ${res.status} ${await res.text()}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(OUT, `${line.id}.mp3`), buf);
  console.log(`✓ ${line.id}.mp3  (${(buf.length/1024).toFixed(1)} KB)  — "${line.text.slice(0,60)}"`);
}

console.log(`Generating ${FIXES.length} VO fixes...\n`);
for (const line of FIXES) {
  await generate(line);
  await new Promise(r => setTimeout(r, 500));
}
console.log('\nDone.');
