import fs from 'fs';
import path from 'path';

const postersDir = path.resolve('public/posters');
if (!fs.existsSync(postersDir)) {
  fs.mkdirSync(postersDir, { recursive: true });
}

const moviePages = [
  { id: 101, page: '777_Charlie' },
  { id: 102, page: 'Sapta_Sagaradaache_Ello_–_Side_A' },
  { id: 103, page: 'Sapta_Sagaradaache_Ello_–_Side_B' },
  { id: 104, page: 'Hostel_Hudugaru_Bekagiddare' },
  { id: 105, page: 'Daredevil_Musthafa' },
  { id: 106, page: 'Ratnan_Prapancha' },
  { id: 107, page: 'Badava_Rascal' },
  { id: 108, page: 'Gandhada_Gudi_(2022_film)' },
  { id: 109, page: 'Toby_(2023_film)' },
  { id: 110, page: 'Kaatera' },
  { id: 201, page: '12th_Fail' },
  { id: 202, page: 'Zara_Hatke_Zara_Bachke' },
  { id: 203, page: 'Sam_Bahadur_(film)' },
  { id: 204, page: 'Sirf_Ek_Bandaa_Kaafi_Hai' },
  { id: 205, page: 'Tarla_(film)' },
  { id: 206, page: 'Bhediya_(film)' },
  { id: 301, page: 'Premalu' },
  { id: 302, page: 'Manjummel_Boys' },
  { id: 303, page: 'Gargi_(film)' },
  { id: 304, page: 'Por_Thozhil' },
  { id: 305, page: '2018_(film)' },
  { id: 401, page: 'Sita_Ramam' },
  { id: 402, page: 'Hanu-Man' },
  { id: 403, page: 'Balagam' },
  { id: 501, page: 'Kantara:_Chapter_1' },
  { id: 502, page: 'Uttarakaanda' },
];

async function fetchImageUrl(wikiPage) {
  try {
    const propUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiPage)}&prop=pageprops&format=json`;
    const res = await fetch(propUrl, {
      headers: { 'User-Agent': 'KannadaOTTBrowseBot/1.0 (contact: preetham@gmail.com)' },
    });
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const firstKey = Object.keys(pages)[0];
    const imageName = pages[firstKey]?.pageprops?.page_image;

    if (!imageName) return null;

    const infoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(imageName)}&prop=imageinfo&iiprop=url&format=json`;
    const infoRes = await fetch(infoUrl, {
      headers: { 'User-Agent': 'KannadaOTTBrowseBot/1.0 (contact: preetham@gmail.com)' },
    });
    const infoData = await infoRes.json();
    const infoPages = infoData?.query?.pages || {};
    const infoKey = Object.keys(infoPages)[0];
    const fileUrl = infoPages[infoKey]?.imageinfo?.[0]?.url;

    return fileUrl || null;
  } catch (err) {
    console.error(`Error finding image for ${wikiPage}:`, err.message);
    return null;
  }
}

async function downloadFile(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
}

async function run() {
  console.log(`Starting real poster downloads for ${moviePages.length} movies...`);

  for (const item of moviePages) {
    const dest = path.join(postersDir, `${item.id}.jpg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`✓ [${item.id}] already exists (${fs.statSync(dest).size} bytes)`);
      continue;
    }

    const imgUrl = await fetchImageUrl(item.page);
    if (imgUrl) {
      try {
        await downloadFile(imgUrl, dest);
        console.log(`✓ [${item.id}] Downloaded official poster: ${path.basename(imgUrl)} (${fs.statSync(dest).size} bytes)`);
      } catch (e) {
        console.log(`✗ [${item.id}] Failed downloading ${imgUrl}: ${e.message}`);
      }
    } else {
      console.log(`- [${item.id}] No wiki image found for ${item.page}`);
    }

    // small pause to be polite
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log('Finished downloading official posters!');
}

run();
