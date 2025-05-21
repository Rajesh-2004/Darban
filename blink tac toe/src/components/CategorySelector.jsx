import { emojiCategories } from '../constants.js';
import useSound from '../hooks/useSound.js';

const CategorySelector = ({ player, onSelect }) => {
  const categories = Object.keys(emojiCategories);
  const playClick = useSound('/sounds/click.mp3');

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Player {player} - Choose Your Category</h2>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className="category-button"
              onClick={() => {
                onSelect(player, category);
                playClick();
              }}
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