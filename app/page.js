'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from './components/StatsCard';
import BlockCard from './components/BlockCard';

const API = '/api'; // Base URL for backend API

export default function Dashboard() {
  const [chain, setChain] = useState([]);
  const [posChain, setPosChain] = useState([]);
  const [mining, setMining] = useState(false);
  const [lastMined, setLastMined] = useState(null);
  const [validators, setValidators] = useState({});

  // Fetch chains on load
  useEffect(() => {
    fetchChain();
    fetchPosChain();
    fetchValidators();
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

  const fetchValidators = async () => {
    try {
      const res = await fetch(`${API}/get_validators`);
      const data = await res.json();
      setValidators(data.validators);
    } catch (e) {
      console.log('Validators API not connected');
    }
  };

  const mineBlock = async () => {
    setMining(true);
    try {
      const res = await fetch(`${API}/mine_block`);
      const data = await res.json();
      setLastMined(data);
      await fetchChain();
    } catch (e) {
      console.error('Mining failed');
    }
    setTimeout(() => setMining(false), 1000);
  };

  return (
    <div className="py-8 space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-indigo-700">
            Consensus Mechanisms Unveiled
          </span>
          <br />
          <span className="text-slate-800 text-3xl">Blockchain Explorer</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Interactive demonstration of blockchain consensus mechanisms — mine blocks, 
          stake tokens, and explore how Proof of Stake secures the network.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="PoW Blocks"
          value={chain.length}
          subtitle="Proof of Work chain"
          icon="⛏️"
          color="amber"
        />
        <StatsCard
          title="PoS Blocks"
          value={posChain.length}
          subtitle="Proof of Stake chain"
          icon="⚡"
          color="blue"
        />
        <StatsCard
          title="Validators"
          value={Object.keys(validators).length}
          subtitle="Active stakers"
          icon="👥"
          color="green"
        />
        <StatsCard
          title="Total Staked"
          value={Object.values(validators).reduce((a, b) => a + b, 0)}
          subtitle="tokens locked"
          icon="🔒"
          color="purple"
        />
      </div>

      {/* Mine Block Section */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Mine a Block (PoW)</h2>
            <p className="text-slate-500 text-sm mt-1">
              Uses proof of work — finds a hash with 5 leading zeros
            </p>
          </div>
          <motion.button
            onClick={mineBlock}
            disabled={mining}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-xl font-semibold text-white btn-shine transition-all
              ${mining
                ? 'bg-amber-400 cursor-wait mining-active'
                : 'bg-amber-500 hover:bg-amber-600 hover:shadow-md'
              }`}
          >
            {mining ? (
              <span className="flex items-center space-x-2">
                <span className="animate-spin">⛏️</span>
                <span>Mining...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <span>⛏️</span>
                <span>Mine Block</span>
              </span>
            )}
          </motion.button>
        </div>

        {/* Last mined block info */}
        <AnimatePresence>
          {lastMined && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"
            >
              <p className="text-emerald-700 font-semibold">✓ {lastMined.Message}</p>
              <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-slate-500">Block Index: </span>
                  <span className="text-slate-900 font-mono">#{lastMined.index}</span>
                </div>
                <div>
                  <span className="text-slate-500">Timestamp: </span>
                  <span className="text-slate-900 font-mono">{lastMined.time_stamp?.slice(0, 19)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Previous Hash: </span>
                  <span className="text-slate-800 font-mono text-xs">{lastMined.previous_hash}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Blocks */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent PoW Blocks</h2>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {chain.reverse().map((block, i) => (
            <div key={block.index} className="flex items-center">
              <BlockCard block={block} index={i} isGenesis={block.index === 1} />
              {i < chain.slice(-5).length - 1 && (
                <div className="mx-3 flex-shrink-0">
                  <div className="w-8 h-0.5 bg-indigo-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PoW vs PoS Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">⛏️</span>
            <h3 className="text-xl font-bold text-amber-700">Proof of Work</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="text-amber-600 mt-0.5">●</span>
              <span>Miners compete to solve complex mathematical puzzles</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-600 mt-0.5">●</span>
              <span>High energy consumption (computational intensive)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-600 mt-0.5">●</span>
              <span>Security through computational difficulty</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-600 mt-0.5">●</span>
              <span>Used by Bitcoin, Litecoin</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-600 mt-0.5">✗</span>
              <span>Vulnerable to 51% hash rate attacks</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-3xl">⚡</span>
            <h3 className="text-xl font-bold text-indigo-700">Proof of Stake</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-0.5">●</span>
              <span>Validators are chosen based on their staked tokens</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-0.5">●</span>
              <span>Energy efficient — no mining hardware needed</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-0.5">●</span>
              <span>Security through economic incentives (slashing)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-indigo-500 mt-0.5">●</span>
              <span>Used by Ethereum 2.0, Cardano, Solana</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 mt-0.5">✓</span>
              <span>More scalable and environmentally friendly</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
