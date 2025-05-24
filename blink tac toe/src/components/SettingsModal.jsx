import { useState, useEffect } from 'react'
import useSound from '../hooks/useSound.js'

const SettingsModal = ({ onClose, musicVolume, setMusicVolume, sfxVolume, setSfxVolume, gameMode, setGameMode, resetScores }) => {
  const playClick = useSound('/sounds/click.mp3')
  const [tempMusicVolume, setTempMusicVolume] = useState(musicVolume)
  const [tempSfxVolume, setTempSfxVolume] = useState(sfxVolume)
  const [musicMuted, setMusicMuted] = useState(musicVolume === 0)
  const [sfxMuted, setSfxMuted] = useState(sfxVolume === 0)

  useEffect(() => {
    setTempMusicVolume(musicVolume)
    setTempSfxVolume(sfxVolume)
    setMusicMuted(musicVolume === 0)
    setSfxMuted(sfxVolume === 0)
  }, [musicVolume, sfxVolume])

  const handleSave = () => {
    setMusicVolume(musicMuted ? 0 : tempMusicVolume)
    setSfxVolume(sfxMuted ? 0 : tempSfxVolume)
    playClick()
    onClose()
  }

  const handleGameModeChange = (e) => {
    setGameMode(e.target.value)
    playClick()
  }

  const handleResetScores = () => {
    resetScores()
    playClick()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-xl flex items-center justify-center animate-fade-in">
      <div className="bg-gray-950 bg-opacity-95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border-2 border-neon-pink max-w-md w-full animate-spring-up">
        <h2 className="text-3xl font-bold text-white mb-6 text-center animate-neon-flicker">Settings</h2>
        <div className="mb-6">
          <label className="block text-lg font-medium text-white mb-2">Music Volume: {(musicMuted ? 0 : tempMusicVolume * 100).toFixed(0)}%</label>
          <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div className="absolute h-3 bg-gradient-to-r from-neon-pink to-neon-cyan" style={{ width: `${musicMuted ? 0 : tempMusicVolume * 100}%` }}></div>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={musicMuted ? 0 : tempMusicVolume}
            onChange={(e) => setTempMusicVolume(parseFloat(e.target.value))}
            className="w-full h-3 appearance-none bg-transparent focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          />
          <label className="flex items-center mt-3 text-white">
            <input
              type="checkbox"
              checked={musicMuted}
              onChange={() => setMusicMuted(!musicMuted)}
              className="mr-2 accent-neon-cyan"
            />
            Mute Music
          </label>
        </div>
        <div className="mb-6">
          <label className="block text-lg font-medium text-white mb-2">Sound Effects Volume: {(sfxMuted ? 0 : tempSfxVolume * 100).toFixed(0)}%</label>
          <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div className="absolute h-3 bg-gradient-to-r from-neon-pink to-neon-cyan" style={{ width: `${sfxMuted ? 0 : tempSfxVolume * 100}%` }}></div>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={sfxMuted ? 0 : tempSfxVolume}
            onChange={(e) => setTempSfxVolume(parseFloat(e.target.value))}
            className="w-full h-3 appearance-none bg-transparent focus:outline-none focus:ring-2 focus:ring-neon-cyan"
          />
          <label className="flex items-center mt-3 text-white">
            <input
              type="checkbox"
              checked={sfxMuted}
              onChange={() => setSfxMuted(!sfxMuted)}
              className="mr-2 accent-neon-cyan"
            />
            Mute Sound Effects
          </label>
        </div>
        <div className="mb-6">
          <label className="block text-lg font-medium text-white mb-2">Game Mode:</label>
          <select value={gameMode} onChange={handleGameModeChange} className="w-full p-3 bg-gray-800 border-2 border-neon-cyan rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-pink">
            <option value="normal">Normal</option>
            <option value="timeAttack">Time Attack (15s)</option>
            <option value="blitz">Blitz (10s + Swap)</option>
            <option value="classic">Classic (No Vanish)</option>
          </select>
        </div>
        <button className="btn-neon btn-neon-red w-full mb-4" onClick={handleResetScores}>
          Reset Scores
        </button>
        <div className="flex space-x-4">
          <button className="btn-neon btn-neon-purple flex-1" onClick={handleSave}>
            Save
          </button>
          <button className="btn-neon btn-neon-blue flex-1" onClick={() => { onClose(); playClick(); }}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal