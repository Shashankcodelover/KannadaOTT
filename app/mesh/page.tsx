'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sounds } from '@/lib/soundEffects';

interface PlatformNode {
  id: string;
  name: string;
  shortName: string;
  cdnRegion: string;
  drmLevel: string;
  maxResolution: string;
  status: string;
  webUrl: string;
  color: string;
}

interface DistributionCorridor {
  id: string;
  movieId: number;
  movieTitle: string;
  platformId: string;
  audioTracks: string[];
  streamResolution: string;
  bitrateMbps: number;
  cdnHealth: string;
  status: string;
  directUrl: string;
}

interface TopologyTelemetry {
  totalCorridors: number;
  activeCorridors: number;
  severedCorridors: number;
  verifiedAudioRatePct: number;
  governedPlatformsCount: number;
  avgBitrateMbps: number;
  activeCdnRelays: number;
}

export default function MeshPage() {
  const [platforms, setPlatforms] = useState<PlatformNode[]>([]);
  const [corridors, setCorridors] = useState<DistributionCorridor[]>([]);
  const [telemetry, setTelemetry] = useState<TopologyTelemetry | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [newId, setNewId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('');
  const [newResolution, setNewResolution] = useState('4K Ultra HD');
  const [newBitrate, setNewBitrate] = useState('18.0');
  const [newAudio, setNewAudio] = useState('ಕನ್ನಡ (5.1 Dolby Atmos)');

  const fetchOverview = async () => {
    try {
      const res = await fetch('/api/topology/overview');
      const data = await res.json();
      setPlatforms(data.platforms || []);
      setCorridors(data.corridors || []);
      setTelemetry(data.telemetry || null);
      if (data.platforms?.length && !newPlatform) {
        setNewPlatform(data.platforms[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleSever = async (id: string) => {
    sounds.sever();
    await fetch('/api/topology/corridors/' + id + '/sever', { method: 'POST' });
    fetchOverview();
  };

  const handleRestore = async (id: string) => {
    sounds.restore();
    await fetch('/api/topology/corridors/' + id + '/restore', { method: 'POST' });
    fetchOverview();
  };

  const handleDeleteCorridor = async (id: string) => {
    if (!confirm('Delete distribution corridor ' + id + '?')) return;
    await fetch('/api/topology/corridors/' + id, { method: 'DELETE' });
    fetchOverview();
  };

  const handleDeletePlatform = async (id: string) => {
    if (!confirm('Cascading Delete: Removing ' + id + ' will sever all associated streaming corridors. Proceed?')) return;
    await fetch('/api/topology/platforms/' + id, { method: 'DELETE' });
    fetchOverview();
  };

  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId || !newTitle || !newPlatform) return;

    await fetch('/api/topology/corridors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newId,
        movieTitle: newTitle,
        platformId: newPlatform,
        streamResolution: newResolution,
        bitrateMbps: parseFloat(newBitrate) || 15.0,
        audioTracks: [newAudio]
      })
    });

    setShowModal(false);
    setNewId('');
    setNewTitle('');
    fetchOverview();
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🌐</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                OTT Distribution Topology Mesh
              </h1>
            </div>
            <p className="text-sm text-zinc-400">
              Zero-Trust Content Distribution Corridors & Widevine L1 Streaming Certification
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="btn-open-provision"
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-red-950"
            >
              + Provision Corridor
            </button>
            <button
              onClick={fetchOverview}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-zinc-700"
            >
              🔄 Refresh Mesh
            </button>
            <Link
              href="/ingest"
              className="bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              📥 Ingestion Studio →
            </Link>
          </div>
        </div>

        {/* Telemetry Strip */}
        {telemetry && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
              <div className="text-xs uppercase text-zinc-400 font-semibold tracking-wider">Active Corridors</div>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{telemetry.activeCorridors} / {telemetry.totalCorridors}</div>
              <div className="text-[11px] text-zinc-500 mt-1">{telemetry.severedCorridors} Severed</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
              <div className="text-xs uppercase text-zinc-400 font-semibold tracking-wider">Verified Audio</div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{telemetry.verifiedAudioRatePct}%</div>
              <div className="text-[11px] text-zinc-500 mt-1">ಕನ್ನಡ 5.1 Certified</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
              <div className="text-xs uppercase text-zinc-400 font-semibold tracking-wider">Governed Platforms</div>
              <div className="text-2xl font-black text-purple-400 font-mono mt-1">{telemetry.governedPlatformsCount}</div>
              <div className="text-[11px] text-zinc-500 mt-1">Widevine L1 DRM</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
              <div className="text-xs uppercase text-zinc-400 font-semibold tracking-wider">Avg Bitrate</div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">{telemetry.avgBitrateMbps} Mbps</div>
              <div className="text-[11px] text-zinc-500 mt-1">4K/FHD Multi-track</div>
            </div>
            <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
              <div className="text-xs uppercase text-zinc-400 font-semibold tracking-wider">Active CDN Relays</div>
              <div className="text-2xl font-black text-rose-400 font-mono mt-1">{telemetry.activeCdnRelays} Nodes</div>
              <div className="text-[11px] text-zinc-500 mt-1">Sub-15ms Edge Latency</div>
            </div>
          </div>
        )}

        {/* Tables Subgrid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Corridors Table (2 Cols) */}
          <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>📡</span> Active Streaming Distribution Corridors
              </h2>
              <span className="text-xs text-zinc-400 font-mono">{corridors.length} Corridors</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs text-zinc-400 uppercase">
                    <th className="py-2.5 px-3">Corridor</th>
                    <th className="py-2.5 px-3">Movie & Audio</th>
                    <th className="py-2.5 px-3">Platform</th>
                    <th className="py-2.5 px-3">Quality</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {corridors.map((c) => {
                    const isSevered = c.status === 'SEVERED';
                    return (
                      <tr key={c.id} className="hover:bg-zinc-800/30">
                        <td className="py-3 px-3 font-mono text-xs font-semibold text-cyan-400">{c.id}</td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-white">{c.movieTitle}</div>
                          <div className="text-xs text-emerald-400">{c.audioTracks[0] || 'ಕನ್ನಡ'}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-zinc-300">{c.platformId}</td>
                        <td className="py-3 px-3">
                          <span className="bg-zinc-800 text-zinc-300 text-[11px] px-2 py-0.5 rounded font-mono">
                            {c.streamResolution}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={
                              'inline-block px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ' +
                              (isSevered
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30')
                            }
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            {isSevered ? (
                              <button
                                onClick={() => handleRestore(c.id)}
                                className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs px-2 py-1 rounded"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSever(c.id)}
                                className="bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs px-2 py-1 rounded"
                              >
                                Sever
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteCorridor(c.id)}
                              className="bg-red-900/60 hover:bg-red-800 text-red-200 text-xs px-2 py-1 rounded"
                            >
                              Drop
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Platforms Roster (1 Col) */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>🏰</span> Governed OTT Platforms
              </h2>
              <span className="text-xs text-zinc-400 font-mono">{platforms.length} Nodes</span>
            </div>
            <div className="space-y-3">
              {platforms.map((p) => (
                <div key={p.id} className="bg-zinc-800/40 border border-zinc-800 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      {p.name}
                    </div>
                    <div className="text-xs text-zinc-400 font-mono mt-0.5">
                      {p.cdnRegion} • {p.maxResolution}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePlatform(p.id)}
                    className="bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-xs px-2.5 py-1 rounded transition-colors"
                    title="Cascading deletion severs all corridors"
                  >
                    Cascade Del
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Provision Corridor Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
                <h3 className="text-lg font-bold text-white">Provision Distribution Corridor</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-zinc-400 hover:text-white text-xl font-bold"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleProvisionSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase text-zinc-400 font-semibold mb-1">Corridor Identifier</label>
                  <input
                    type="text"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    placeholder="e.g. CORR-DIST-009"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-zinc-400 font-semibold mb-1">Movie Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Kantara Chapter 1"
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-zinc-400 font-semibold mb-1">Target OTT Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-zinc-400 font-semibold mb-1">Resolution</label>
                    <select
                      value={newResolution}
                      onChange={(e) => setNewResolution(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <option value="4K Ultra HD">4K Ultra HD</option>
                      <option value="4K Dolby Vision">4K Dolby Vision</option>
                      <option value="1080p FHD">1080p FHD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-zinc-400 font-semibold mb-1">Bitrate (Mbps)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newBitrate}
                      onChange={(e) => setNewBitrate(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase text-zinc-400 font-semibold mb-1">Audio Certification</label>
                  <input
                    type="text"
                    value={newAudio}
                    onChange={(e) => setNewAudio(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                  >
                    Provision Corridor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
