import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard.jsx';
import CategorySelector from './components/CategorySelector.jsx';
import HelpModal from './components/HelpModal.jsx';
import { emojiCategories, winCombinations } from './constants.js';
import useSound from './hooks/useSound.js';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerCategories, setPlayerCategories] = useState({ 1: null, 2: null });
  const [playerMoves, setPlayerMoves] = useState({ 1: [], 2: [] });
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [showCategorySelector, setShowCategorySelector] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  // Sound effects
  const playPop = useSound('/sounds/pop.mp3');
  const playWhoosh = useSound('/sounds/whoosh.mp3');
  const playWin = useSound('/sounds/win.mp3');
  const playClick = useSound('/sounds/click.mp3');
  const playBackground = useSound('/sounds/background.mp3', { loop: true, volume: 0.3 });

  // Play background music on load
  useEffect(() => {
    playBackground();
  }, [playBackground]);

  // Check for winner
  useEffect(() => {
    const checkWinner = () => {
      if (winner) return;
      for (const combo of winCombinations) {
        const [a, b, c] = combo;
        if (
          board[a] &&
          board[b] &&
          board[c] &&
          board[a].player === board[b].player &&
          board[a].player === board[c].player &&
          board[a].player
        ) {
          setWinner(board[a].player);
          setScores((prev) => ({ ...prev, [board[a].player]: prev[board[a].player] + 1 }));
          playWin();
          return;
        }
      }
    };
    checkWinner();
  }, [board, winner, playWin]);

  // Get random emoji
  const getRandomEmoji = (player) => {
    const category = playerCategories[player];
    const emojis = emojiCategories[category];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  // Handle category selection
  const handleCategorySelect = (player, category) => {
    setPlayerCategories((prev) => ({ ...prev, [player]: category }));
    if (player === 1) {
      setShowCategorySelector(true); // Show for Player 2
      setCurrentPlayer(2);
    } else {
      setShowCategorySelector(false); // Start game
      setCurrentPlayer(1);
    }
    playClick();
  };

  // Handle cell click
  const handleCellClick = (index) => {
    if (board[index] || winner || !playerCategories[1] || !playerCategories[2]) return;

    const newBoard = [...board];
    const newMoves = { ...playerMoves };
    const player = currentPlayer;

    // Vanishing rule
    if (playerMoves[player].length >= 3) {
      const oldestMove = playerMoves[player][0];
      if (oldestMove === index) return;
      newBoard[oldestMove] = null;
      newMoves[player].shift();
      playWhoosh();
    }

    // Place new emoji
    const emoji = getRandomEmoji(player);
    newBoard[index] = { emoji, player };
    newMoves[player].push(index);

    setBoard(newBoard);
    setPlayerMoves(newMoves);
    setCurrentPlayer(player === 1 ? 2 : 1);
    playPop();
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setPlayerMoves({ 1: [], 2: [] });
    setWinner(null);
    setPlayerCategories({ 1: null, 2: null });
    setShowCategorySelector(true);
    playClick();
  };

  return (
    <div className="app">
      <h1 className="title">Blink Tac Toe</h1>
      <div className="status">
        <span className="score">Player 1: {scores[1]} | Player 2: {scores[2]}</span>
        <button className="help-button" onClick={() => { setShowHelp(true); playClick(); }}>
          Help
        </button>
      </div>
      <p className={`turn-indicator player-${currentPlayer}`}>Turn: Player {currentPlayer}</p>
      <GameBoard board={board} winner={winner} handleCellClick={handleCellClick} />
      {winner && (
        <div className="win-message">
          <p className="win-text">Player {winner} Wins!</p>
          <button className="play-again-button" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}
      {showCategorySelector && <CategorySelector player={currentPlayer} onSelect={handleCategorySelect} />}
      {showHelp && <HelpModal onClose={() => { setShowHelp(false); playClick(); }} />}
    </div>
  );
};

export default App;