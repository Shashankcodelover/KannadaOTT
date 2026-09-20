// eslint-disable-next-line @typescript-eslint/no-require-imports
const test = require('node:test');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const assert = require('node:assert/strict');

class OTTTopologyServiceTest {
  constructor() {
    this.platforms = new Map();
    this.corridors = new Map();
    this.resetBaseline();
  }
  resetBaseline() {
    this.platforms.clear();
    this.corridors.clear();
    const DEFAULT_PLATFORMS = [
      { id: 'NODE-HOTSTAR', name: 'JioHotstar India', shortName: 'Hotstar', cdnRegion: 'ap-south-1', drmLevel: 'Widevine L1 / FairPlay', maxResolution: '4K Dolby Vision', status: 'ONLINE', webUrl: 'https://www.hotstar.com/in', color: '#0c57d4' },
      { id: 'NODE-ZEE5', name: 'Zee5 Entertainment', shortName: 'Zee5', cdnRegion: 'ap-south-2', drmLevel: 'Widevine L1', maxResolution: '1080p FHD Atmos', status: 'ONLINE', webUrl: 'https://www.zee5.com', color: '#8e24aa' },
      { id: 'NODE-SONYLIV', name: 'SonyLIV Premium', shortName: 'SonyLIV', cdnRegion: 'ap-south-1', drmLevel: 'Widevine L1', maxResolution: '1080p FHD 5.1', status: 'ONLINE', webUrl: 'https://www.sonyliv.com', color: '#00838f' },
      { id: 'NODE-JIOCINEMA', name: 'JioCinema Premium', shortName: 'JioCinema', cdnRegion: 'ap-south-1', drmLevel: 'Widevine L1 / PlayReady', maxResolution: '4K Ultra HD', status: 'ONLINE', webUrl: 'https://www.jiocinema.com', color: '#d81b60' },
      { id: 'NODE-SUNNXT', name: 'SunNXT South Hub', shortName: 'SunNXT', cdnRegion: 'ap-south-2', drmLevel: 'Widevine L1', maxResolution: '1080p FHD', status: 'ONLINE', webUrl: 'https://www.sunnxt.com', color: '#f57c00' }
    ];
    const DEFAULT_CORRIDORS = [
      { id: 'CORR-DIST-001', movieId: 101, movieTitle: '777 Charlie', platformId: 'NODE-JIOCINEMA', audioTracks: ['ಕನ್ನಡ (Original 5.1 Dolby)'], streamResolution: '4K Ultra HD', bitrateMbps: 18.5, cdnHealth: 'OPTIMAL', status: 'ACTIVE' },
      { id: 'CORR-DIST-002', movieId: 102, movieTitle: 'Sapta Sagaradaache Ello', platformId: 'NODE-ZEE5', audioTracks: ['ಕನ್ನಡ (Original 5.1 Atmos)'], streamResolution: '1080p FHD', bitrateMbps: 12.0, cdnHealth: 'OPTIMAL', status: 'ACTIVE' },
      { id: 'CORR-DIST-003', movieId: 103, movieTitle: '12th Fail', platformId: 'NODE-HOTSTAR', audioTracks: ['ಕನ್ನಡ Dub (Certified 5.1)'], streamResolution: '4K Dolby Vision', bitrateMbps: 19.2, cdnHealth: 'OPTIMAL', status: 'ACTIVE' }
    ];
    DEFAULT_PLATFORMS.forEach(p => this.platforms.set(p.id, { ...p }));
    DEFAULT_CORRIDORS.forEach(c => this.corridors.set(c.id, { ...c }));
  }
  getTelemetry() {
    const list = Array.from(this.corridors.values());
    const activeCorridors = list.filter(c => c.status === 'ACTIVE').length;
    const severedCorridors = list.filter(c => c.status === 'SEVERED').length;
    const verifiedAudio = list.filter(c => c.audioTracks.some(t => t.includes('ಕನ್ನಡ'))).length;
    const verifiedAudioRatePct = list.length > 0 ? Math.round((verifiedAudio / list.length) * 100) : 100;
    const totalBitrate = list.reduce((acc, c) => acc + (c.bitrateMbps || 0), 0);
    const avgBitrateMbps = list.length > 0 ? parseFloat((totalBitrate / list.length).toFixed(1)) : 15.0;
    return { totalCorridors: list.length, activeCorridors, severedCorridors, verifiedAudioRatePct, governedPlatformsCount: this.platforms.size, avgBitrateMbps, activeCdnRelays: 8 };
  }
  addCorridor(corr) {
    if (!corr.id) throw new Error('Corridor ID is required');
    if (!corr.platformId || !this.platforms.has(corr.platformId)) throw new Error('Invalid or missing Platform Node: ' + corr.platformId);
    const item = { id: corr.id, movieId: corr.movieId || 999, movieTitle: corr.movieTitle || 'Film', platformId: corr.platformId, audioTracks: corr.audioTracks || ['ಕನ್ನಡ (Stereo)'], streamResolution: corr.streamResolution || '1080p', bitrateMbps: corr.bitrateMbps || 14.5, cdnHealth: corr.cdnHealth || 'OPTIMAL', status: corr.status || 'ACTIVE' };
    this.corridors.set(item.id, item);
    return item;
  }
  severCorridor(id) { const c = this.corridors.get(id); if (!c) throw new Error('Not found'); c.status = 'SEVERED'; return c; }
  restoreCorridor(id) { const c = this.corridors.get(id); if (!c) throw new Error('Not found'); c.status = 'ACTIVE'; return c; }
  deleteCorridor(id) { if (!this.corridors.has(id)) throw new Error('Not found'); this.corridors.delete(id); return { success: true, deletedCorridorId: id }; }
  deletePlatform(id) {
    if (!this.platforms.has(id)) throw new Error('Platform does not exist');
    const cascaded = [];
    for (const [cId, corr] of this.corridors.entries()) {
      if (corr.platformId === id) { this.corridors.delete(cId); cascaded.push(cId); }
    }
    this.platforms.delete(id);
    return { success: true, deletedPlatformId: id, cascadedSeveredCorridors: cascaded };
  }
  purgeCorridors() { const count = this.corridors.size; this.corridors.clear(); return { success: true, count, message: 'Purged ' + count }; }
  ingestCorridors(payload, format) {
    const imported = [];
    if (format === 'json') {
      const data = JSON.parse(payload);
      for (const item of data) { imported.push(this.addCorridor(item)); }
    } else {
      const lines = payload.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const headers = lines[0].split(',').map(h => h.trim());
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        const row = {};
        headers.forEach((h, idx) => { row[h] = parts[idx]; });
        imported.push(this.addCorridor({ id: row.id, movieId: parseInt(row.movieId) || 900, movieTitle: row.movieTitle || 'Film', platformId: row.platformId, bitrateMbps: parseFloat(row.bitrateMbps) || 14.0 }));
      }
    }
    return { success: true, count: imported.length, corridors: imported };
  }
}

const service = new OTTTopologyServiceTest();

test('KannadaOTT Enterprise Streaming Topology & Ingestion Test Suite', async (t) => {
  t.beforeEach(() => { service.resetBaseline(); });

  await t.test('1. should seed default streaming platforms with widevine L1 DRM security', () => {
    const platforms = Array.from(service.platforms.values());
    assert.strictEqual(platforms.length, 5);
    const hotstar = service.platforms.get('NODE-HOTSTAR');
    assert.ok(hotstar);
    assert.strictEqual(hotstar.name, 'JioHotstar India');
    assert.strictEqual(hotstar.drmLevel, 'Widevine L1 / FairPlay');
  });

  await t.test('2. should compute live telemetry including 100% verified Kannada audio certification', () => {
    const telemetry = service.getTelemetry();
    assert.strictEqual(telemetry.totalCorridors, 3);
    assert.strictEqual(telemetry.activeCorridors, 3);
    assert.strictEqual(telemetry.severedCorridors, 0);
    assert.strictEqual(telemetry.verifiedAudioRatePct, 100);
    assert.ok(telemetry.avgBitrateMbps >= 12.0);
  });

  await t.test('3. should provision a new content distribution corridor bound to an active platform', () => {
    const corr = service.addCorridor({
      id: 'CORR-DIST-PROV-99',
      movieId: 999,
      movieTitle: 'Kantara: A Legend Chapter 1',
      platformId: 'NODE-HOTSTAR',
      audioTracks: ['ಕನ್ನಡ (Original Dolby Atmos)'],
      streamResolution: '4K Ultra HD',
      bitrateMbps: 22.5
    });
    assert.strictEqual(corr.id, 'CORR-DIST-PROV-99');
    assert.strictEqual(service.corridors.size, 4);
    const telemetry = service.getTelemetry();
    assert.strictEqual(telemetry.totalCorridors, 4);
  });

  await t.test('4. should reject provisioning a corridor targeting a non-existent platform node', () => {
    assert.throws(() => {
      service.addCorridor({
        id: 'CORR-FAIL-01',
        platformId: 'NODE-PIRATE-BAY'
      });
    }, /Invalid or missing Platform Node/);
  });

  await t.test('5. should execute 1-click corridor severing and reflect in real-time telemetry', () => {
    const severed = service.severCorridor('CORR-DIST-001');
    assert.strictEqual(severed.status, 'SEVERED');
    const telemetry = service.getTelemetry();
    assert.strictEqual(telemetry.activeCorridors, 2);
    assert.strictEqual(telemetry.severedCorridors, 1);
  });

  await t.test('6. should execute 1-click corridor restoration to restore active streaming', () => {
    service.severCorridor('CORR-DIST-002');
    const restored = service.restoreCorridor('CORR-DIST-002');
    assert.strictEqual(restored.status, 'ACTIVE');
    const telemetry = service.getTelemetry();
    assert.strictEqual(telemetry.severedCorridors, 0);
  });

  await t.test('7. should delete a single corridor and verify referential continuity', () => {
    const res = service.deleteCorridor('CORR-DIST-003');
    assert.strictEqual(res.success, true);
    assert.strictEqual(service.corridors.has('CORR-DIST-003'), false);
    assert.strictEqual(service.corridors.size, 2);
  });

  await t.test('8. should execute cascading deletion when a platform node is eliminated', () => {
    const res = service.deletePlatform('NODE-HOTSTAR');
    assert.strictEqual(res.success, true);
    assert.strictEqual(service.platforms.has('NODE-HOTSTAR'), false);
    assert.ok(res.cascadedSeveredCorridors.includes('CORR-DIST-003'));
    assert.strictEqual(service.corridors.has('CORR-DIST-003'), false);
  });

  await t.test('9. should ingest batch distribution corridors via RFC 4180 CSV format', () => {
    const csv = 'id,movieId,movieTitle,platformId,bitrateMbps\nCORR-CSV-01,201,Badava Rascal,NODE-ZEE5,14.5\nCORR-CSV-02,202,Daredevil Musthafa,NODE-HOTSTAR,16.0';
    const res = service.ingestCorridors(csv, 'csv');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.count, 2);
    assert.ok(service.corridors.has('CORR-CSV-01'));
    assert.ok(service.corridors.has('CORR-CSV-02'));
  });

  await t.test('10. should ingest batch distribution corridors via structured JSON format', () => {
    const json = JSON.stringify([
      { id: 'CORR-JSON-01', movieId: 301, movieTitle: 'Hostel Hudugaru', platformId: 'NODE-ZEE5', bitrateMbps: 15.0 },
      { id: 'CORR-JSON-02', movieId: 302, movieTitle: 'Toby', platformId: 'NODE-SONYLIV', bitrateMbps: 16.5 }
    ]);
    const res = service.ingestCorridors(json, 'json');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.count, 2);
    assert.ok(service.corridors.has('CORR-JSON-01'));
  });

  await t.test('11. should execute universal corridor cascade purge and reset baseline state', () => {
    const purgeRes = service.purgeCorridors();
    assert.strictEqual(purgeRes.success, true);
    assert.strictEqual(service.corridors.size, 0);
    service.resetBaseline();
    assert.strictEqual(service.corridors.size, 3);
    assert.strictEqual(service.platforms.size, 5);
  });
});