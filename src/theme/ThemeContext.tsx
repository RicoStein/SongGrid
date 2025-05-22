import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LightTheme, DarkTheme, AppTheme } from './themes';

// BESSER: Context richtig typisieren!
type ThemeContextType = {
  theme: AppTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: DarkTheme,      // Default
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<AppTheme>(DarkTheme);

  const toggleTheme = () => {
    setTheme(t =>
      t.mode === 'dark' ? LightTheme : DarkTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
