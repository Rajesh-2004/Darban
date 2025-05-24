import { useState } from 'react'

const Navbar = ({ setShowHelp, setShowSettings, setShowLeaderboard, toggleMute, isMuted, resetGame }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="w-full bg-gradient-to-r from-gray-950 to-pink-950 border-b-2 border-neon-cyan shadow-2xl animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button className="text-3xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan animate-neon-flicker" onClick={resetGame}>
              Blink Tac Toe
            </button>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <button className="nav-neon nav-neon-blue" onClick={() => setShowHelp(true)}>
              Help
            </button>
            <button className="nav-neon nav-neon-purple" onClick={() => setShowSettings(true)}>
              Settings
            </button>
            <button className="nav-neon nav-neon-pink" onClick={() => setShowLeaderboard(true)}>
              Leaderboard
            </button>
            <button className={`nav-neon nav-neon-yellow ${isMuted ? 'opacity-60' : ''}`} onClick={toggleMute}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          </div>
          <div className="flex items-center sm:hidden">
            <button className="text-white hover:text-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-pink" onClick={() => setIsOpen(!isOpen)}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path className={`${isOpen ? 'hidden' : 'block'}`} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                <path className={`${isOpen ? 'block' : 'hidden'}`} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-gray-950 bg-opacity-90 backdrop-blur-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <button className="nav-neon nav-neon-blue w-full text-left" onClick={() => { setShowHelp(true); setIsOpen(false); }}>
            Help
          </button>
          <button className="nav-neon nav-neon-purple w-full text-left" onClick={() => { setShowSettings(true); setIsOpen(false); }}>
            Settings
          </button>
          <button className="nav-neon nav-neon-pink w-full text-left" onClick={() => { setShowLeaderboard(true); setIsOpen(false); }}>
            Leaderboard
          </button>
          <button className={`nav-neon nav-neon-yellow w-full text-left ${isMuted ? 'opacity-60' : ''}`} onClick={() => { toggleMute(); setIsOpen(false); }}>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar