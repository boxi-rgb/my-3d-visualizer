import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export interface MusicState {
  beatCount: number;
  isBeat: boolean;
  isSnare: boolean;
  section: 'verse' | 'chorus';
}

const BPM = 120;
const BEAT_INTERVAL = 60 / BPM; // 0.5 seconds per beat
const MEASURES_PER_SECTION = 8;
const BEATS_PER_MEASURE = 4;
const SECTION_DURATION_BEATS = MEASURES_PER_SECTION * BEATS_PER_MEASURE; // 32 beats per section

export const useMusic = (): MusicState => {
  const [beatCount, setBeatCount] = useState(0);
  const [isBeat, setIsBeat] = useState(false);
  const [isSnare, setIsSnare] = useState(false);
  const [section, setSection] = useState<'verse' | 'chorus'>('verse');

  const lastBeatTime = useRef(0);
  const frameState = useRef({ isBeat: false, isSnare: false });

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    // Reset transient flags at the beginning of each frame
    frameState.current = { isBeat: false, isSnare: false };

    if (elapsedTime - lastBeatTime.current >= BEAT_INTERVAL) {
      lastBeatTime.current = elapsedTime;
      frameState.current.isBeat = true; // A beat has occurred this frame

      // Use a functional update for state that depends on the previous state
      setBeatCount(c => {
        const newBeatCount = c + 1;

        const currentBeatInMeasure = (newBeatCount - 1) % BEATS_PER_MEASURE;
        // Snare on beats 2 and 4
        if (currentBeatInMeasure === 1 || currentBeatInMeasure === 3) {
          frameState.current.isSnare = true;
        }

        // Change section every N beats
        if (newBeatCount > 0 && newBeatCount % SECTION_DURATION_BEATS === 0) {
          setSection(prev => (prev === 'verse' ? 'chorus' : 'verse'));
        }

        return newBeatCount;
      });
    }

    // Update the transient state flags for consumers
    setIsBeat(frameState.current.isBeat);
    setIsSnare(frameState.current.isSnare);
  });

  return { beatCount, isBeat, isSnare, section };
};
