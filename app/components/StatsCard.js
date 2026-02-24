'use client';

import { motion } from 'framer-motion';

export default function StatsCard({ title, value, subtitle, icon, color = 'blue' }) {
  const colorMap = {
    blue:   'bg-indigo-50 border-indigo-200',
    green:  'bg-emerald-50 border-emerald-200',
    purple: 'bg-purple-50 border-purple-200',
    amber:  'bg-amber-50 border-amber-200',
  };

  const textColor = {
    blue:   'text-indigo-700',
    green:  'text-emerald-700',
    purple: 'text-purple-700',
    amber:  'text-amber-700',
  };

  const labelColor = {
    blue:   'text-indigo-500',
    green:  'text-emerald-500',
    purple: 'text-purple-500',
    amber:  'text-amber-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`glass-card p-6 ${colorMap[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium uppercase tracking-wider ${labelColor[color]}`}>{title}</p>
          <p className={`text-3xl font-bold mt-1 ${textColor[color]}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-3xl opacity-60">{icon}</div>
      </div>
    </motion.div>
  );
}
