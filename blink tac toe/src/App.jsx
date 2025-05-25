import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import GameBoard from './components/GameBoard.jsx';
import HelpModal from './components/HelpModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import Navbar from './components/Navbar.jsx';
import { emojiCategories, winCombinations } from './constants.js';
import useSound from './hooks/useSound.js';
import useLocalStorage from './hooks/useLocalStorage.js';
import './App.css';

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerCategories, setPlayerCategories] = useLocalStorage('playerCategories', { 1: null, 2: null });
  const [playerNames, setPlayerNames] = useLocalStorage('playerNames', { 1: 'Player 1', 2: 'Player 2' });
  const [playerMoves, setPlayerMoves] = useState({ 1: [], 2: [] });
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useLocalStorage('scores', { 1: 0, 2: 0 });
  const [leaderboard, setLeaderboard] = useLocalStorage('leaderboard', []);
  const [showCategorySelector, setShowCategorySelector] = useState(!playerCategories[1]);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [musicVolume, setMusicVolume] = useLocalStorage('musicVolume', 0.5);
  const [sfxVolume, setSfxVolume] = useLocalStorage('sfxVolume', 1);
  const [gameMode, setGameMode] = useLocalStorage('gameMode', 'normal');
  const [timeLeft, setTimeLeft] = useState(15);
  const [powerUps, setPowerUps] = useState({ 1: { freeze: true, clear: true }, 2: { freeze: true, clear: true } });
  const [isFrozen, setIsFrozen] = useState(false);
  const [showEmojiExplosion, setShowEmojiExplosion] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const { play: playPop } = useSound('/sounds/pop.mp3', { volume: sfxVolume });
  const { play: playWhoosh } = useSound('/sounds/whoosh.mp3', { volume: sfxVolume });
  const { play: playWin, isReady: winSoundReady } = useSound('/sounds/win.mp3', { volume: sfxVolume });
  const { play: playClick, isReady: clickSoundReady } = useSound('/sounds/click.mp3', { volume: sfxVolume });
  const { play: playReset } = useSound('/sounds/reset.mp3', { volume: sfxVolume });
  const { play: playInvalid } = useSound('/sounds/invalid.mp3', { volume: sfxVolume });
  const { play: playBackground } = useSound('/sounds/background.mp3', { loop: true, volume: musicVolume });

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        console.log('User interaction detected, enabling audio playback');
        setHasInteracted(true);
        // Unlock audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(0, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.01);
        console.log('Audio context unlocked');
        audioContext.close();
        // Preload win.mp3 and click.mp3
        const winAudio = new Audio('/sounds/win.mp3');
        const clickAudio = new Audio('/sounds/click.mp3');
        winAudio.preload = 'auto';
        clickAudio.preload = 'auto';
        const handleWinCanPlay = () => console.log('Win.mp3 preloaded and ready');
        const handleClickCanPlay = () => console.log('Click.mp3 preloaded and ready');
        winAudio.addEventListener('canplaythrough', handleWinCanPlay);
        clickAudio.addEventListener('canplaythrough', handleClickCanPlay);
        winAudio.load();
        clickAudio.load();
        if (musicVolume > 0) {
          playBackground();
          console.log('playBackground called, volume:', musicVolume);
        }
        return () => {
          winAudio.removeEventListener('canplaythrough', handleWinCanPlay);
          clickAudio.removeEventListener('canplaythrough', handleClickCanPlay);
        };
      }
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted, musicVolume, playBackground]);

  useEffect(() => {
    console.log('Sound settings updated', { musicVolume, sfxVolume });
    if (hasInteracted) {
      if (musicVolume > 0) {
        playBackground();
      } else {
        console.log('Background music volume is 0, pausing');
      }
      if (sfxVolume > 0 && clickSoundReady) {
        playClick();
      }
    }
  }, [musicVolume, sfxVolume, hasInteracted, playBackground, playClick, clickSoundReady]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (gameMode !== 'timeAttack' && gameMode !== 'blitz' || winner || isDraw || showCategorySelector || isFrozen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
          return gameMode === 'blitz' ? 10 : 15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameMode, winner, isDraw, showCategorySelector, isFrozen, currentPlayer]);

  useEffect(() => {
    if (winner || isDraw) return;
    for (const combo of winCombinations) {
      const [a, b, c] = combo;
      if (
        board[a] &&
        board[b] &&
        board[c] &&
        board[a].player === board[b].player &&
        board[a].player === board[c].player
      ) {
        setWinner(board[a].player);
        setWinningCells([a, b, c]);
        setScores((prev) => ({
          ...prev,
          [board[a].player]: prev[board[a].player] + 1,
        }));
        setLeaderboard((prev) => {
          const newEntry = {
            name: playerNames[board[a].player],
            score: scores[board[a].player] + 1,
            date: new Date().toISOString(),
          };
          return [...prev, newEntry]
            .sort((x, y) => y.score - x.score)
            .slice(0, 5);
        });
        setShowConfetti(true);
        console.log('Win detected', { player: board[a].player, sfxVolume, hasInteracted, winSoundReady });
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
        return;
      }
    }
    if (board.every((cell) => cell !== null) && !winner) {
      setIsDraw(true);
      setShowConfetti(true);
      console.log('Draw detected', { sfxVolume, hasInteracted, winSoundReady });
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }, [board, playerNames, scores, setScores, setLeaderboard, winner, isDraw, hasInteracted, sfxVolume, winSoundReady]);

  useEffect(() => {
    if (showConfetti && (winner || isDraw)) {
      console.log('Confetti triggered, duration: 2000ms');
      const confettiTimeout = setTimeout(() => {
        setShowConfetti(false);
        console.log('Confetti stopped');
      }, 2000);
      return () => clearTimeout(confettiTimeout);
    }
  }, [showConfetti, winner, isDraw]);

  useEffect(() => {
    if (winner || isDraw) {
      console.log('Winner popup triggered', { sfxVolume, hasInteracted, winSoundReady });
      if (hasInteracted && sfxVolume > 0 && winSoundReady) {
        playWin().then((success) => {
          console.log(success ? 'playWin succeeded for popup' : 'playWin failed for popup');
          if (!success && clickSoundReady) {
            playClick();
            console.log('Fallback: playClick called for popup');
          }
        });
      } else {
        console.log('playWin skipped for popup', { hasInteracted, sfxVolume, winSoundReady });
        if (hasInteracted && sfxVolume > 0 && clickSoundReady) {
          playClick();
          console.log('Fallback: playClick called for popup');
        }
      }
    }
  }, [winner, isDraw, hasInteracted, sfxVolume, playWin, winSoundReady, playClick, clickSoundReady]);

  const getRandomEmoji = (player) => {
    const category = playerCategories[player] || 'animals';
    const emojis = emojiCategories[category];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const handleCategorySelect = (player, category) => {
    setPlayerCategories((prev) => ({ ...prev, [player]: category }));
    setPlayerNames((prev) => ({ ...prev, [player]: `Player ${player}` }));
    if (player === 1) {
      setShowCategorySelector(true);
      setCurrentPlayer(2);
    } else {
      setShowCategorySelector(false);
      setCurrentPlayer(1);
      setTimeLeft(gameMode === 'blitz' ? 10 : 15);
    }
    playClick();
  };

  const handleCellClick = (index) => {
    if (
      board[index] ||
      winner ||
      isDraw ||
      !playerCategories[1] ||
      !playerCategories[2] ||
      showCategorySelector ||
      isFrozen
    ) {
      playInvalid();
      return;
    }
    const player = currentPlayer;
    const newMoves = { ...playerMoves };
    const newBoard = [...board];

    if (newMoves[player].length >= 3) {
      const oldestMove = newMoves[player][0];
      if (index === oldestMove) {
        playInvalid();
        return;
      }
      newBoard[oldestMove] = null;
      newMoves[player].shift();
      playWhoosh();
    }

    const emoji = getRandomEmoji(player);
    newBoard[index] = { emoji, player };
    newMoves[player].push(index);
    setBoard(newBoard);
    setPlayerMoves(newMoves);
    setCurrentPlayer(player === 1 ? 2 : 1);
    setTimeLeft(gameMode === 'blitz' ? 10 : 15);
    playPop();
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleFreezeTime = () => {
    if (!powerUps[currentPlayer].freeze) return;
    setIsFrozen(true);
    setPowerUps((prev) => ({
      ...prev,
      [currentPlayer]: { ...prev[currentPlayer], freeze: false },
    }));
    setShowEmojiExplosion(true);
    setTimeout(() => setIsFrozen(false), 5000);
    setTimeout(() => setShowEmojiExplosion(false), 1000);
    playClick();
  };

  const handleClearCell = () => {
    if (!powerUps[currentPlayer].clear) return;
    const opponent = currentPlayer === 1 ? 2 : 1;
    const opponentMoves = playerMoves[opponent];
    if (opponentMoves.length > 0) {
      const newBoard = [...board];
      const newMoves = { ...playerMoves };
      const cellToClear = opponentMoves[0];
      newBoard[cellToClear] = null;
      newMoves[opponent].shift();
      setBoard(newBoard);
      setPlayerMoves(newMoves);
      setPowerUps((prev) => ({
        ...prev,
        [currentPlayer]: { ...prev[currentPlayer], clear: false },
      }));
      setShowEmojiExplosion(true);
      setTimeout(() => setShowEmojiExplosion(false), 1000);
      playWhoosh();
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(1);
    setPlayerMoves({ 1: [], 2: [] });
    setWinner(null);
    setWinningCells([]);
    setIsDraw(false);
    setShowCategorySelector(!playerCategories[1]);
    setTimeLeft(gameMode === 'blitz' ? 10 : 15);
    setPowerUps({ 1: { freeze: true, clear: true }, 2: { freeze: true, clear: true } });
    setShowConfetti(false);
    playReset();
  };

  const resetScores = () => {
    setScores({ 1: 0, 2: 0 });
    setLeaderboard([]);
    playClick();
  };

  const resetPlayers = () => {
    setPlayerNames({ 1: 'Player 1', 2: 'Player 2' });
    setPlayerCategories({ 1: null, 2: null });
    setShowCategorySelector(true);
    playClick();
  };

  return (
    <div className="min-h-screen bg-gradient animate-gradient-shift" onClick={() => setHasInteracted(true)}>
      <Navbar
        setShowHelp={setShowHelp}
        setShowSettings={setShowSettings}
        setShowLeaderboard={setShowLeaderboard}
        resetGame={resetGame}
      />
      <div className="radial-overlay"></div>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={200}
          recycle={false}
          run={true}
          gravity={0.3}
          initialVelocityY={-10}
          tweenDuration={2000}
          colors={['#ff3399', '#00e6e6', '#ffffff']}
        />
      )}
      {showEmojiExplosion && (
        <div className="emoji-explosion">
          <span className="emoji-burst animate-particle-burst">💥</span>
        </div>
      )}
      <div className="game-container animate-fade-in">
        <h1 className="title animate-neon-flicker">Blink Tac Toe</h1>
        <div className="score-board">
          <span className="score-text">
            {playerNames[1]}: {scores[1]} | {playerNames[2]}: {scores[2]}
          </span>
        </div>
        <p className={`player-turn ${currentPlayer === 1 ? 'text-neon-cyan' : 'text-neon-pink'}`}>
          <span className="player-name">{playerNames[currentPlayer]}</span>
          {(gameMode === 'timeAttack' || gameMode === 'blitz') && !winner && !isDraw && !showCategorySelector && !isFrozen && (
            <span className="timer">| Time: {timeLeft}s</span>
          )}
          <span className="underline animate-neon-underline"></span>
        </p>
        <div className="power-up-buttons">
          <button
            className={`btn-neon btn-neon-green power-up-btn ${!powerUps[currentPlayer].freeze && 'disabled'}`}
            onClick={handleFreezeTime}
            disabled={!powerUps[currentPlayer].freeze}
          >
            <span className="icon">🕒</span> Freeze Time
          </button>
          <button
            className={`btn-neon btn-neon-red power-up-btn ${!powerUps[currentPlayer].clear && 'disabled'}`}
            onClick={handleClearCell}
            disabled={!powerUps[currentPlayer].clear}
          >
            <span className="icon">🧹</span> Clear Cell
          </button>
        </div>
        <div className="board-wrapper">
          <GameBoard
            board={board}
            winner={winner}
            winningCells={winningCells}
            isDraw={isDraw}
            handleCellClick={handleCellClick}
            showCategorySelector={showCategorySelector}
            currentPlayer={currentPlayer}
            onCategorySelect={handleCategorySelect}
          />
        </div>
        {(winner || isDraw) && (
          <div className={`winner-message animate spring-up ${isDraw ? 'draw-message' : ''}`}>
            <p className="winner-text animate-neon-flicker">
              {isDraw ? 'Draw!' : `${playerNames[winner]} Wins!`}
            </p>
            <button
              className="btn-neon btn-neon-cyan play-again-btn animate-fade-in"
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        )}
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        {showSettings && (
          <SettingsModal
            onClose={() => setShowSettings(false)}
            musicVolume={musicVolume}
            setMusicVolume={setMusicVolume}
            sfxVolume={sfxVolume}
            setSfxVolume={setSfxVolume}
            gameMode={gameMode}
            setGameMode={setGameMode}
            resetScores={resetScores}
            resetPlayers={resetPlayers}
          />
        )}
        {showLeaderboard && (
          <div className="modal-overlay animate-fade-in">
            <div className="modal leaderboard-modal animate spring-up">
              <h2 className="modal-title animate-neon-flicker">Leaderboard</h2>
              <ul className="leaderboard-list">
                {leaderboard.map((entry, index) => (
                  <li key={index} className="leaderboard-item">
                    <span>{entry.name}</span>
                    <span>{entry.score} ({new Date(entry.date).toLocaleDateString()})</span>
                  </li>
                ))}
                {leaderboard.length === 0 && <p className="no-scores">No scores yet!</p>}
              </ul>
              <button className="btn-neon btn-neon-blue close-btn" onClick={() => setShowLeaderboard(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;