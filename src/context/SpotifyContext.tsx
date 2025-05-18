import React, { createContext, useContext, useState } from 'react';

type SpotifyContextType = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
};

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <SpotifyContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) throw new Error('useSpotify must be used within a SpotifyProvider');
  return context;
};
