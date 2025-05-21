import { emojiCategories } from '../constants.js';

const CategorySelector = ({ player, onSelect }) => {
  const categories = Object.keys(emojiCategories);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Player {player} - Choose Your Category</h2>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className="category-button"
              onClick={() => onSelect(player, category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;