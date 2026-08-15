'use client';

import * as React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  return (
    <div
      className="inline-flex items-center p-1 rounded-full bg-navy-900 border border-navy-800/80 shadow-inner"
      aria-label="Theme mode"
    >
      <div
        className="p-1.5 rounded-full text-navy-400 opacity-60"
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </div>

      <div
        className="p-1.5 rounded-full bg-amber-500 text-white shadow-md"
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </div>

      <div
        className="p-1.5 rounded-full text-navy-400 opacity-60"
        title="System Preference"
      >
        <Monitor className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
