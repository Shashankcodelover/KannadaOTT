'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function IngestPage() {
  const [entity, setEntity] = useState<'corridors' | 'platforms'>('corridors');
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [buffer, setBuffer] = useState('');
  const [log, setLog] = useState('Ready for batch ingestion payload...');
  const [loading, setLoading] = useState(false);

  const loadTemplate = () => {
    if (entity === 'corridors') {
      if (format === 'csv') {
        setBuffer(
          'id,movieId,movieTitle,platformId,bitrateMbps,audioTracks\n' +
          'CORR-INGEST-01,201,Badava Rascal,NODE-ZEE5,14.5,ಕನ್ನಡ (5.1 Dolby)\n' +
          'CORR-INGEST-02,202,Daredevil Musthafa,NODE-HOTSTAR,16.0,ಕನ್ನಡ (Stereo Master)\n' +
          'CORR-INGEST-03,203,Ratnan Prapancha,NODE-JIOCINEMA,18.2,ಕನ್ನಡ (5.1 Atmos)'
        );
      } else {
        setBuffer(JSON.stringify([
          {
            id: 'CORR-JSON-01',
            movieId: 301,
            movieTitle: 'Hostel Hudugaru Bekagiddare',
            platformId: 'NODE-ZEE5',
            streamResolution: '1080p FHD',
            bitrateMbps: 15.0,
            audioTracks: ['ಕನ್ನಡ (Original 5.1)']
          },
          {
            id: 'CORR-JSON-02',
            movieId: 302,
            movieTitle: 'Toby',
            platformId: 'NODE-SONYLIV',
            streamResolution: '4K Ultra HD',
            bitrateMbps: 19.5,
            audioTracks: ['ಕನ್ನಡ (Dolby Atmos)']
          }
        ], null, 2));
      }
    } else {
      if (format === 'csv') {
        setBuffer(
          'id,name,shortName,cdnRegion,drmLevel,maxResolution,webUrl,color\n' +
          'NODE-AMAZON,Prime Video India,Prime,ap-south-1,Widevine L1,4K UHD,https://primevideo.com,#00a8e1\n' +
          'NODE-AHA,Aha Kannada OTT,Aha,ap-south-2,Widevine L1,1080p FHD,https://aha.video,#ff6f00'
        );
      } else {
        setBuffer(JSON.stringify([
          {
            id: 'NODE-LIONSGATE',
            name: 'Lionsgate Play India',
            shortName: 'Lionsgate',
            cdnRegion: 'ap-south-1',
            drmLevel: 'Widevine L1',
            maxResolution: '1080p FHD',
            webUrl: 'https://lionsgateplay.com',
            color: '#111111'
          }
        ], null, 2));
      }
    }
    appendLog('[TEMPLATE] Loaded ' + format.toUpperCase() + ' template for ' + entity + '.');
  };

  useEffect(() => {
    loadTemplate();
  }, [entity, format]);

  const appendLog = (msg: string) => {
    const ts = new Date().toLocaleTimeString();
    setLog((prev) => '[' + ts + '] ' + msg + '\n' + prev);
  };

  const handleExecuteIngest = async () => {
    if (!buffer.trim()) {
      alert('Please enter or load payload data into the buffer.');
      return;
    }
    setLoading(true);
    appendLog('[INGEST] Uploading batch ' + entity + ' records (' + format.toUpperCase() + ')...');

    try {
      const contentType = format === 'csv' ? 'text/csv' : 'application/json';
      const res = await fetch('/api/topology/' + entity + '/upload', {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: buffer
      });
      const data = await res.json();
      if (data.success) {
        appendLog('[SUCCESS] Successfully ingested ' + data.count + ' ' + entity + ' records into topology mesh!');
      } else {
        appendLog('[ERROR] Batch ingestion rejected: ' + data.error);
      }
    } catch (err: any) {
      appendLog('[ERROR] Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUniversalPurge = async () => {
    if (!confirm('CRITICAL: Universal Cascade Purge will clear all streaming corridors across the distribution topology. Proceed?')) return;
    const check = prompt('Type "CONFIRM PURGE" to execute:');
    if (check !== 'CONFIRM PURGE') {
      appendLog('[ABORT] Universal purge cancelled by user.');
      return;
    }

    try {
      const res = await fetch('/api/topology/corridors/purge', { method: 'POST' });
      const data = await res.json();
      appendLog('[PURGE] ' + data.message);
    } catch (err: any) {
      appendLog('[ERROR] Purge failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">📥</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Enterprise Batch Ingestion Studio
              </h1>
            </div>
            <p className="text-sm text-zinc-400">
              RFC 4180 CSV & Strict JSON Schema Bulk Ingestion with Universal Cascading Purge
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="btn-universal-purge"
              onClick={handleUniversalPurge}
              className="bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              ⚠️ Universal Cascade Purge
            </button>
            <Link
              href="/mesh"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors border border-zinc-700"
            >
              🌐 View Mesh →
            </Link>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase text-zinc-400 font-semibold">Target Entity:</span>
            <select
              value={entity}
              onChange={(e) => setEntity(e.target.value as any)}
              className="bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-1.5 rounded-lg"
            >
              <option value="corridors">Distribution Corridors</option>
              <option value="platforms">OTT Platforms</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase text-zinc-400 font-semibold">Format:</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="bg-zinc-800 border border-zinc-700 text-sm text-white px-3 py-1.5 rounded-lg"
            >
              <option value="csv">RFC 4180 CSV</option>
              <option value="json">Strict JSON Schema</option>
            </select>
          </div>

          <button
            onClick={loadTemplate}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm px-3.5 py-1.5 rounded-lg border border-zinc-700 font-medium"
          >
            📋 Load Template
          </button>

          <button
            id="btn-execute-ingest"
            onClick={handleExecuteIngest}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-1.5 rounded-lg ml-auto shadow-lg shadow-red-950 transition-colors"
          >
            {loading ? 'Ingesting...' : '⚡ Execute Batch Ingest'}
          </button>
        </div>

        {/* Editor & Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="text-xs uppercase text-zinc-400 font-semibold mb-2 flex items-center justify-between">
              <span>Ingestion Buffer (Edit or Paste Records):</span>
              <span className="font-mono text-[11px] text-zinc-500">{buffer.length} characters</span>
            </div>
            <textarea
              id="ingest-buffer"
              value={buffer}
              onChange={(e) => setBuffer(e.target.value)}
              spellCheck={false}
              className="w-full h-96 bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-cyan-300 focus:outline-none focus:border-red-500 shadow-inner"
            />
          </div>

          <div>
            <div className="text-xs uppercase text-zinc-400 font-semibold mb-2">
              Execution Terminal Log:
            </div>
            <div id="ingest-log" className="w-full h-96 bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-xs text-zinc-400 overflow-y-auto whitespace-pre-wrap">
              {log}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
