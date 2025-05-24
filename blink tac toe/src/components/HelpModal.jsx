const HelpModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-xl flex items-center justify-center animate-fade-in">
      <div className="bg-gray-950 bg-opacity-95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border-2 border-neon-pink max-w-md w-full animate-spring-up">
        <h2 className="text-3xl font-bold text-white mb-6 text-center animate-neon-flicker">How to Play</h2>
        <p className="mb-3 text-white">1. Choose a name and emoji category for each player.</p>
        <p className="mb-3 text-white">2. Take turns placing emojis on the 3x3 grid.</p>
        <p className="mb-3 text-white">3. In Normal/Time Attack/Blitz modes, the oldest emoji vanishes after 3 moves (except in Classic mode).</p>
        <p className="mb-3 text-white">4. Time Attack: 15s per turn. Blitz: 10s per turn with random emoji swaps.</p>
        <p className="mb-3 text-white">5. Use power-ups: Freeze Time (5s pause) or Clear Cell (remove opponent's emoji).</p>
        <p className="mb-3 text-white">6. Win by aligning 3 emojis in a row, column, or diagonal.</p>
        <button className="btn-neon btn-neon-blue w-full mt-6" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default HelpModal