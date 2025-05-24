import React from 'react';

const HelpModal = ({ onClose }) => {
  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal animate-spring-up">
        <h2 className="modal-title animate-neon-flicker">How to Play Blink Tac Toe</h2>
        <p>1. Each player chooses an emoji category (e.g., Animals, Food).</p>
        <p>2. Players take turns placing a random emoji from their category on the 3x3 grid.</p>
        <p>3. Each player can have up to 3 emojis on the board. Placing a 4th emoji removes the oldest one (not in the same cell).</p>
        <p>4. Win by aligning 3 of your emojis horizontally, vertically, or diagonally.</p>
        <p>5. Use power-ups (optional): Freeze (pause opponent's time), Clear (remove opponent's emoji).</p>
        <p>6. Modes: Normal (unlimited time), Time Attack (15s/turn), Blitz (10s/turn).</p>
        <button className="btn-neon btn-neon-blue close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default HelpModal;