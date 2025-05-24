import Tilt from 'react-parallax-tilt'

const GameBoard = ({ board, winner, handleCellClick }) => {
  return (
    <Tilt tiltMaxAngleX={20} tiltMaxAngleY={20} scale={1.05} className="w-full">
      <div className="grid grid-cols-3 gap-3 bg-gray-950 bg-opacity-90 backdrop-blur-lg p-6 rounded-2xl border-2 border-neon-cyan animate-neon-flicker">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`w-24 h-24 flex items-center justify-center text-5xl cursor-pointer bg-gray-700 bg-opacity-70 rounded-xl hover:bg-opacity-90 transition-all duration-300 ${winner && winner !== cell?.player ? 'opacity-50' : ''} relative overflow-hidden group border border-neon-pink`}
            onClick={() => handleCellClick(index)}
          >
            {cell && (
              <span className="animate-neon-trail group-hover:scale-110 transition-transform duration-300 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                {cell.emoji}
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-pink to-neon-cyan opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="absolute inset-0 ripple-effect pointer-events-none"></div>
          </div>
        ))}
      </div>
    </Tilt>
  )
}

export default GameBoard