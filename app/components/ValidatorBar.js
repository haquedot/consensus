'use client';

import { motion } from 'framer-motion';

export default function ValidatorBar({ name, stake, totalStake, isSelected, color }) {
  const percentage = ((stake / totalStake) * 100).toFixed(1);
  const colors = {
    blue:   'bg-indigo-600',
    green:  'bg-emerald-600',
    purple: 'bg-purple-600',
    amber:  'bg-amber-500',
    pink:   'bg-pink-600',
    cyan:   'bg-cyan-600',
  };
  const barColors = {
    blue:   'bg-indigo-500',
    green:  'bg-emerald-500',
    purple: 'bg-purple-500',
    amber:  'bg-amber-500',
    pink:   'bg-pink-500',
    cyan:   'bg-cyan-500',
  };
  const bgColor  = colors[color]    || colors.blue;
  const barColor = barColors[color] || barColors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`glass-card p-4 transition-all duration-300 ${
        isSelected ? 'border-emerald-400 shadow-md' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center text-white font-bold text-sm`}>
            {name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{name}</p>
            <p className="text-xs text-slate-500">{stake} tokens staked</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-indigo-600">{percentage}%</p>
          <p className="text-xs text-slate-400">selection chance</p>
        </div>
      </div>
      
      {/* Stake bar */}
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 flex items-center space-x-1 text-emerald-600 text-xs font-medium"
        >
          <span>✓</span>
          <span>Selected as block validator</span>
        </motion.div>
      )}
    </motion.div>
  );
}
