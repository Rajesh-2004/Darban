const HelpModal = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Blink Tac Toe Rules</h2>
        <p>1. Played on a 3x3 grid. Each player chooses an emoji category (e.g., Animals, Food).</p>
        <p>2. Players take turns placing a random emoji from their category.</p>
        <p>3. Each player can have up to 3 emojis. The 4th emoji removes the oldest one.</p>
        <p>4. You cannot place an emoji where the oldest one was removed.</p>
        <p>5. Win by getting 3 of your emojis in a row, column, or diagonal.</p>
        <p>6. Click "Play Again" to restart after a win.</p>
        <button className="modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default HelpModal;