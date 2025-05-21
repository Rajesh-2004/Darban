import { useRef } from 'react';

const useSound = (soundPath) => {
  const audioRef = useRef(new Audio(soundPath));

  const play = () => {
    audioRef.current.currentTime = 0; // Reset to start
    audioRef.current.play().catch((error) => {
      console.warn('Audio playback failed:', error);
    });
  };

  return play;
};

export default useSound;