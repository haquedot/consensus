'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = '/api';

export default function Explorer() {
  const [chain, setChain] = useState([]);
  const [posChain, setPosChain] = useState([]);
  const [activeTab, setActiveTab] = useState('pow');
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    fetchChain();
    fetchPosChain();
  }, []);

  const fetchChain = async () => {
    try {
      const res = await fetch(`${API}/get_chain`);
      const data = await res.json();
      setChain(data.chain);
    } catch (e) {
      console.log('API not connected');
    }
  };

  const fetchPosChain = async () => {
    try {
      const res = await fetch(`${API}/get_pos_chain`);
      const data = await res.json();
      setPosChain(data.chain);
    } catch (e) {
      console.log('PoS API not connected');
    }
  };

  const activeChain = activeTab === 'pow' ? chain : posChain;

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Chain Explorer</h1>
        <p className="text-slate-500">Inspect every block in the blockchain</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="glass-card p-1 flex space-x-1">
          <button
            onClick={() => { setActiveTab('pow'); setSelectedBlock(null); }}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'pow'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            ⛏️ Proof of Work ({chain.length} blocks)
          </button>
          <button
            onClick={() => { setActiveTab('pos'); setSelectedBlock(null); }}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'pos'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            ⚡ Proof of Stake ({posChain.length} blocks)
          </button>
        </div>
      </div>

      {/* Visual Chain */}
      <div className="glass-card p-6 overflow-x-auto">
        <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Visual Chain</h3>
        <div className="flex items-center space-x-2 pb-4 min-w-max">
          {activeChain.map((block, i) => (
            <div key={i} className="flex items-center">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedBlock(block)}
                className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer
                  ${selectedBlock?.index === block.index
                    ? 'bg-indigo-600 shadow-md scale-110 text-white'
                    : i === 0
                    ? 'bg-amber-50 border border-amber-200 hover:border-amber-400'
                    : 'bg-slate-100 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
              >
                <span className="text-xs font-bold text-slate-800">#{block.index}</span>
                {block.validator && (
                  <span className="text-[10px] text-slate-400 mt-0.5 truncate w-14 text-center">
                    {block.validator}
                  </span>
                )}
              </motion.button>
              {i < activeChain.length - 1 && (
                <div className="flex items-center mx-1">
                  <div className="w-4 h-0.5 bg-indigo-300" />
                  <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-transparent border-l-indigo-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Block Detail */}
      <AnimatePresence mode="wait">
        {selectedBlock && (
          <motion.div
            key={selectedBlock.index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Block #{selectedBlock.index}
                {selectedBlock.index === 0 && (
                  <span className="ml-3 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                    Genesis Block
                  </span>
                )}
              </h3>
              <button
                onClick={() => setSelectedBlock(null)}
                className="text-slate-400 hover:text-slate-800 transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {selectedBlock.timestamp && (
                  <DetailRow
                    label="Timestamp"
                    value={typeof selectedBlock.timestamp === 'string'
                      ? selectedBlock.timestamp
                      : new Date(selectedBlock.timestamp * 1000).toLocaleString()}
                    icon="🕐"
                  />
                )}
                {selectedBlock.validator && (
                  <DetailRow label="Validator" value={selectedBlock.validator} icon="👤" highlight />
                )}
                {selectedBlock.proof && (
                  <DetailRow label="Proof (Nonce)" value={selectedBlock.proof} icon="🔢" />
                )}
                {selectedBlock.data && (
                  <DetailRow
                    label="Block Data"
                    value={typeof selectedBlock.data === 'object' ? JSON.stringify(selectedBlock.data, null, 2) : selectedBlock.data}
                    icon="📦"
                  />
                )}
                {selectedBlock.stake && (
                  <DetailRow label="Validator Stake" value={`${selectedBlock.stake} tokens`} icon="💰" />
                )}
              </div>

              {/* Right Column - Hashes */}
              <div className="space-y-4">
                {selectedBlock.hash && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Block Hash</p>
                    <p className="text-sm font-mono text-emerald-700 break-all">{selectedBlock.hash}</p>
                  </div>
                )}
                {selectedBlock.previous_hash && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Previous Hash</p>
                    <p className="text-sm font-mono text-amber-700 break-all">{selectedBlock.previous_hash}</p>
                  </div>
                )}

                {/* Hash Linkage Diagram */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Hash Linkage</p>
                  <div className="flex items-center justify-center space-x-3 text-sm">
                    <div className="bg-slate-200 rounded-lg px-3 py-2 text-amber-700">
                      Block #{selectedBlock.index > 0 ? selectedBlock.index - 1 : '—'}
                    </div>
                    <div className="text-indigo-600">→ hash →</div>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-indigo-700 font-bold">
                      Block #{selectedBlock.index}
                    </div>
                    {selectedBlock.index < activeChain.length - 1 && (
                      <>
                        <div className="text-indigo-600">→ hash →</div>
                        <div className="bg-slate-200 rounded-lg px-3 py-2 text-slate-600">
                          Block #{selectedBlock.index + 1}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">All Blocks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="text-left p-4">Index</th>
                <th className="text-left p-4">{activeTab === 'pos' ? 'Validator' : 'Proof'}</th>
                <th className="text-left p-4">Data</th>
                <th className="text-left p-4">Hash</th>
                <th className="text-left p-4">Prev Hash</th>
              </tr>
            </thead>
            <tbody>
              {activeChain.map((block, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedBlock(block)}
                  className="border-b border-slate-200 hover:bg-indigo-50 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-xs font-bold border border-indigo-100">
                      #{block.index}
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    {activeTab === 'pos' ? (
                      <span className="text-emerald-700">{block.validator || '—'}</span>
                    ) : (
                      <span className="text-amber-700 font-mono">{block.proof || '—'}</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-slate-600 max-w-[200px] truncate">
                    {typeof block.data === 'object' ? JSON.stringify(block.data) : block.data || '—'}
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-500">
                    {block.hash ? `${block.hash}` : '—'}
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-400">
                    {block.previous_hash ? `${block.previous_hash}` : '—'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={() => { fetchChain(); fetchPosChain(); }}
          className="px-6 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-all text-sm font-medium"
        >
          🔄 Refresh Chain Data
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon, highlight }) {
  return (
    <div className="flex items-start space-x-3">
      <span className="text-xl mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-medium mt-0.5 ${highlight ? 'text-emerald-700' : 'text-slate-900'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
