import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import * as THREE from 'three';

interface InteractionState {
  clickData: { position: THREE.Vector3; time: number };
  triggerClick: (position: THREE.Vector3, time: number) => void;
}

const InteractionContext = createContext<InteractionState | null>(null);

export const InteractionProvider = ({ children }: { children: ReactNode }) => {
  const [clickData, setClickData] = useState({
    position: new THREE.Vector3(),
    time: -1, // -1 indicates no recent click
  });

  const triggerClick = useCallback((position: THREE.Vector3, time: number) => {
    // We create a new object to ensure React detects the state change
    setClickData({ position: position.clone(), time });
  }, []);

  const value = { clickData, triggerClick };

  return (
    <InteractionContext.Provider value={value}>
      {children}
    </InteractionContext.Provider>
  );
};

export const useInteraction = () => {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  return context;
};
