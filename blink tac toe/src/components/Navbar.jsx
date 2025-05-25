import React from 'react';

const Navbar = ({
  setShowHelp,
  setShowSettings,
  setShowLeaderboard,
  resetGame,
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <button
            className="nav-neon nav-neon-magenta"
            onClick={resetGame}
            title="Home / Reset Game"
          >
            <span className="icon">🏠</span> Home
          </button>
          <button
            className="nav-neon nav-neon-purple"
            onClick={() => setShowHelp(true)}
            title="Help"
          >
            <span className="icon">❓</span> Help
          </button>
          <button
            className="nav-neon nav-neon-blue"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            <span className="icon">⚙️</span> Settings
          </button>
          <button
            className="nav-neon nav-neon-pink"
            onClick={() => setShowLeaderboard(true)}
            title="Leaderboard"
          >
            <span className="icon">🏆</span> Leaderboard
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;