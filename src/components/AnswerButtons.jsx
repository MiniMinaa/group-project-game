function AnswerButtons({ options, onGuess, answered, correctId, selectedId }) {
  return (
    <div className="answer-buttons">
      {/* Map through all 4 Pokemon options to create buttons */}
      {options.map((option) => {
        const isCorrect = option.id === correctId; // Check if this is the correct answer
        const isSelected = option.id === selectedId; // Check if user clicked this button

        // Determine button styling based on state
        let buttonClass = "answer-btn"; // Default blue
        if (answered) {
          if (isCorrect) {
            buttonClass = "answer-btn correct"; // Correct answer = green
          } else if (isSelected) {
            buttonClass = "answer-btn wrong"; // Wrong answer user clicked = red
          }
        }

        return (
          <button
            key={option.id} // Unique key for React
            onClick={() => onGuess(option)} // Pass clicked Pokemon to handler
            disabled={answered} // Disable all buttons after answer
            className={buttonClass}
          >
            {option.name} {/* Display Pokemon name */}
          </button>
        );
      })}
    </div>
  );
}

export default AnswerButtons;
