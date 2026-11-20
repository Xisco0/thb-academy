'use client';

import * as React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  return (
    <div
      className="inline-flex items-center p-1 rounded-full bg-[#F8F7F4] border border-[#E7E5DF] shadow-inner"
      aria-label="Theme mode"
    >
      <div
        className="p-1.5 rounded-full bg-[#C58A19] text-white shadow-xs"
        title="Light Mode (Default)"
      >
        <Sun className="w-3.5 h-3.5" />
      </div>

      <div
        className="p-1.5 rounded-full text-[#8896AB] opacity-60 hover:opacity-100 transition-opacity"
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </div>

      <div
        className="p-1.5 rounded-full text-[#8896AB] opacity-60 hover:opacity-100 transition-opacity"
        title="System Preference"
      >
        <Monitor className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
