const LeaderboardModal = ({ scores, onClose }) => {
  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal leaderboard-modal animate-spring-up">
        <h2 className="modal-title animate-neon-flicker">Leaderboard</h2>
        <ul className="leaderboard-list">
          {scores.map((entry, index) => (
            <li key={index} className="leaderboard-item">
              <span>{entry.name}</span>
              <span>{entry.score} ({new Date(entry.date).toLocaleDateString()})</span>
            </li>
          ))}
          {scores.length === 0 && <p className="no-scores">No scores yet!</p>}
        </ul>
        <button
          className="btn-neon btn-neon-blue close-btn"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LeaderboardModal;