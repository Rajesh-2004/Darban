import React from 'react';
import Tilt from 'react-parallax-tilt';
import CategorySelector from './CategorySelector.jsx';

const GameBoard = ({ board, winner, winningCells, handleCellClick, showCategorySelector, currentPlayer, onCategorySelect }) => {
  return (
    <div className="board-wrapper">
      <Tilt
        tiltMaxAngleX={15}
        tiltMaxAngleY={15}
        glareEnable={true}
        glareMaxOpacity={0.3}
        glareColor="#ffffff"
        glarePosition="all"
        className="tilt-wrapper"
      >
        <div className={`game-board ${showCategorySelector ? 'dimmed' : ''}`}>
          {board && board.map((cell, index) => (
            <div
              key={index}
              className={`game-cell ${cell ? 'animate-scale-in' : ''} ${winningCells.includes(index) ? 'winning-cell' : ''}`}
              onClick={() => !winner && !showCategorySelector && handleCellClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && !winner && !showCategorySelector && handleCellClick(index)}
            >
              {cell ? cell.emoji : ''}
            </div>
          ))}
        </div>
      </Tilt>
      {showCategorySelector && (
        <CategorySelector
          player={currentPlayer}
          onSelect={onCategorySelect}
        />
      )}
    </div>
  );
};

export default GameBoard;