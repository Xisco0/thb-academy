'use client';

import * as React from 'react';

export type Theme = 'dark' | 'light' | 'system';

export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: Theme;
  forcedTheme?: Theme;
  enableSystem?: boolean;
  storageKey?: string;
  [key: string]: unknown;
}

interface ThemeProviderContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = React.createContext<ThemeProviderContextType>({
  theme: 'dark',
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  forcedTheme = 'dark',
  storageKey = 'thb-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(forcedTheme || defaultTheme);

  React.useEffect(() => {
    const root = document.documentElement;
    const activeTheme = forcedTheme || theme;
    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
  }, [theme, forcedTheme]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      if (forcedTheme) return;
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // Ignore storage error
      }
      setThemeState(newTheme);
    },
    [forcedTheme, storageKey]
  );

  return (
    <ThemeProviderContext.Provider value={{ theme: forcedTheme || theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => React.useContext(ThemeProviderContext);
