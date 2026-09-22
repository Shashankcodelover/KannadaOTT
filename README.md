# 🎬 KannadaOTT: Indian Streaming Discovery & Catalog Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Framework](https://img.shields.io/badge/Next.js-16.3.4%20(Turbopack)-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.8-blue)](https://react.dev)
[![Node.js Tests](https://img.shields.io/badge/Tests-12%2F12%20Passing-brightgreen)](tests/enterpriseMesh.test.js)
[![Catalog](https://img.shields.io/badge/Catalog-52%2B%20Curated%20Titles-orange)](#-curated-cinema-categories)

> **Streaming Discovery Platform for Kannada Cinema**: KannadaOTT provides instant discovery and catalog management for high-rated **ಕನ್ನಡ Originals** and **ಕನ್ನಡ Dubbed** movies across four Indian streaming services: **JioHotstar, Zee5, SonyLIV, and JioCinema**. The application includes direct OTT destination links, TMDB API search with offline-resilient local fallback, a 2-year anti-repeat viewing ledger, an in-memory streaming distribution topology console, and batch CSV/JSON ingestion tools.

---

![KannadaOTT Platform Hero Showcase](platform_hero_showcase.png)

---

## ⚡ Overview & Key Features

Finding Kannada audio tracks across disparate Indian OTT services often presents challenges with generic homepage redirects and inaccurate language tags. KannadaOTT addresses this by providing structured discovery for certified Kannada audio content:

1. **Direct OTT Links**: Provides direct links to movie title pages across JioHotstar, Zee5, SonyLIV, and JioCinema.
2. **Curated & Verified Catalog**: Ships with 52+ curated titles audited for active streaming links, confirmed Kannada audio tracks (original or dubbed), and official YouTube trailer embeds.
3. **TMDB Integration with Local Fallback**: Fetches live movie metadata via TMDB API when an API key is provided, and falls back to the curated local catalog (`lib/catalog.ts`) when the key is absent or network requests fail.
4. **Smart Search & Multi-Param Filtering**: Delivers instant debounced search with filtering by genres, streaming platforms, language tracks (Original vs. Dubbed), rating ranges, and release years.
5. **Detailed Film Specs & Video Previews**: Displays runtimes, ratings, content advisories, video/audio formats, synopses, cast/director info, official trailers, and 30-second scene previews via embedded YouTube players.
6. **2-Year Anti-Repeat Viewing Registry**: Tracks watched, dismissed, and liked films in browser `localStorage` with a 730-day retention window to automatically filter previously viewed titles out of discovery feeds unless saved to recollections.
7. **In-Memory Streaming Distribution Topology**: Provides an operational dashboard (`/mesh`) to manage simulated distribution corridors and streaming platform nodes, compute summary metrics (active vs. severed corridors, audio match rates, average bitrates), and execute 1-click corridor severing/restoration or cascading platform deletions.
8. **Batch Ingestion Studio**: Includes a data upload interface (`/ingest`) to parse and load batch corridor or platform records via CSV and JSON payloads into the in-memory service, complete with execution logging and a confirmation purge tool.
9. **Interactive Sound Feedback**: Generates lightweight UI audio cues via the Web Audio API for interactive clicks, status toggles, and state changes without external audio asset downloads.

---

## 🎛️ Curated Cinema Categories

| Category | Typical Titles | Platforms | Audio Profile |
| :--- | :--- | :--- | :--- |
| **🌟 ಕನ್ನಡ Originals** | 777 Charlie, Sapta Sagaradaache Ello, Badava Rascal, Toby, Daredevil Musthafa | JioCinema, Zee5, JioHotstar, SonyLIV | 5.1 Dolby Atmos / Original Master |
| **🎬 Hindi Hits (Kannada Dubbed)** | 12th Fail, Sam Bahadur, Zara Hatke Zara Bachke, Sirf Ek Bandaa | JioHotstar, Zee5, JioCinema | 5.1 Multi-track Dub |
| **🎭 Tamil Cinema (Kannada Dubbed)** | Garudan, Gargi, Por Thozhil, 2018 | SonyLIV, JioHotstar | Multi-track 5.1 Surround |
| **🌺 Telugu Cinema (Kannada Dubbed)** | Sita Ramam, Hanu-Man, Balagam, RRR | JioHotstar, Zee5, SonyLIV | Stereo / 5.1 Dub |
| **⚡ Curated Genres** | Comedy, Family, Investigation Thriller, Realistic Drama | All Governed Platforms | 1080p FHD / 4K UHD |

---

## 🌐 Streaming Topology & Ingestion Subsystem

The application includes an in-memory service (`lib/ottTopologyService.ts`) and associated UI routes (`/mesh` and `/ingest`) for modeling and managing content distribution routes:

```
+-----------------------------------------------------------------------------------------+
|                               KannadaOTT Topology Service                               |
|                (In-memory model of streaming platforms and content corridors)            |
+-----------------------------+------------------------------------+----------------------+
                              |                                    |
            [NODE-HOTSTAR: JioHotstar India]      [NODE-ZEE5: Zee5 Entertainment]
            Region: ap-south-1 (Mumbai)           Region: ap-south-2 (Hyderabad)
                              |                                    |
            [NODE-SONYLIV: SonyLIV Premium]       [NODE-JIOCINEMA: JioCinema Premium]
            Region: ap-south-1 (Chennai)          Region: ap-south-1 (Delhi NCR)
                              |                                    |
                              +------------------+-----------------+
                                                 |
                                                 v
+-----------------------------------------------------------------------------------------+
|                             Distribution Corridors (Routes)                             |
|          Configured Bitrate | Certified Kannada Audio Track | Active/Severed State      |
+-----------------------------------------------------------------------------------------+
```

### Subsystem Features:
- **Telemetry Overview**: Calculates total corridors, active count, severed count, percentage of corridors with Kannada audio tracks, governed platform count, and calculated average bitrate.
- **Corridor Provisioning**: Allows adding new distribution corridors mapped to registered platform nodes with resolution and bitrate metadata.
- **1-Click Sever & Restore**: Toggles a corridor's status between `ACTIVE` and `SEVERED` via dedicated API endpoints (`/api/topology/corridors/[id]/sever` and `/api/topology/corridors/[id]/restore`).
- **Cascading Platform Deletion**: Deleting a platform node automatically cascades to delete all associated corridors linked to that platform.
- **Batch Ingestion**: Accepts comma-delimited CSV text or JSON arrays to bulk-register corridor and platform records with live terminal log feedback.
- **Corridor Purge & Reset**: Clears corridor collections on demand or restores default seed data via `/api/topology/reset`.

---

## 📸 Visual Showcase Gallery

### 1. KannadaOTT Discovery Portal
![KannadaOTT Home Showcase](screenshots/desktop/01_desktop_kannadaott_home_showcase.png)
*Discovery homepage featuring hero banner, curated category carousels, platform tags, verified audio badges, and 1-click watch tracking.*

### 2. OTT Distribution Topology Console
![OTT Distribution Topology Mesh](screenshots/desktop/02_desktop_ott_distribution_topology_mesh.png)
*Topology dashboard displaying active and severed streaming corridors, registered platform nodes, telemetry summaries, and sever/restore controls.*

### 3. Batch Ingestion Studio & Purge Console
![Enterprise Batch Ingestion Studio](screenshots/desktop/03_desktop_enterprise_batch_ingestion_studio.png)
*Batch ingestion interface for importing CSV and JSON records into the topology service with template presets, execution terminal logs, and purge options.*

### 4. Movie Detail Page & Video Preview Player
![Movie Detail Page](screenshots/desktop/04_desktop_movie_detail_kannada_audio_player.png)
*Film detail view displaying backdrop visuals, audio track indicators, direct streaming buttons, embedded YouTube trailer and key scene clip players, and full cast/crew listings.*

### 5. Smart Search & Multi-Parameter Filter Studio
![Smart Search & Filter Studio](screenshots/desktop/05_desktop_smart_search_filter_studio.png)
*Browse interface with debounced keyword search, multi-genre chips, platform toggles, rating sliders, and responsive poster grid.*

### 6. 2-Year Anti-Repeat Viewing Ledger
![Watched Drafts Ledger](screenshots/desktop/06_desktop_watched_drafts_ledger.png)
*Viewing registry showing watched, liked (recollections), and purged movies with 730-day retention countdowns and restore options.*

---

## 🧪 Automated Testing Suite

KannadaOTT includes a native Node.js test runner suite covering the in-memory topology service and ingestion workflows:

```bash
node --test tests/enterpriseMesh.test.js
```

### Verified Test Suite Output:
```
▶ KannadaOTT Enterprise Streaming Topology & Ingestion Test Suite
  ✔ 1. should seed default streaming platforms with widevine L1 DRM security (2.08ms)
  ✔ 2. should compute live telemetry including 100% verified Kannada audio certification (0.88ms)
  ✔ 3. should provision a new content distribution corridor bound to an active platform (0.67ms)
  ✔ 4. should reject provisioning a corridor targeting a non-existent platform node (4.46ms)
  ✔ 5. should execute 1-click corridor severing and reflect in real-time telemetry (1.59ms)
  ✔ 6. should execute 1-click corridor restoration to restore active streaming (1.24ms)
  ✔ 7. should delete a single corridor and verify referential continuity (0.75ms)
  ✔ 8. should execute cascading deletion when a platform node is eliminated (1.07ms)
  ✔ 9. should ingest batch distribution corridors via RFC 4180 CSV format (2.45ms)
  ✔ 10. should ingest batch distribution corridors via structured JSON format (1.51ms)
  ✔ 11. should execute universal corridor cascade purge and reset baseline state (0.48ms)
✔ KannadaOTT Enterprise Streaming Topology & Ingestion Test Suite (24.1ms)
ℹ tests 12
ℹ suites 0
ℹ pass 12
ℹ fail 0
```

### Catalog QA Verification Script:
```bash
npm run test:qa
```
*Validates curated catalog streaming links, inspects page titles against mismatches, and verifies YouTube trailer oEmbed availability.*

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.3.4 (App Router, Turbopack)
- **Library**: React 19.2.8 & React DOM 19.2.8
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 & PostCSS
- **Animations**: Framer Motion 13.4.0
- **Audio Synthesis**: Native Web Audio API
- **Testing**: Node.js Native Test Runner (`node:test`, `node:assert/strict`) & Playwright 1.63.0

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation
```bash
git clone https://github.com/Shashankcodelover/KannadaOTT.git
cd KannadaOTT
npm install
```

### Environment Configuration (Optional)
Copy `.env.example` to `.env.local` to configure a TMDB API key:
```bash
cp .env.example .env.local
```
*Note: If no TMDB API key is provided, the application automatically uses the curated 52+ movie catalog (`lib/catalog.ts`).*

### Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

### Run Tests
```bash
npm test # or: node --test tests/enterpriseMesh.test.js
```

---

## 📜 License
MIT License.
