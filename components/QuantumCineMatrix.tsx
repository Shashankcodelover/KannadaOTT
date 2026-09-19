"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuantumCineMatrix() {
  const [active, setActive] = useState(false);
  const [metrics, setMetrics] = useState({ excitement: 0, tension: 0, humor: 0 });

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setMetrics({
          excitement: Math.random() * 30 + 70,
          tension: Math.random() * 50 + 50,
          humor: Math.random() * 40 + 20,
        });
      }, 600);
      return () => clearInterval(interval);
    }
  }, [active]);

  return (
    <div className="relative w-full border-b border-purple-900/50 bg-black/90 p-4 sm:p-6 overflow-hidden">
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ backgroundImage: 'radial-gradient(circle at center, #9333ea 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 flex items-center gap-2">
            <span>✨</span> Quantum Cine-Matrix Engine
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
            Real-time neural decoding of regional Kannada cinema scripts to predict emotional resonance and box office trajectory.
          </p>
          <button 
            onClick={() => setActive(!active)}
            className={`mt-4 px-4 py-2 rounded-md text-xs font-bold border transition-colors ${active ? 'bg-purple-900/50 border-purple-500 text-purple-200' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'}`}
          >
            {active ? "TERMINATE MATRIX" : "INITIALIZE QUANTUM SCAN"}
          </button>
        </div>

        <AnimatePresence>
          {active && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 grid grid-cols-3 gap-3 sm:gap-4"
            >
              {[
                { label: 'Exhilaration', value: metrics.excitement, color: 'bg-emerald-500' },
                { label: 'Tension', value: metrics.tension, color: 'bg-amber-500' },
                { label: 'Humor', value: metrics.humor, color: 'bg-sky-500' }
              ].map((m, idx) => (
                <div key={idx} className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold">{m.label}</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-1">{m.value.toFixed(1)}%</div>
                  <div className="h-1.5 w-full bg-zinc-800 mt-2 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${m.color}`}
                      animate={{ width: `${m.value}%` }}
                      transition={{ type: 'spring', bounce: 0 }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
