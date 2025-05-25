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
  resetPlayers,
}) => {
  const gameModes = [
    { id: 'normal', label: 'Normal', color: 'btn-neon-cyan' },
    { id: 'timeAttack', label: 'Time Attack', color: 'btn-neon-pink' },
    { id: 'blitz', label: 'Blitz', color: 'btn-neon-yellow' },
  ];

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal settings-modal animate spring-up">
        <h2 className="modal-title animate-neon-flicker">Settings</h2>
        <div className="settings-content">
          <div className="setting-group">
            <label className="setting-label">Music Volume: {Math.round(musicVolume * 100)}%</label>
            <input
              type="range"
              className="slider"
              min="0"
              max="1"
              step="0.01"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            />
          </div>
          <div className="setting-group">
            <label className="setting-label">SFX Volume: {Math.round(sfxVolume * 100)}%</label>
            <input
              type="range"
              className="slider"
              min="0"
              max="1"
              step="0.01"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
            />
          </div>
          <div className="setting-group">
            <label className="setting-label">Game Mode</label>
            <div className="game-mode-buttons">
              {gameModes.map((mode) => (
                <button
                  key={mode.id}
                  className={`game-mode-btn btn-neon ${mode.color} ${gameMode === mode.id ? 'active' : ''}`}
                  onClick={() => setGameMode(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <button
            className="btn-neon btn-neon-red reset-scores-btn"
            onClick={resetScores}
          >
            Reset Scores
          </button>
          <button
            className="btn-neon btn-neon-purple reset-players-btn"
            onClick={resetPlayers}
          >
            Reset Players
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