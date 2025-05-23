import { useEffect, useRef, useState } from 'react';

const useSound = (url, options = {}) => {
  const audioRef = useRef(null);
  const playAttempts = useRef(0);
  const maxPlayAttempts = 3;
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log(`Initializing audio: ${url}`);
    audioRef.current = new Audio(url);
    audioRef.current.preload = 'auto';
    audioRef.current.loop = !!options.loop;
    audioRef.current.volume = options.volume || 1;

    const handleCanPlay = () => {
      console.log(`Audio ${url} can play through`);
      setIsReady(true);
    };

    const handleLoadedData = () => {
      console.log(`Audio ${url} data loaded`);
    };

    const handleError = (e) => {
      console.error(`Audio ${url} failed to load:`, e);
      if (audioRef.current && audioRef.current.error) {
        console.error(`Error code: ${audioRef.current.error.code}, message: ${audioRef.current.error.message}`);
      }
      setIsReady(false);
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
      } else if (audioRef.current.paused && options.loop && playAttempts.current < maxPlayAttempts) {
        console.log(`Resuming ${url} due to non-zero volume`);
        audioRef.current.play().catch((error) => {
          console.error(`Failed to resume ${url}:`, error);
        });
      }
    }
  }, [options.volume]);

  const play = () => {
    if (!audioRef.current) {
      console.warn(`Audio ${url} not initialized`);
      return Promise.resolve(false);
    }

    if (playAttempts.current >= maxPlayAttempts) {
      console.warn(`Max play attempts reached for ${url}`);
      return Promise.resolve(false);
    }

    if (audioRef.current.volume === 0) {
      console.log(`Audio ${url} not played, volume is 0`);
      return Promise.resolve(false);
    }

    console.log(`Attempting to play ${url}, readyState: ${audioRef.current.readyState}, networkState: ${audioRef.current.networkState}`);
    return audioRef.current.play()
      .then(() => {
        console.log(`Successfully playing ${url}`);
        playAttempts.current = 0;
        return true;
      })
      .catch((error) => {
        console.error(`Failed to play ${url}:`, error);
        if (audioRef.current && audioRef.current.error) {
          console.error(`Error code: ${audioRef.current.error.code}, message: ${audioRef.current.error.message}`);
        }
        playAttempts.current += 1;
        if (playAttempts.current < maxPlayAttempts) {
          console.log(`Retrying play for ${url}, attempt ${playAttempts.current + 1}`);
          setTimeout(() => play(), 500);
        }
        return false;
      });
  };

  return { play, isReady };
};

export default useSound;