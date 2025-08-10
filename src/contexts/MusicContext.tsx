import { createContext, useContext, ReactNode } from 'react';
import { useMusic, MusicState } from '../hooks/useMusic';

// Create a context with a default value.
// The default value is only used when a component is not wrapped in the provider.
const defaultState: MusicState = {
  beatCount: 0,
  isBeat: false,
  isSnare: false,
  section: 'verse',
};

const MusicContext = createContext<MusicState>(defaultState);

// The provider component that wraps the application,
// making the music state available to any child component.
export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const musicState = useMusic();
  return (
    <MusicContext.Provider value={musicState}>
      {children}
    </MusicContext.Provider>
  );
};

// A custom hook for components to easily access the music state.
export const useMusicContext = () => {
  return useContext(MusicContext);
};
