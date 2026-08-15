import React from 'react';

const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all_levels: 'All Levels',
};

const levelStyles: Record<string, string> = {
  beginner: 'bg-navy-950/90 text-emerald-400 border-emerald-500/60 shadow-lg',
  intermediate: 'bg-navy-950/90 text-amber-400 border-amber-500/60 shadow-lg',
  advanced: 'bg-navy-950/90 text-purple-400 border-purple-500/60 shadow-lg',
  all_levels: 'bg-navy-950/90 text-brand-400 border-brand-500/60 shadow-lg',
};

export function LevelBadge({ level, className = '' }: { level: string; className?: string }) {
  const normalizedLevel = (level || 'beginner').toLowerCase();
  const label = levelLabels[normalizedLevel] || normalizedLevel.replace('_', ' ');
  const style = levelStyles[normalizedLevel] || levelStyles.all_levels;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${style} ${className}`}
    >
      {label}
    </span>
  );
}
