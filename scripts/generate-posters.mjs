import fs from 'fs';
import path from 'path';

const postersDir = path.resolve('public/posters');
if (!fs.existsSync(postersDir)) {
  fs.mkdirSync(postersDir, { recursive: true });
}

const movies = [
  {
    id: 101,
    title: '777 Charlie',
    kannadaTitle: '೭೭೭ ಚಾರ್ಲಿ',
    emoji: '🐕',
    bg1: '#1e1b4b',
    bg2: '#312e81',
    accent: '#f59e0b',
    year: '2022',
    rating: '8.8',
    ott: 'JioCinema',
    ottColor: '#0082EF',
    type: 'ಕನ್ನಡ Original',
    genre: 'Comedy • Family • Drama',
  },
  {
    id: 102,
    title: 'Sapta Sagaradaache Ello - Side A',
    kannadaTitle: 'ಸಪ್ತ ಸಾಗರದಾಚೆ ಎಲ್ಲೋ',
    emoji: '🌊',
    bg1: '#022c22',
    bg2: '#064e3b',
    accent: '#10b981',
    year: '2023',
    rating: '8.4',
    ott: 'Zee5',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Original',
    genre: 'Realistic Romance • Drama',
  },
  {
    id: 103,
    title: 'Sapta Sagaradaache Ello - Side B',
    kannadaTitle: 'ಸಪ್ತ ಸಾಗರದಾಚೆ ಎಲ್ಲೋ (Side B)',
    emoji: '🌊',
    bg1: '#18181b',
    bg2: '#27272a',
    accent: '#ef4444',
    year: '2023',
    rating: '8.2',
    ott: 'Zee5',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Original',
    genre: 'Intense Romance • Drama',
  },
  {
    id: 104,
    title: 'Hostel Hudugaru Bekagiddare',
    kannadaTitle: 'ಹಾಸ್ಟೆಲ್ ಹುಡುಗರು ಬೇಕಾಗಿದ್ದಾರೆ',
    emoji: '🎓',
    bg1: '#431407',
    bg2: '#7c2d12',
    accent: '#f97316',
    year: '2023',
    rating: '8.1',
    ott: 'Zee5',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Original',
    genre: 'Madcap Youth Comedy',
  },
  {
    id: 105,
    title: 'Daredevil Musthafa',
    kannadaTitle: 'ಡೇರ್‌ಡೆವಿಲ್ ಮುಸ್ತಾಫಾ',
    emoji: '🏏',
    bg1: '#14532d',
    bg2: '#166534',
    accent: '#22c55e',
    year: '2023',
    rating: '8.5',
    ott: 'Zee5',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Original',
    genre: 'College Comedy • Harmony',
  },
  {
    id: 106,
    title: 'Ratnan Prapancha',
    kannadaTitle: 'ರತ್ನನ್ ಪ್ರಪಂಚ',
    emoji: '🧳',
    bg1: '#3b0764',
    bg2: '#581c87',
    accent: '#c084fc',
    year: '2021',
    rating: '8.3',
    ott: 'Zee5',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Original',
    genre: 'Feel-Good Family • Comedy',
  },
  {
    id: 107,
    title: 'Badava Rascal',
    kannadaTitle: 'ಬಡವ ರಾಸ್ಕಲ್',
    emoji: '🛵',
    bg1: '#701a75',
    bg2: '#86198f',
    accent: '#f472b6',
    year: '2021',
    rating: '7.6',
    ott: 'Zee5',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Original',
    genre: 'Middle Class Friendship Comedy',
  },
  {
    id: 108,
    title: 'Gandhada Gudi',
    kannadaTitle: 'ಗಂಧದ ಗುಡಿ',
    emoji: '🌲',
    bg1: '#064e3b',
    bg2: '#047857',
    accent: '#34d399',
    year: '2022',
    rating: '8.9',
    ott: 'JioHotstar',
    ottColor: '#0B76DA',
    type: 'ಕನ್ನಡ Original',
    genre: 'Nature Journey • Puneeth Rajkumar',
  },
  {
    id: 109,
    title: 'Toby',
    kannadaTitle: 'ಟೋಬಿ',
    emoji: '🩸',
    bg1: '#450a0a',
    bg2: '#7f1d1d',
    accent: '#f87171',
    year: '2023',
    rating: '7.7',
    ott: 'SonyLIV',
    ottColor: '#4A90D9',
    type: 'ಕನ್ನಡ Original',
    genre: 'Coastal Karnataka Drama',
  },
  {
    id: 110,
    title: 'Kaatera',
    kannadaTitle: 'ಕಾಟೇರ',
    emoji: '⚔️',
    bg1: '#292524',
    bg2: '#44403c',
    accent: '#eab308',
    year: '2023',
    rating: '7.9',
    ott: 'Zee5',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Original',
    genre: 'Rural Social Drama',
  },
  {
    id: 201,
    title: '12th Fail',
    kannadaTitle: '೧೨th ಫೇಲ್ (ಕನ್ನಡ ಆವೃತ್ತಿ)',
    emoji: '📚',
    bg1: '#1e293b',
    bg2: '#0f172a',
    accent: '#38bdf8',
    year: '2023',
    rating: '9.0',
    ott: 'JioHotstar',
    ottColor: '#0B76DA',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'UPSC Aspirant Inspiring Drama',
  },
  {
    id: 202,
    title: 'Zara Hatke Zara Bachke',
    kannadaTitle: 'ಜರಾ ಹಟ್ಕೆ ಜರಾ ಬಚ್ಕೆ',
    emoji: '🏠',
    bg1: '#831843',
    bg2: '#9d174d',
    accent: '#f43f5e',
    year: '2023',
    rating: '7.2',
    ott: 'JioCinema',
    ottColor: '#0082EF',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Indore Marriage Comedy',
  },
  {
    id: 203,
    title: 'Sam Bahadur',
    kannadaTitle: 'ಸ್ಯಾಮ್ ಬಹದ್ದೂರ್',
    emoji: '🎖️',
    bg1: '#1c1917',
    bg2: '#292524',
    accent: '#fbbf24',
    year: '2023',
    rating: '8.0',
    ott: 'Zee5',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Field Marshal Biopic',
  },
  {
    id: 204,
    title: 'Sirf Ek Bandaa Kaafi Hai',
    kannadaTitle: 'ಸಿರ್ಫ್ ಏಕ್ ಬಂದಾ ಕಾಫಿ ಹೈ',
    emoji: '⚖️',
    bg1: '#1e1b4b',
    bg2: '#312e81',
    accent: '#818cf8',
    year: '2023',
    rating: '8.3',
    ott: 'Zee5',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Courageous Courtroom Drama',
  },
  {
    id: 205,
    title: 'Tarla',
    kannadaTitle: 'ತರ್ಲಾ (ಕನ್ನಡ)',
    emoji: '🍲',
    bg1: '#713f12',
    bg2: '#854d0e',
    accent: '#facc15',
    year: '2023',
    rating: '7.5',
    ott: 'Zee5',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Home Chef Feel-Good Story',
  },
  {
    id: 206,
    title: 'Bhediya',
    kannadaTitle: 'ಭೇಡಿಯಾ (ಕನ್ನಡ)',
    emoji: '🐺',
    bg1: '#09090b',
    bg2: '#18181b',
    accent: '#a855f7',
    year: '2022',
    rating: '7.3',
    ott: 'JioCinema',
    ottColor: '#0082EF',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Jungle Creature Comedy',
  },
  {
    id: 301,
    title: 'Premalu',
    kannadaTitle: 'ಪ್ರೇಮಲು (ಕನ್ನಡ ಆವೃತ್ತಿ)',
    emoji: '💖',
    bg1: '#881337',
    bg2: '#9f1239',
    accent: '#fb7185',
    year: '2024',
    rating: '8.6',
    ott: 'JioHotstar',
    ottColor: '#0B76DA',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Hyderabad Rom-Com Blockbuster',
  },
  {
    id: 302,
    title: 'Manjummel Boys',
    kannadaTitle: 'ಮಂಜುಮ್ಮೆಲ್ ಬಾಯ್ಸ್',
    emoji: '⛰️',
    bg1: '#0f172a',
    bg2: '#1e293b',
    accent: '#38bdf8',
    year: '2024',
    rating: '8.7',
    ott: 'JioHotstar',
    ottColor: '#0B76DA',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'True Friendship Survival Story',
  },
  {
    id: 303,
    title: 'Gargi',
    kannadaTitle: 'ಗಾರ್ಗಿ (ಕನ್ನಡ)',
    emoji: '👩‍🏫',
    bg1: '#312e81',
    bg2: '#3730a3',
    accent: '#a5b4fc',
    year: '2022',
    rating: '8.2',
    ott: 'SonyLIV',
    ottColor: '#4A90D9',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Hard-hitting Social Drama',
  },
  {
    id: 304,
    title: 'Por Thozhil',
    kannadaTitle: 'ಪೋರ್ ತೋಳಿಲ್',
    emoji: '🔍',
    bg1: '#111827',
    bg2: '#1f2937',
    accent: '#fb923c',
    year: '2023',
    rating: '8.4',
    ott: 'SonyLIV',
    ottColor: '#4A90D9',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Masterclass Detective Thriller',
  },
  {
    id: 305,
    title: '2018: Everyone is a Hero',
    kannadaTitle: '೨೦೧೮: ಎವರಿವನ್ ಈಸ್ ಎ ಹೀರೋ',
    emoji: '🚁',
    bg1: '#083344',
    bg2: '#155e75',
    accent: '#22d3ee',
    year: '2023',
    rating: '8.5',
    ott: 'SonyLIV',
    ottColor: '#4A90D9',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Real Flood Rescue Bravery',
  },
  {
    id: 401,
    title: 'Sita Ramam',
    kannadaTitle: 'ಸೀತಾ ರಾಮಮ್ (ಕನ್ನಡ)',
    emoji: '💌',
    bg1: '#4a044e',
    bg2: '#701a75',
    accent: '#e879f9',
    year: '2022',
    rating: '8.6',
    ott: 'JioHotstar',
    ottColor: '#0B76DA',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Classic Poetic Romance',
  },
  {
    id: 402,
    title: 'Hanu-Man',
    kannadaTitle: 'ಹನು-ಮಾನ್ (ಕನ್ನಡ ಆವೃತ್ತಿ)',
    emoji: '⚡',
    bg1: '#7c2d12',
    bg2: '#9a3412',
    accent: '#fb923c',
    year: '2024',
    rating: '8.1',
    ott: 'Zee5 / JioCinema',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Mythological Superhero Family',
  },
  {
    id: 403,
    title: 'Balagam',
    kannadaTitle: 'ಬಳಗಂ (ಕನ್ನಡ)',
    emoji: '🌾',
    bg1: '#365314',
    bg2: '#4d7c0f',
    accent: '#a3e635',
    year: '2023',
    rating: '8.4',
    ott: 'JioHotstar',
    ottColor: '#0B76DA',
    type: 'ಕನ್ನಡ Dubbed Available',
    genre: 'Village Roots Family Drama',
  },
  {
    id: 501,
    title: 'Kantara: Chapter 1',
    kannadaTitle: 'ಕಾಂತಾರ: ಚಾಪ್ಟರ್ ೧',
    emoji: '🔥',
    bg1: '#262626',
    bg2: '#404040',
    accent: '#f59e0b',
    year: '2025',
    rating: '8.9',
    ott: 'Coming Soon',
    ottColor: '#f59e0b',
    type: 'ಕನ್ನಡ Original',
    genre: 'Kadamba Era Prequel',
  },
  {
    id: 502,
    title: 'Uttarakaanda',
    kannadaTitle: 'ಉತ್ತರಕಾಂಡ',
    emoji: '🕶️',
    bg1: '#18181b',
    bg2: '#27272a',
    accent: '#e11d48',
    year: '2025',
    rating: '8.3',
    ott: 'Coming Soon',
    ottColor: '#e11d48',
    type: 'ಕನ್ನಡ Original',
    genre: 'Retro Gangster Comedy',
  },
  // ─── SUPERSTAR SPOTLIGHTS (KANNADA DUBBED) ────────────────────────
  {
    id: 601,
    title: 'RRR',
    kannadaTitle: 'ಆರ್ ಆರ್ ಆರ್ (ಕನ್ನಡ)',
    emoji: '🐅',
    bg1: '#7c2d12',
    bg2: '#991b1b',
    accent: '#ea580c',
    year: '2022',
    rating: '8.8',
    ott: 'Zee5 / Hotstar',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Dubbed (Jr. NTR)',
    genre: 'Revolutionary Epic • SS Rajamouli',
  },
  {
    id: 602,
    title: 'Devara: Part 1',
    kannadaTitle: 'ದೇವರ: ಪಾರ್ಟ್ ೧ (ಕನ್ನಡ)',
    emoji: '🌊',
    bg1: '#0c4a6e',
    bg2: '#082f49',
    accent: '#38bdf8',
    year: '2024',
    rating: '7.8',
    ott: 'JioHotstar',
    ottColor: '#0B76DA',
    type: 'ಕನ್ನಡ Dubbed (Jr. NTR)',
    genre: 'Coastal Action Drama • Jr. NTR',
  },
  {
    id: 603,
    title: 'Leo',
    kannadaTitle: 'ಲಿಯೋ (ಕನ್ನಡ ಆವೃತ್ತಿ)',
    emoji: '🍫',
    bg1: '#312e81',
    bg2: '#1e1b4b',
    accent: '#a855f7',
    year: '2023',
    rating: '7.9',
    ott: 'SonyLIV',
    ottColor: '#4A90D9',
    type: 'ಕನ್ನಡ Dubbed (Vijay)',
    genre: 'LCU Action Thriller • Thalapathy',
  },
  {
    id: 604,
    title: 'Varisu',
    kannadaTitle: 'ವಾರಿಸು (ಕನ್ನಡ ಆವೃತ್ತಿ)',
    emoji: '👔',
    bg1: '#064e3b',
    bg2: '#022c22',
    accent: '#34d399',
    year: '2023',
    rating: '7.4',
    ott: 'Zee5',
    ottColor: '#7B2D8B',
    type: 'ಕನ್ನಡ Dubbed (Vijay)',
    genre: 'Family Entertainer • Thalapathy Vijay',
  },
  {
    id: 605,
    title: 'Guntur Kaaram',
    kannadaTitle: 'ಗುಂಟೂರು ಖಾರಂ (ಕನ್ನಡ)',
    emoji: '🌶️',
    bg1: '#831843',
    bg2: '#500724',
    accent: '#f43f5e',
    year: '2024',
    rating: '7.3',
    ott: 'JioHotstar',
    ottColor: '#0B76DA',
    type: 'ಕನ್ನಡ Dubbed (Mahesh Babu)',
    genre: 'Family Drama • Super Star Mahesh',
  },
  {
    id: 606,
    title: 'Sarkaru Vaari Paata',
    kannadaTitle: 'ಸರ್ಕಾರು ವಾರಿ ಪಾಟ (ಕನ್ನಡ)',
    emoji: '🏦',
    bg1: '#14532d',
    bg2: '#052e16',
    accent: '#22c55e',
    year: '2022',
    rating: '7.2',
    ott: 'JioCinema',
    ottColor: '#0082EF',
    type: 'ಕನ್ನಡ Dubbed (Mahesh Babu)',
    genre: 'Action Comedy • Mahesh Babu',
  },
  {
    id: 607,
    title: 'Saindhav',
    kannadaTitle: 'ಸೈಂಧವ್ (ಕನ್ನಡ ಆವೃತ್ತಿ)',
    emoji: '🔫',
    bg1: '#18181b',
    bg2: '#09090b',
    accent: '#f59e0b',
    year: '2024',
    rating: '7.5',
    ott: 'SonyLIV',
    ottColor: '#4A90D9',
    type: 'ಕನ್ನಡ Dubbed (Venkatesh)',
    genre: 'Emotional Action • Victory Venkatesh',
  },
  {
    id: 608,
    title: 'F3: Fun and Frustration',
    kannadaTitle: 'ಎಫ್ ೩: ಫನ್ & ಫ್ರಸ್ಟ್ರೇಷನ್ (ಕನ್ನಡ)',
    emoji: '💵',
    bg1: '#701a75',
    bg2: '#4a044e',
    accent: '#f472b6',
    year: '2022',
    rating: '7.6',
    ott: 'SonyLIV',
    ottColor: '#4A90D9',
    type: 'ಕನ್ನಡ Dubbed (Venkatesh)',
    genre: 'Non-Stop Family Comedy • Venkatesh',
  },
];

for (const m of movies) {
  const isOriginal = m.type.includes('Original');
  const badgeBg = isOriginal ? '#f97316' : '#059669';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750" fill="none">
  <defs>
    <linearGradient id="bg-${m.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${m.bg1}"/>
      <stop offset="60%" stop-color="${m.bg2}"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>
    <radialGradient id="glow-${m.id}" cx="50%" cy="35%" r="40%">
      <stop offset="0%" stop-color="${m.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="overlay-${m.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.2"/>
      <stop offset="50%" stop-color="#000000" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.95"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="500" height="750" fill="url(#bg-${m.id})"/>
  <rect width="500" height="750" fill="url(#glow-${m.id})"/>
  <rect width="500" height="750" fill="url(#overlay-${m.id})"/>
  
  <!-- Outer border -->
  <rect x="14" y="14" width="472" height="722" rx="18" stroke="${m.accent}" stroke-opacity="0.3" stroke-width="2"/>

  <!-- Language Badge -->
  <rect x="30" y="32" width="165" height="30" rx="15" fill="${badgeBg}"/>
  <text x="112" y="52" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" text-anchor="middle" fill="#ffffff">
    ${m.type}
  </text>

  <!-- Rating Badge -->
  <rect x="385" y="32" width="85" height="30" rx="15" fill="#000000" fill-opacity="0.75" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="427" y="52" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" text-anchor="middle" fill="#fbbf24">
    ★ ${m.rating}
  </text>

  <!-- Visual Center Icon -->
  <circle cx="250" cy="270" r="85" fill="#000000" fill-opacity="0.4" stroke="${m.accent}" stroke-width="3" stroke-dasharray="6 4"/>
  <text x="250" y="295" font-family="system-ui, -apple-system, sans-serif" font-size="75" text-anchor="middle">
    ${m.emoji}
  </text>

  <!-- Quality Badges -->
  <g transform="translate(135, 385)">
    <rect x="0" y="0" width="65" height="22" rx="6" fill="#27272a" fill-opacity="0.9"/>
    <text x="32" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle" fill="#e4e4e7">U/A 13+</text>

    <rect x="75" y="0" width="75" height="22" rx="6" fill="#27272a" fill-opacity="0.9"/>
    <text x="112" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle" fill="#38bdf8">4K UHD</text>

    <rect x="160" y="0" width="75" height="22" rx="6" fill="#27272a" fill-opacity="0.9"/>
    <text x="197" y="15" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle" fill="#34d399">Dolby 5.1</text>
  </g>

  <!-- Kannada Title -->
  <text x="250" y="460" font-family="system-ui, 'Noto Sans Kannada', sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="${m.accent}">
    ${m.kannadaTitle}
  </text>

  <!-- English Title -->
  <text x="250" y="505" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" text-anchor="middle" fill="#ffffff">
    ${m.title.length > 22 ? m.title.substring(0, 22) + '...' : m.title}
  </text>

  <!-- Genre & Year -->
  <text x="250" y="540" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#d4d4d8">
    ${m.genre} • ${m.year}
  </text>

  <!-- Audio Verification Tag -->
  <rect x="130" y="565" width="240" height="28" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="1.2"/>
  <text x="250" y="583" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="#7dd3fc">
    🔊 Audio: ಕನ್ನಡ (Kannada) Verified
  </text>

  <!-- Watch Button / OTT Strip -->
  <rect x="40" y="625" width="420" height="60" rx="14" fill="${m.ottColor}" fill-opacity="0.25" stroke="${m.ottColor}" stroke-width="2"/>
  <text x="250" y="662" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="800" text-anchor="middle" fill="#ffffff">
    ▶ Watch on ${m.ott}
  </text>
</svg>`;

  fs.writeFileSync(path.join(postersDir, `${m.id}.svg`), svg, 'utf-8');
}

console.log(`Generated ${movies.length} local SVG movie posters in public/posters!`);
