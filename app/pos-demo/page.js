'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ValidatorBar from '../components/ValidatorBar';

const API = '/api';
const COLORS = ['blue', 'green', 'purple', 'amber', 'pink', 'cyan'];

export default function PosDemo() {
  const [validators, setValidators] = useState({});
  const [posChain, setPosChain] = useState([]);
  const [newName, setNewName] = useState('');
  const [newStake, setNewStake] = useState(30);
  const [txData, setTxData] = useState('');
  const [lastCreated, setLastCreated] = useState(null);
  const [creating, setCreating] = useState(false);
  const [selectionAnimation, setSelectionAnimation] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchValidators();
    fetchPosChain();
  }, []);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const fetchValidators = async () => {
    try {
      const res = await fetch(`${API}/get_validators`);
      const data = await res.json();
      setValidators(data.validators);
    } catch (e) {}
  };

  const fetchPosChain = async () => {
    try {
      const res = await fetch(`${API}/get_pos_chain`);
      const data = await res.json();
      setPosChain(data.chain);
    } catch (e) {}
  };

  const addValidator = async () => {
    if (!newName || newStake < 10) return;
    try {
      const res = await fetch(`${API}/add_validator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, stake: Number(newStake) })
      });
      const data = await res.json();
      if (data.validators) {
        setValidators(data.validators);
        addLog(`${newName} joined with ${newStake} tokens staked`, 'success');
        setNewName('');
        setNewStake(30);
      } else {
        addLog(data.error || 'Failed to add validator', 'error');
      }
    } catch (e) {
      addLog('API connection failed', 'error');
    }
  };

  const createBlock = async () => {
    if (Object.keys(validators).length === 0) {
      addLog('No validators registered! Add validators first.', 'error');
      return;
    }
    setCreating(true);
    setSelectionAnimation(true);
    addLog('Starting validator selection process...', 'info');

    // Simulate selection animation
    await new Promise(r => setTimeout(r, 1500));

    try {
      const res = await fetch(`${API}/pos_create_block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: txData || `Transaction at ${new Date().toLocaleTimeString()}` })
      });
      const data = await res.json();
      setLastCreated(data.block);
      addLog(`Block #${data.block.index} created by ${data.block.validator} (stake: ${data.block.stake})`, 'success');
      await fetchPosChain();
      setTxData('');
    } catch (e) {
      addLog('Block creation failed', 'error');
    }
    setSelectionAnimation(false);
    setCreating(false);
  };

  const resetChain = async () => {
    try {
      await fetch(`${API}/reset_pos`, { method: 'POST' });
      setValidators({});
      setPosChain([]);
      setLastCreated(null);
      setLogs([]);
      addLog('Chain reset to genesis', 'info');
    } catch (e) {}
  };

  const totalStake = Object.values(validators).reduce((a, b) => a + b, 0);

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          ⚡ Interactive PoS Demo
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Add validators, stake tokens, and watch the Proof of Stake consensus mechanism in action.
          Higher stake = higher probability of being selected.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Validators */}
        <div className="lg:col-span-1 space-y-4">
          {/* Add Validator Form */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Validator</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Validator name"
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:outline-none transition-colors"
              />
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Stake Amount</span>
                  <span className="text-indigo-600 font-mono">{newStake} tokens</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={newStake}
                  onChange={(e) => setNewStake(e.target.value)}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>10 (min)</span>
                  <span>100</span>
                </div>
              </div>
              <motion.button
                onClick={addValidator}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!newName || newStake < 10}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all btn-shine hover:bg-indigo-700"
              >
                + Add Validator
              </motion.button>
            </div>
          </div>

          {/* Validator List */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Validators</h3>
              <span className="text-xs text-slate-500">Total: {totalStake} tokens</span>
            </div>
            {Object.keys(validators).length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">No validators yet. Add some above!</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(validators).map(([name, stake], i) => (
                  <ValidatorBar
                    key={name}
                    name={name}
                    stake={stake}
                    totalStake={totalStake}
                    isSelected={lastCreated?.validator === name}
                    color={COLORS[i % COLORS.length]}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Probability Pie */}
          {totalStake > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Selection Probability</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {(() => {
                      let offset = 0;
                      return Object.entries(validators).map(([name, stake], i) => {
                        const pct = (stake / totalStake) * 100;
                        const dashArray = `${pct} ${100 - pct}`;
                        const element = (
                          <circle
                            key={name}
                            cx="50" cy="50" r="40"
                            fill="none"
                            stroke={['#5c7cfa', '#22c55e', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4'][i % 6]}
                            strokeWidth="12"
                            strokeDasharray={dashArray}
                            strokeDashoffset={-offset}
                            pathLength="100"
                            className="transition-all duration-500"
                          />
                        );
                        offset += pct;
                        return element;
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-800">{Object.keys(validators).length}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3 justify-center">
                {Object.entries(validators).map(([name, stake], i) => (
                    <span key={name} className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ background: ['#5c7cfa', '#22c55e', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4'][i % 6] }} />
                    {name} ({((stake / totalStake) * 100).toFixed(0)}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Block Creation & Chain */}
        <div className="lg:col-span-2 space-y-4">
          {/* Create Block */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Create Block (PoS)</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={txData}
                onChange={(e) => setTxData(e.target.value)}
                placeholder="Transaction data (e.g., 'Alice pays Bob 10 tokens')"
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:outline-none transition-colors"
              />
              <motion.button
                onClick={createBlock}
                disabled={creating || Object.keys(validators).length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-2.5 rounded-xl font-semibold text-white btn-shine transition-all whitespace-nowrap
                  ${creating
                    ? 'bg-emerald-400 cursor-wait'
                    : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md'
                  }`}
              >
                {creating ? '⏳ Selecting...' : '⚡ Create Block'}
              </motion.button>
            </div>

            {/* Selection Animation */}
            <AnimatePresence>
              {selectionAnimation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4"
                >
                  <p className="text-indigo-700 text-sm font-medium mb-2">
                    🎰 Selecting validator based on weighted stake...
                  </p>
                  <div className="flex gap-2">
                    {Object.entries(validators).map(([name], i) => (
                      <motion.div
                        key={name}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                        className="bg-indigo-100 border border-indigo-300 rounded-lg px-3 py-1 text-sm text-indigo-700"
                      >
                        {name}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Last Created Block */}
            <AnimatePresence>
              {lastCreated && !selectionAnimation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4"
                >
                  <p className="text-emerald-700 font-semibold text-sm">
                    ✓ Block #{lastCreated.index} validated by {lastCreated.validator} (staked: {lastCreated.stake} tokens)
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-mono break-all">
                    Hash: {lastCreated.hash}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PoS Chain Visualization */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">PoS Chain</h3>
              <button
                onClick={resetChain}
                className="text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-lg border border-red-500/20 hover:border-red-500/40"
              >
                🔄 Reset
              </button>
            </div>
            
            {posChain.length <= 1 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-4xl mb-2">📦</p>
                <p>Only genesis block exists. Create blocks above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posChain.map((block, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                      i === posChain.length - 1 && i > 0
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      i === 0
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                    }`}>
                      #{block.index}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 truncate">
                        {typeof block.data === 'object' ? JSON.stringify(block.data) : block.data}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">{block.hash}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-emerald-700 font-medium">{block.validator}</p>
                      {block.timestamp && (
                        <p className="text-xs text-slate-400">
                          {typeof block.timestamp === 'string' ? block.timestamp.slice(11, 19) : ''}
                        </p>
                      )}
                    </div>
                    {i < posChain.length - 1 && (
                      <div className="absolute left-8 mt-12 h-3 w-0.5 bg-blockchain-600/30" />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Event Log */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Event Log</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-48 overflow-y-auto space-y-1 font-mono text-xs">
              {logs.length === 0 ? (
                <p className="text-slate-400">Waiting for events...</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-400">[{log.time}]</span>
                    <span className={
                      log.type === 'success' ? 'text-emerald-700' :
                      log.type === 'error' ? 'text-red-600' :
                      'text-slate-600'
                    }>
                      {log.msg}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
