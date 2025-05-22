// src/theme/themes.ts

export const DarkTheme = {
  mode: 'dark' as const,
  primary: '#0B3D91',
  background: '#0f0528',   // primaryDark als Hintergrund
  accent: '#5538fb',
  accent2: '#442fd3',
  yellow: '#eab676',
  white: '#fff',
  text: '#b1b0b6',
  inputBackground: '#11082b',
  inputBorder: '#302a4b',
  iconBg: '#180e33',
  gray: '#ccc',
  error: 'red',
  placeholder: '#666',
};

export const LightTheme = {
  mode: 'light' as const,
  primary: '#0B3D91',
  background: '#fff',             // White background
  accent: '#5538fb',
  accent2: '#442fd3',
  yellow: '#eab676',
  white: '#fff',
  text: '#222',                   // Darker Text für Light Mode
  inputBackground: '#f3f3f3',     // Helleres Input-Feld
  inputBorder: '#d5d5d5',         // Hellere Border
  iconBg: '#ece9fa',              // Helleres Lila für Icons
  gray: '#ccc',
  error: 'red',
  placeholder: '#888',
};

export type AppTheme = typeof DarkTheme | typeof LightTheme;