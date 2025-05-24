import React, { useState } from 'react';
import { emojiCategories } from '../constants';

const CategorySelector = ({ player, onSelect }) => {
  const [name, setName] = useState(`Player ${player}`);
  const [category, setCategory] = useState(null);

  const handleSubmit = () => {
    if (category && onSelect) {
      onSelect(player, category, name);
    }
  };

  return (
    <div className="board-popup animate spring-up">
      <h2 className="popup-title animate-neon-flicker">Player {player}: Choose Your Category</h2>
      <input
        type="text"
        className="input-field"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={`Enter name for Player ${player}`}
        aria-label={`Enter name for Player ${player}`}
      />
      <div className="category-grid">
        {Object.keys(emojiCategories).map((cat) => (
          <button
            key={cat}
            className={`btn-neon btn-neon-cyan category-btn ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <button
        className="btn-neon btn-neon-purple"
        onClick={handleSubmit}
        disabled={!category}
        aria-disabled={!category}
      >
        Confirm
      </button>
    </div>
  );
};

export default CategorySelector;