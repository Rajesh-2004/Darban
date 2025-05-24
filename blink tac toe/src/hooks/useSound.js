import { useRef } from 'react';

const useSound = (soundPath, { loop = false, volume = 1 } = {}) => {
  const audioRef = useRef(null);

  try {
    audioRef.current = new Audio(soundPath);
    audioRef.current.loop = loop;
    audioRef.current.volume = volume;
  } catch (error) {
    console.warn(`Failed to load audio: ${soundPath}`, error);
  }

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.warn(`Audio playback failed for ${soundPath}:`, error);
      });
    }
  };

  return play;
};

export default useSound;