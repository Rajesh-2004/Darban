import { winCombinations } from '../App.jsx';

const GameBoard = ({ board, winner, handleCellClick }) => {
  return (
    <div className="board">
      {board.map((cell, index) => {
        const isWinningCell = winner && winCombinations.some(combo =>
          combo.includes(index) &&
          board[combo[0]]?.player === winner &&
          board[combo[0]]?.player === board[combo[1]]?.player &&
          board[combo[0]]?.player === board[combo[2]]?.player
        );
        return (
          <div
            key={index}
            className={`cell ${isWinningCell ? 'winning' : ''} ${cell ? 'animate-place' : ''}`}
            onClick={() => handleCellClick(index)}
          >
            {cell ? cell.emoji : ''}
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;