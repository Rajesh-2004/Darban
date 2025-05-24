import { useEffect, useRef } from 'react';

const useSound = (url, options = {}) => {
  const audioRef = useRef(null);
  const playAttempts = useRef(0);
  const maxPlayAttempts = 3;

  useEffect(() => {
    console.log(`Initializing audio: ${url}`);
    audioRef.current = new Audio(url);
    audioRef.current.preload = 'auto';
    audioRef.current.loop = !!options.loop;
    audioRef.current.volume = options.volume || 1;

    const handleCanPlay = () => {
      console.log(`Audio ${url} can play through`);
    };

    const handleLoadedData = () => {
      console.log(`Audio ${url} data loaded`);
    };

    const handleError = (e) => {
      console.error(`Audio ${url} failed to load:`, e);
    };

    audioRef.current.addEventListener('canplaythrough', handleCanPlay);
    audioRef.current.addEventListener('loadeddata', handleLoadedData);
    audioRef.current.addEventListener('error', handleError);

    const handleEnded = () => {
      if (options.loop) {
        console.log(`Audio ${url} ended, looping`);
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((error) => {
          console.error(`Audio ${url} loop playback failed:`, error);
        });
      }
    };
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('canplaythrough', handleCanPlay);
        audioRef.current.removeEventListener('loadeddata', handleLoadedData);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current = null;
      }
    };
  }, [url, options.loop]);

  useEffect(() => {
    if (audioRef.current) {
      const newVolume = options.volume || 1;
      audioRef.current.volume = newVolume;
      console.log(`Updated volume for ${url}: ${newVolume}`);
      if (newVolume === 0) {
        audioRef.current.pause();
        console.log(`Paused ${url} due to zero volume`);
      } else if (audioRef.current.paused && options.loop) {
        audioRef.current.play().catch((error) => {
          console.error(`Failed to resume ${url}:`, error);
        });
      }
    }
  }, [options.volume]);

  const play = () => {
    if (!audioRef.current) {
      console.warn(`Audio ${url} not initialized`);
      return;
    }

    if (playAttempts.current >= maxPlayAttempts) {
      console.warn(`Max play attempts reached for ${url}`);
      return;
    }

    if (audioRef.current.volume === 0) {
      console.log(`Audio ${url} not played, volume is 0`);
      return;
    }

    console.log(`Attempting to play ${url}`);
    audioRef.current.play()
      .then(() => {
        console.log(`Successfully playing ${url}`);
        playAttempts.current = 0;
      })
      .catch((error) => {
        console.error(`Failed to play ${url}:`, error);
        playAttempts.current += 1;
        if (playAttempts.current < maxPlayAttempts) {
          console.log(`Retrying play for ${url}, attempt ${playAttempts.current + 1}`);
          setTimeout(() => play(), 500);
        }
      });
  };

  return play;
};

export default useSound;