import React from 'react';

const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all_levels: 'All Levels',
};

const levelStyles: Record<string, string> = {
  beginner: 'bg-[#23845B]/10 text-[#23845B] border-[#23845B]/30',
  intermediate: 'bg-[#F8EBCB] text-[#9A680C] border-[#C58A19]/30',
  advanced: 'bg-[#142544]/10 text-[#142544] border-[#142544]/30',
  all_levels: 'bg-[#F8F7F4] text-[#17243A] border-[#E7E5DF]',
};

export function LevelBadge({ level, className = '' }: { level: string; className?: string }) {
  const normalizedLevel = (level || 'beginner').toLowerCase();
  const label = levelLabels[normalizedLevel] || normalizedLevel.replace('_', ' ');
  const style = levelStyles[normalizedLevel] || levelStyles.all_levels;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-xs backdrop-blur-sm ${style} ${className}`}
    >
      {label}
    </span>
  );
}
