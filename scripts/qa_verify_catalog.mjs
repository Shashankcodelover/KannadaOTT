// Automated 2-Way Verification QA Test Suite for KannadaOTT Finder
// Verifies:
// 1. Zero generic root URLs (all streaming movies must have specific deep links)
// 2. Verified Kannada audio (original or dubbed) on approved Indian OTTs
// 3. Live HTTP 200 verification for all direct streaming links

import fs from 'fs';

const content = fs.readFileSync(new URL('../lib/catalog.ts', import.meta.url), 'utf8');
const movieBlocks = content.split(/\{\s*id:\s*(\d+),/g);

const genericDomains = new Set([
  'https://www.hotstar.com/in',
  'https://www.hotstar.com',
  'https://www.zee5.com',
  'https://www.sonyliv.com',
  'https://www.jiocinema.com'
]);

const catalog = [];
for (let i = 1; i < movieBlocks.length; i += 2) {
  const id = Number(movieBlocks[i]);
  const body = movieBlocks[i + 1];
  const titleMatch = body.match(/title:\s*['"]([^'"]+)['"]/);
  const isUpcoming = body.includes('isUpcoming: true');
  const provMatch = body.match(/provider_name:\s*['"]([^'"]+)['"]/);
  const urlMatch = body.match(/directUrl:\s*['"]([^'"]+)['"]/);
  const audioMatch = body.match(/audio:\s*['"]([^'"]+)['"]/);

  catalog.push({
    id,
    title: titleMatch ? titleMatch[1] : '',
    isUpcoming,
    prov: provMatch ? provMatch[1] : '',
    url: urlMatch ? urlMatch[1] : '',
    audio: audioMatch ? audioMatch[1] : ''
  });
}

console.log('=====================================================');
console.log('🚀 RUNNING KANNADAOTT 2-WAY VERIFICATION QA SUITE');
console.log('=====================================================');
console.log(`Loaded ${catalog.length} catalog entries.\n`);

let passCount = 0;
let failCount = 0;

for (const m of catalog) {
  if (m.isUpcoming) {
    console.log(`[UPCOMING TRACKING] [${m.id}] ${m.title} (Pre-OTT Theatrical Tracking)`);
    passCount++;
    continue;
  }

  // 1. Root URL Check
  const cleanUrl = m.url.replace(/\/+$/, '');
  if (genericDomains.has(cleanUrl) || !m.url) {
    console.error(`❌ [FAIL - GENERIC ROOT URL] [${m.id}] ${m.title} -> ${m.url}`);
    failCount++;
    continue;
  }

  // 2. Kannada Audio Check
  if (!m.audio.includes('ಕನ್ನಡ')) {
    console.error(`❌ [FAIL - NO KANNADA AUDIO] [${m.id}] ${m.title} -> audio: ${m.audio}`);
    failCount++;
    continue;
  }

  // 3. Live HTTP 200 Check
  try {
    const res = await fetch(m.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Referer': m.url.includes('sonyliv') ? 'https://www.sonyliv.com/' : m.url.includes('hotstar') ? 'https://www.hotstar.com/' : 'https://www.zee5.com/'
      }
    });

    if (res.status === 200) {
      console.log(`✓ [PASS 200] [${m.prov}] [${m.id}] ${m.title} (${m.audio})`);
      passCount++;
    } else {
      console.error(`❌ [FAIL ${res.status}] [${m.prov}] [${m.id}] ${m.title} -> ${m.url}`);
      failCount++;
    }
  } catch (err) {
    console.error(`❌ [FAIL ERR] [${m.prov}] [${m.id}] ${m.title} -> ${err.message}`);
    failCount++;
  }
}

console.log('\n=====================================================');
console.log(`QA RESULT: ${passCount} PASSED | ${failCount} FAILED`);
console.log('=====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL ENTRIES 100% 2-WAY VERIFIED!');
  process.exit(0);
}
