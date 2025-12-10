
function Scoreboard({ score, total, streak }) {
  // Calculate accuracy safely (avoid dividing by zero)
  const accuracy =
    total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="scoreboard">
      {/* Show the player's total score */}
      <p><strong>Score:</strong> {score}</p>

      {/* How many rounds the player has answered */}
      <p><strong>Rounds Played:</strong> {total}</p>

      {/* Streak of consecutive correct answers */}
      <p><strong>Streak:</strong> {streak}</p>
    </div>
  );
}

export default Scoreboard;