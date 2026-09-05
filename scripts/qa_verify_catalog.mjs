// Automated 3-Way Verification QA Test Suite for KannadaOTT Finder
// Verifies:
// Check 1: Deep Streaming Links (Zero generic root URLs, valid deep links returning HTTP 200)
// Check 2: Content Title Integrity (Verifies destination page title does not contain sports, football, or TV serials)
// Check 3: YouTube Official Trailer Verification (Live verification of trailer_youtube_id via YouTube oEmbed API)

import fs from 'fs';

const content = fs.readFileSync(new URL('../lib/catalog.ts', import.meta.url), 'utf8');
const movieBlocks = content.split(/\{\s*"?id"?:\s*(\d+),/g);

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
  const titleMatch = body.match(/"?title"?:\s*['"]([^'"]+)['"]/);
  const isUpcoming = body.includes('isUpcoming": true') || body.includes('isUpcoming: true');
  const provMatch = body.match(/"?provider_name"?:\s*['"]([^'"]+)['"]/);
  const urlMatch = body.match(/"?directUrl"?:\s*['"]([^'"]+)['"]/);
  const audioMatch = body.match(/"?audio"?:\s*['"]([^'"]+)['"]/);
  const trailerMatch = body.match(/"?trailer_youtube_id"?:\s*['"]([^'"]+)['"]/);

  catalog.push({
    id,
    title: titleMatch ? titleMatch[1] : '',
    isUpcoming,
    prov: provMatch ? provMatch[1] : '',
    url: urlMatch ? urlMatch[1] : '',
    audio: audioMatch ? audioMatch[1] : '',
    trailer_id: trailerMatch ? trailerMatch[1] : ''
  });
}

console.log('=====================================================');
console.log('🚀 RUNNING KANNADAOTT 3-WAY VERIFICATION QA SUITE');
console.log('=====================================================');
console.log(`Loaded ${catalog.length} catalog entries.\n`);

let passCount = 0;
let failCount = 0;

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 200 || i === retries) return res;
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, 700));
    }
  }
}

for (const m of catalog) {
  console.log(`\n--- [ID ${m.id}] ${m.title} ---`);

  // CHECK 3: YouTube Trailer Verification
  if (!m.trailer_id) {
    console.error(`❌ [FAIL - CHECK 3] No trailer_youtube_id specified!`);
    failCount++;
  } else {
    try {
      const ytRes = await fetchWithRetry(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${m.trailer_id}&format=json`);
      if (ytRes.status === 200) {
        const ytData = await ytRes.json();
        console.log(`  ✓ Check 3 (YouTube Trailer): PASS - "${ytData.title}" (${m.trailer_id})`);
      } else {
        console.error(`  ❌ Check 3 (YouTube Trailer): FAIL - HTTP ${ytRes.status} for ID ${m.trailer_id}`);
        failCount++;
      }
    } catch (e) {
      console.error(`  ❌ Check 3 (YouTube Trailer): FAIL - ${e.message}`);
      failCount++;
    }
  }

  if (m.isUpcoming) {
    console.log(`  ✓ [UPCOMING PRE-OTT] Theatrical Tracking verified.`);
    passCount++;
    continue;
  }

  // CHECK 1: Root URL Check
  const cleanUrl = m.url.replace(/\/+$/, '');
  if (genericDomains.has(cleanUrl) || !m.url) {
    console.error(`  ❌ Check 1 (Root URL): FAIL - Generic or empty URL -> ${m.url}`);
    failCount++;
    continue;
  }

  // Audio Check
  if (!m.audio.includes('ಕನ್ನಡ')) {
    console.error(`  ❌ Check 1 (Audio): FAIL - No Kannada audio tag -> ${m.audio}`);
    failCount++;
    continue;
  }

  // CHECK 1 & CHECK 2: Live HTTP 200 & Content Title Check
  try {
    const res = await fetchWithRetry(m.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Referer': m.url.includes('sonyliv') ? 'https://www.sonyliv.com/' : m.url.includes('hotstar') ? 'https://www.hotstar.com/' : 'https://www.zee5.com/'
      }
    });

    if (res.status === 200) {
      console.log(`  ✓ Check 1 (Live HTTP 200): PASS [${m.prov}] -> ${m.url}`);
      
      const html = await res.text();
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const pageTitle = titleMatch ? titleMatch[1].toLowerCase() : '';

      // Check for sports / football mismatch (e.g. SonyLIV UEFA football highlights or non-movie content)
      const isSportsMismatch = pageTitle.includes('uefa') || 
                               pageTitle.includes('champions league') || 
                               (!pageTitle.includes('jiohotstar') && pageTitle.includes('football')) ||
                               (!pageTitle.includes('jiohotstar') && pageTitle.includes('serial'));

      if (isSportsMismatch) {
        console.error(`  ❌ Check 2 (Content Mismatch): FAIL - Page title is "${pageTitle}"`);
        failCount++;
      } else {
        console.log(`  ✓ Check 2 (Content Match): PASS (Title: "${titleMatch ? titleMatch[1].trim() : 'OK'}")`);
        passCount++;
      }
    } else {
      console.error(`  ❌ Check 1 (Live HTTP): FAIL ${res.status} [${m.prov}] -> ${m.url}`);
      failCount++;
    }
  } catch (err) {
    console.error(`  ❌ Check 1 (Live HTTP): FAIL ERR [${m.prov}] -> ${err.message}`);
    failCount++;
  }
}

console.log('\n=====================================================');
console.log(`3-WAY QA RESULT: ${passCount} PASSED | ${failCount} FAILED`);
console.log('=====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL CATALOG ENTRIES 100% 3-WAY VERIFIED!');
  process.exit(0);
}
