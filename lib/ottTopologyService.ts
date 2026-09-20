// KannadaOTT Relational Topology & Batch Ingestion Service
export interface PlatformNode {
  id: string;
  name: string;
  shortName: string;
  cdnRegion: string;
  drmLevel: string;
  maxResolution: string;
  status: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
  webUrl: string;
  color: string;
}

export interface DistributionCorridor {
  id: string;
  movieId: number;
  movieTitle: string;
  platformId: string;
  audioTracks: string[];
  streamResolution: string;
  bitrateMbps: number;
  cdnHealth: 'OPTIMAL' | 'DEGRADED';
  status: 'ACTIVE' | 'SEVERED';
  directUrl: string;
  createdAt: string;
}

export interface TopologyTelemetry {
  totalCorridors: number;
  activeCorridors: number;
  severedCorridors: number;
  verifiedAudioRatePct: number;
  governedPlatformsCount: number;
  avgBitrateMbps: number;
  activeCdnRelays: number;
  timestamp: string;
}

const DEFAULT_PLATFORMS: PlatformNode[] = [
  { id: 'NODE-HOTSTAR', name: 'JioHotstar India', shortName: 'Hotstar', cdnRegion: 'ap-south-1 (Mumbai)', drmLevel: 'Widevine L1 / FairPlay', maxResolution: '4K Dolby Vision', status: 'ONLINE', webUrl: 'https://www.hotstar.com/in', color: '#0c57d4' },
  { id: 'NODE-ZEE5', name: 'Zee5 Entertainment', shortName: 'Zee5', cdnRegion: 'ap-south-2 (Hyderabad)', drmLevel: 'Widevine L1', maxResolution: '1080p FHD Atmos', status: 'ONLINE', webUrl: 'https://www.zee5.com', color: '#8e24aa' },
  { id: 'NODE-SONYLIV', name: 'SonyLIV Premium', shortName: 'SonyLIV', cdnRegion: 'ap-south-1 (Chennai)', drmLevel: 'Widevine L1', maxResolution: '1080p FHD 5.1', status: 'ONLINE', webUrl: 'https://www.sonyliv.com', color: '#00838f' },
  { id: 'NODE-JIOCINEMA', name: 'JioCinema Premium', shortName: 'JioCinema', cdnRegion: 'ap-south-1 (Delhi NCR)', drmLevel: 'Widevine L1 / PlayReady', maxResolution: '4K Ultra HD', status: 'ONLINE', webUrl: 'https://www.jiocinema.com', color: '#d81b60' },
  { id: 'NODE-SUNNXT', name: 'SunNXT South Hub', shortName: 'SunNXT', cdnRegion: 'ap-south-2 (Bangalore)', drmLevel: 'Widevine L1', maxResolution: '1080p FHD', status: 'ONLINE', webUrl: 'https://www.sunnxt.com', color: '#f57c00' }
];

const DEFAULT_CORRIDORS: DistributionCorridor[] = [
  { id: 'CORR-DIST-001', movieId: 101, movieTitle: '777 Charlie', platformId: 'NODE-JIOCINEMA', audioTracks: ['ಕನ್ನಡ (Original 5.1 Dolby)', 'Hindi Dub', 'Tamil Dub'], streamResolution: '4K Ultra HD', bitrateMbps: 18.5, cdnHealth: 'OPTIMAL', status: 'ACTIVE', directUrl: 'https://www.jiocinema.com/movies/777-charlie/3762888', createdAt: new Date().toISOString() },
  { id: 'CORR-DIST-002', movieId: 102, movieTitle: 'Sapta Sagaradaache Ello', platformId: 'NODE-ZEE5', audioTracks: ['ಕನ್ನಡ (Original 5.1 Atmos)'], streamResolution: '1080p FHD', bitrateMbps: 12.0, cdnHealth: 'OPTIMAL', status: 'ACTIVE', directUrl: 'https://www.zee5.com', createdAt: new Date().toISOString() },
  { id: 'CORR-DIST-003', movieId: 103, movieTitle: '12th Fail', platformId: 'NODE-HOTSTAR', audioTracks: ['ಕನ್ನಡ Dub (Certified 5.1)', 'Hindi Original'], streamResolution: '4K Dolby Vision', bitrateMbps: 19.2, cdnHealth: 'OPTIMAL', status: 'ACTIVE', directUrl: 'https://www.hotstar.com/in', createdAt: new Date().toISOString() },
  { id: 'CORR-DIST-004', movieId: 104, movieTitle: 'Garudan', platformId: 'NODE-SONYLIV', audioTracks: ['ಕನ್ನಡ Dub', 'Tamil Original 5.1'], streamResolution: '1080p FHD', bitrateMbps: 11.5, cdnHealth: 'OPTIMAL', status: 'ACTIVE', directUrl: 'https://www.sonyliv.com', createdAt: new Date().toISOString() },
  { id: 'CORR-DIST-005', movieId: 105, movieTitle: 'Sita Ramam', platformId: 'NODE-HOTSTAR', audioTracks: ['ಕನ್ನಡ Dub (Certified Atmos)', 'Telugu Original'], streamResolution: '4K Dolby Vision', bitrateMbps: 18.0, cdnHealth: 'OPTIMAL', status: 'ACTIVE', directUrl: 'https://www.hotstar.com/in', createdAt: new Date().toISOString() }
];

class OTTTopologyService {
  private platforms: Map<string, PlatformNode> = new Map();
  private corridors: Map<string, DistributionCorridor> = new Map();

  constructor() { this.resetBaseline(); }

  public resetBaseline(): void {
    this.platforms.clear();
    this.corridors.clear();
    DEFAULT_PLATFORMS.forEach(p => this.platforms.set(p.id, { ...p }));
    DEFAULT_CORRIDORS.forEach(c => this.corridors.set(c.id, { ...c }));
  }

  public getTelemetry(): TopologyTelemetry {
    const list = Array.from(this.corridors.values());
    const activeCorridors = list.filter(c => c.status === 'ACTIVE').length;
    const severedCorridors = list.filter(c => c.status === 'SEVERED').length;
    const verifiedAudio = list.filter(c => c.audioTracks.some(t => t.includes('ಕನ್ನಡ'))).length;
    const verifiedAudioRatePct = list.length > 0 ? Math.round((verifiedAudio / list.length) * 100) : 100;
    const totalBitrate = list.reduce((acc, c) => acc + (c.bitrateMbps || 0), 0);
    const avgBitrateMbps = list.length > 0 ? parseFloat((totalBitrate / list.length).toFixed(1)) : 15.0;
    return { totalCorridors: list.length, activeCorridors, severedCorridors, verifiedAudioRatePct, governedPlatformsCount: this.platforms.size, avgBitrateMbps, activeCdnRelays: 8, timestamp: new Date().toISOString() };
  }

  public getOverview() { return { platforms: Array.from(this.platforms.values()), corridors: Array.from(this.corridors.values()), telemetry: this.getTelemetry() }; }
  public getPlatforms(): PlatformNode[] { return Array.from(this.platforms.values()); }
  public addPlatform(node: PlatformNode): PlatformNode { if (!node.id) throw new Error('Platform ID required'); this.platforms.set(node.id, { ...node }); return this.platforms.get(node.id)!; }

  public deletePlatform(id: string) {
    if (!this.platforms.has(id)) throw new Error('Platform ' + id + ' does not exist');
    const cascaded = [];
    for (const [cId, corr] of this.corridors.entries()) {
      if (corr.platformId === id) { this.corridors.delete(cId); cascaded.push(cId); }
    }
    this.platforms.delete(id);
    return { success: true, deletedPlatformId: id, cascadedSeveredCorridors: cascaded, cascadedRemovedCorridors: cascaded };
  }

  public purgePlatforms() { const count = this.platforms.size; this.platforms.clear(); this.corridors.clear(); return { success: true, count, message: 'Purged ' + count + ' platforms.' }; }
  public getCorridors(): DistributionCorridor[] { return Array.from(this.corridors.values()); }

  public addCorridor(corr: Partial<DistributionCorridor>): DistributionCorridor {
    if (!corr.id) throw new Error('Corridor ID required');
    if (!corr.platformId || !this.platforms.has(corr.platformId)) throw new Error('Invalid Platform: ' + corr.platformId);
    const item: DistributionCorridor = {
      id: corr.id,
      movieId: corr.movieId || 999,
      movieTitle: corr.movieTitle || 'Feature Film',
      platformId: corr.platformId,
      audioTracks: corr.audioTracks || ['ಕನ್ನಡ (Stereo / 5.1)'],
      streamResolution: corr.streamResolution || '1080p FHD',
      bitrateMbps: corr.bitrateMbps || 14.5,
      cdnHealth: corr.cdnHealth || 'OPTIMAL',
      status: corr.status || 'ACTIVE',
      directUrl: corr.directUrl || 'https://www.hotstar.com/in',
      createdAt: corr.createdAt || new Date().toISOString()
    };
    this.corridors.set(item.id, item);
    return item;
  }

  public severCorridor(id: string) { const c = this.corridors.get(id); if (!c) throw new Error('Not found'); c.status = 'SEVERED'; return c; }
  public restoreCorridor(id: string) { const c = this.corridors.get(id); if (!c) throw new Error('Not found'); c.status = 'ACTIVE'; return c; }
  public deleteCorridor(id: string) { if (!this.corridors.has(id)) throw new Error('Not found'); this.corridors.delete(id); return { success: true, deletedCorridorId: id }; }
  public purgeCorridors() { const count = this.corridors.size; this.corridors.clear(); return { success: true, count, message: 'Purged ' + count + ' corridors.' }; }

  public ingestCorridors(payload: string, format: 'csv' | 'json') {
    const imported: DistributionCorridor[] = [];
    if (format === 'json') {
      const data = JSON.parse(payload);
      for (const item of data) { imported.push(this.addCorridor(item)); }
    } else {
      const lines = payload.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) throw new Error('CSV requires header and records');
      const headers = lines[0].split(',').map(h => h.trim());
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        const row: any = {};
        headers.forEach((h, idx) => { row[h] = parts[idx]; });
        imported.push(this.addCorridor({
          id: row.id,
          movieId: parseInt(row.movieId) || 900 + i,
          movieTitle: row.movieTitle || 'Imported Film',
          platformId: row.platformId,
          bitrateMbps: parseFloat(row.bitrateMbps) || 15.0,
          audioTracks: row.audioTracks ? row.audioTracks.split(';') : ['ಕನ್ನಡ (5.1)']
        }));
      }
    }
    return { success: true, count: imported.length, corridors: imported };
  }

  public ingestPlatforms(payload: string, format: 'csv' | 'json') {
    const imported: PlatformNode[] = [];
    if (format === 'json') {
      const data = JSON.parse(payload);
      for (const item of data) { imported.push(this.addPlatform(item)); }
    } else {
      const lines = payload.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const headers = lines[0].split(',').map(h => h.trim());
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = parts[idx]; });
        imported.push(this.addPlatform({
          id: row.id,
          name: row.name,
          shortName: row.shortName || row.name,
          cdnRegion: row.cdnRegion || 'ap-south-1',
          drmLevel: row.drmLevel || 'Widevine L1',
          maxResolution: row.maxResolution || '4K UHD',
          status: (row.status as 'ONLINE' | 'DEGRADED' | 'MAINTENANCE') || 'ONLINE',
          webUrl: row.webUrl || 'https://www.hotstar.com',
          color: row.color || '#0c57d4'
        }));
      }
    }
    return { success: true, count: imported.length, platforms: imported };
  }
}

export const ottTopologyService = new OTTTopologyService();