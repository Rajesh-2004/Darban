import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import GameBoard from './components/GameBoard.jsx'
import CategorySelector from './components/CategorySelector.jsx'
import HelpModal from './components/HelpModal.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import Navbar from './components/Navbar.jsx'
import { emojiCategories, winCombinations } from './constants.js'
import useSound from './hooks/useSound.js'
import useLocalStorage from './hooks/useLocalStorage.js'
import './App.css'

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [playerCategories, setPlayerCategories] = useState({ 1: null, 2: null })
  const [playerNames, setPlayerNames] = useState({ 1: 'Player 1', 2: 'Player 2' })
  const [playerMoves, setPlayerMoves] = useState({ 1: [], 2: [] })
  const [winner, setWinner] = useState(null)
  const [scores, setScores] = useLocalStorage('scores', { 1: 0, 2: 0 })
  const [leaderboard, setLeaderboard] = useLocalStorage('leaderboard', [])
  const [showCategorySelector, setShowCategorySelector] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [musicVolume, setMusicVolume] = useLocalStorage('musicVolume', 0.2)
  const [sfxVolume, setSfxVolume] = useLocalStorage('sfxVolume', 1)
  const [gameMode, setGameMode] = useLocalStorage('gameMode', 'normal')
  const [timeLeft, setTimeLeft] = useState(15)
  const [powerUps, setPowerUps] = useState({ 1: { freeze: true, clear: true }, 2: { freeze: true, clear: true } })
  const [isFrozen, setIsFrozen] = useState(false)
  const [swapCount, setSwapCount] = useState(0)
  const [isMuted, setIsMuted] = useLocalStorage('isMuted', false)
  const [showEmojiExplosion, setShowEmojiExplosion] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const playPop = useSound('/sounds/pop.mp3', { volume: isMuted ? 0 : sfxVolume })
  const playWhoosh = useSound('/sounds/whoosh.mp3', { volume: isMuted ? 0 : sfxVolume })
  const playWin = useSound('/sounds/win.mp3', { volume: isMuted ? 0 : sfxVolume })
  const playClick = useSound('/sounds/click.mp3', { volume: isMuted ? 0 : sfxVolume })
  const playReset = useSound('/sounds/reset.mp3', { volume: isMuted ? 0 : sfxVolume })
  const playInvalid = useSound('/sounds/invalid.mp3', { volume: isMuted ? 0 : sfxVolume })
  const playBackground = useSound('/sounds/background.mp3', { loop: true, volume: isMuted ? 0 : musicVolume })

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true)
      if (!isMuted) {
        playBackground()
      }
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
    window.addEventListener('click', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    return () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
  }, [playBackground, isMuted])

  useEffect(() => {
    if (gameMode !== 'timeAttack' && gameMode !== 'blitz' || winner || showCategorySelector || isFrozen) {
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1))
          return gameMode === 'blitz' ? 10 : 15
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameMode, winner, showCategorySelector, isFrozen, currentPlayer])

  useEffect(() => {
    if (gameMode !== 'blitz' || winner || showCategorySelector) return
    const totalMoves = playerMoves[1].length + playerMoves[2].length
    if (totalMoves >= 3) {
      setSwapCount((prev) => prev + 1)
      if (swapCount >= 2) {
        const newBoard = [...board]
        const filledIndices = newBoard
          .map((cell, i) => (cell ? i : null))
          .filter((i) => i !== null)
        if (filledIndices.length >= 2) {
          const [i1, i2] = filledIndices.sort(() => Math.random() - 0.5).slice(0, 2)
          ;[newBoard[i1], newBoard[i2]] = [newBoard[i2], newBoard[i1]]
          setBoard(newBoard)
          setSwapCount(0)
          playWhoosh()
        }
      }
    }
  }, [board, gameMode, winner, showCategorySelector, playerMoves, swapCount, playWhoosh])

  useEffect(() => {
    if (winner) return
    for (const combo of winCombinations) {
      const [a, b, c] = combo
      if (
        board[a] &&
        board[b] &&
        board[c] &&
        board[a].player === board[b].player &&
        board[a].player === board[c].player
      ) {
        setWinner(board[a].player)
        setScores((prev) => ({
          ...prev,
          [board[a].player]: prev[board[a].player] + 1,
        }))
        setLeaderboard((prev) => {
          const newEntry = {
            name: playerNames[board[a].player],
            score: scores[board[a].player] + 1,
            date: new Date().toISOString(),
          }
          return [...prev, newEntry]
            .sort((x, y) => y.score - x.score)
            .slice(0, 5)
        })
        playWin()
        return
      }
    }
  }, [board, playerNames, scores, setScores, setLeaderboard, playWin, winner])

  const getRandomEmoji = (player) => {
    const category = playerCategories[player]
    const emojis = emojiCategories[category] || emojiCategories.animals
    return emojis[Math.floor(Math.random() * emojis.length)]
  }

  const handleCategorySelect = (player, category, name) => {
    setPlayerCategories((prev) => ({ ...prev, [player]: category }))
    setPlayerNames((prev) => ({ ...prev, [player]: name || `Player ${player}` }))
    if (player === 1) {
      setShowCategorySelector(true)
      setCurrentPlayer(2)
    } else {
      setShowCategorySelector(false)
      setCurrentPlayer(1)
      setTimeLeft(gameMode === 'blitz' ? 10 : 15)
    }
    playClick()
  }

  const handleCellClick = (index) => {
    if (
      board[index] ||
      winner ||
      !playerCategories[1] ||
      !playerCategories[2] ||
      showCategorySelector
    ) {
      playInvalid()
      return
    }
    const newBoard = [...board]
    const newMoves = { ...playerMoves }
    const player = currentPlayer
    if (gameMode !== 'classic' && playerMoves[player].length >= 3) {
      const oldestMove = playerMoves[player][0]
      newBoard[oldestMove] = null
      newMoves[player].shift()
      playWhoosh()
    }
    const emoji = getRandomEmoji(player)
    newBoard[index] = { emoji, player }
    newMoves[player].push(index)
    setBoard(newBoard)
    setPlayerMoves(newMoves)
    setCurrentPlayer(player === 1 ? 2 : 1)
    setTimeLeft(gameMode === 'blitz' ? 10 : 15)
    playPop()
  }

  const handleFreezeTime = () => {
    if (!powerUps[currentPlayer].freeze) return
    setIsFrozen(true)
    setPowerUps((prev) => ({
      ...prev,
      [currentPlayer]: { ...prev[currentPlayer], freeze: false },
    }))
    setShowEmojiExplosion(true)
    setTimeout(() => setIsFrozen(false), 5000)
    setTimeout(() => setShowEmojiExplosion(false), 1000)
    playClick()
  }

  const handleClearCell = () => {
    if (!powerUps[currentPlayer].clear) return
    const opponent = currentPlayer === 1 ? 2 : 1
    const opponentMoves = playerMoves[opponent]
    if (opponentMoves.length > 0) {
      const newBoard = [...board]
      const newMoves = { ...playerMoves }
      const cellToClear = opponentMoves[0]
      newBoard[cellToClear] = null
      newMoves[opponent].shift()
      setBoard(newBoard)
      setPlayerMoves(newMoves)
      setPowerUps((prev) => ({
        ...prev,
        [currentPlayer]: { ...prev[currentPlayer], clear: false },
      }))
      setShowEmojiExplosion(true)
      setTimeout(() => setShowEmojiExplosion(false), 1000)
      playWhoosh()
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer(1)
    setPlayerMoves({ 1: [], 2: [] })
    setWinner(null)
    setPlayerCategories({ 1: null, 2: null })
    setShowCategorySelector(true)
    setTimeLeft(gameMode === 'blitz' ? 10 : 15)
    setPowerUps({ 1: { freeze: true, clear: true }, 2: { freeze: true, clear: true } })
    setSwapCount(0)
    playReset()
  }

  const resetScores = () => {
    setScores({ 1: 0, 2: 0 })
    setLeaderboard([])
    playClick()
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
    playClick()
  }

  return (
    <div className="min-h-screen bg-gradient animate-fade-in" onClick={() => setHasInteracted(true)}>
      <Navbar
        setShowHelp={setShowHelp}
        setShowSettings={setShowSettings}
        setShowLeaderboard={setShowLeaderboard}
        toggleMute={toggleMute}
        isMuted={isMuted}
        resetGame={resetGame}
      />
      <div className="radial-overlay"></div>
      {winner && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={300} colors={['#ff3399', '#00e6e6', '#ffffff']} />}
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
          {(gameMode === 'timeAttack' || gameMode === 'blitz') && !winner && !showCategorySelector && !isFrozen && (
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
        <GameBoard board={board} winner={winner} handleCellClick={handleCellClick} />
        {winner && (
          <div className="winner-message">
            <p className="winner-text animate-neon-flicker">{playerNames[winner]} Wins!</p>
            <button className="btn-neon btn-neon-purple play-again-btn" onClick={resetGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
      {showCategorySelector && <CategorySelector player={currentPlayer} onSelect={handleCategorySelect} />}
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
        />
      )}
      {showLeaderboard && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal leaderboard-modal animate-spring-up">
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
  )
}

export default App