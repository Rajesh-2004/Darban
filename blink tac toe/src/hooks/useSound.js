import { useEffect, useRef, useState } from 'react'

const useSound = (url, { volume = 1, loop = false } = {}) => {
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef(null)
  const playRef = useRef(() => {})

  useEffect(() => {
    audioRef.current = new Audio(url)
    audioRef.current.volume = volume
    audioRef.current.loop = loop
    audioRef.current.preload = 'auto'

    const handleInteraction = () => {
      setHasInteracted(true)
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }

    window.addEventListener('click', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)

    return () => {
      audioRef.current.pause()
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [url])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  playRef.current = () => {
    if (!hasInteracted) return
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }

  return playRef.current
}

export default useSound