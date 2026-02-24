'use client';

import { motion } from 'framer-motion';

export default function BlockCard({ block, index, isGenesis = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass-card p-5 min-w-[280px] relative group"
    >
      {/* Block number badge */}
      <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
        #{block.index}
      </div>

      {/* Genesis badge */}
      {isGenesis && (
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
          Genesis
        </div>
      )}

      <div className="mt-12 space-y-3">
        {/* Timestamp */}
        {block.timestamp && (
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Timestamp</p>
            <p className="text-sm text-slate-600 font-mono">
              {typeof block.timestamp === 'string' 
                ? block.timestamp.slice(0, 19) 
                : new Date(block.timestamp * 1000).toLocaleString()}
            </p>
          </div>
        )}

        {/* Data */}
        {block.data && (
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Data</p>
            <p className="text-sm text-indigo-700 font-medium truncate">
              {typeof block.data === 'object' ? JSON.stringify(block.data) : block.data}
            </p>
          </div>
        )}

        {/* Validator */}
        {block.validator && (
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Validator</p>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-xs text-white font-bold">
                {block.validator[0]}
              </div>
              <p className="text-sm text-emerald-700 font-medium">{block.validator}</p>
            </div>
          </div>
        )}

        {/* Proof (for PoW blocks) */}
        {block.proof && (
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Proof</p>
            <p className="text-sm text-amber-700 font-mono">{block.proof}</p>
          </div>
        )}

        {/* Hash */}
        {block.hash && (
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Hash</p>
            <p className="text-xs text-slate-600 font-mono break-all bg-slate-100 rounded-lg p-2">
              {block.hash}
            </p>
          </div>
        )}

        {/* Previous Hash */}
        {block.previous_hash && (
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Previous Hash</p>
            <p className="text-xs text-slate-500 font-mono break-all bg-slate-100 rounded-lg p-2">
              {block.previous_hash}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
