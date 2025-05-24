import React from 'react';

const SettingsModal = ({
  onClose,
  musicVolume,
  setMusicVolume,
  sfxVolume,
  setSfxVolume,
  gameMode,
  setGameMode,
  resetScores,
}) => {
  const handleMusicVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    console.log('Music volume changed:', value);
    setMusicVolume(value);
  };

  const handleSfxVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    console.log('SFX volume changed:', value);
    setSfxVolume(value);
  };

  const handleGameModeChange = (e) => {
    const value = e.target.value;
    console.log('Game mode changed:', value);
    setGameMode(value);
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal animate spring-up">
        <h2 className="modal-title animate-neon-flicker">Settings</h2>
        <div className="settings-content">
          <label className="settings-label">
            Music Volume: {(musicVolume * 100).toFixed(0)}%
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={musicVolume}
              onChange={handleMusicVolumeChange}
              className="slider"
            />
          </label>
          <label className="settings-label">
            SFX Volume: {(sfxVolume * 100).toFixed(0)}%
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sfxVolume}
              onChange={handleSfxVolumeChange}
              className="slider"
            />
          </label>
          <label className="settings-label">
            Game Mode:
            <select value={gameMode} onChange={handleGameModeChange} className="input-field">
              <option value="normal">Normal</option>
              <option value="timeAttack">Time Attack (15s)</option>
              <option value="blitz">Blitz (10s)</option>
            </select>
          </label>
          <button className="btn-neon btn-neon-red" onClick={resetScores}>
            Reset Scores
          </button>
        </div>
        <button className="btn-neon btn-neon-blue close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;