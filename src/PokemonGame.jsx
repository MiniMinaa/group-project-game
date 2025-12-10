import { useEffect, useState } from "react";
import PokemonDisplay from "./components/PokemonDisplay";
import AnswerButtons from "./components/AnswerButtons";
import Scoreboard from "./components/Scoreboard";

function PokemonGame() {
  const [gameStarted, setGameStarted] = useState(false); // Track if game has started
  const [gameOver, setGameOver] = useState(false); // End-game state
  const [timeLeft, setTimeLeft] = useState(30); // 30-second timer
  const [pokemon, setPokemon] = useState(null); // Store the current correct Pokemon
  const [options, setOptions] = useState([]); // Store all 4 Pokemon options for buttons
  const [answered, setAnswered] = useState(false); // Track if user has answered current round
  const [selectedId, setSelectedId] = useState(null); // Track which button user clicked
  const [score, setScore] = useState(0);  // scoreboard, Correct answers
  const [total, setTotal] = useState(0);  // scoreboard, Total rounds played
  const [streak, setStreak] = useState(0); // scoreboard, Correct streak

  // topscore logic
  const [topScore, setTopScore] = useState(0);

  useEffect(() => {
    if (score > topScore) {
      setTopScore(score);
    }
  }, [score, topScore]);

  //Timer logic
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    if (timeLeft <= 0) {
      endGame();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, gameOver]);

  //End game logic
  const endGame = () => {
    setGameOver(true);
  };
  const restartGame = () => {
    setScore(0);
    setTotal(0);
    setStreak(0);
    setTimeLeft(30);
    setGameOver(false);
    setGameStarted(true);
    fetchNewRound();
  };

  const fetchNewRound = async () => {
    try {
      // Generate 4 unique random Pokemon IDs (1-151 for Gen 1) - We can change this to include all pokemons for allgenerations. 1025.
      const ids = new Set(); // Set ensures no duplicates
      while (ids.size < 4) {
        ids.add(Math.floor(Math.random() * 151) + 1);
      }

      const idsArray = Array.from(ids); // Convert Set to Array

      // Fetch all 4 Pokemon data in parallel (faster than sequential)
      const promises = idsArray.map((id) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
          res.json(),
        ),
      );

      const pokemonData = await Promise.all(promises); // Wait for all fetches to complete

      // Pick one Pokemon as the correct answer
      const correctIndex = Math.floor(Math.random() * 4);

      // Shuffle all 4 Pokemon so correct answer isn't always in same position
      const shuffled = [...pokemonData].sort(() => Math.random() - 0.5);

      // Preload the correct Pokemon's image to prevent flash when rendering
      const img = new Image();
      img.src =
        pokemonData[correctIndex].sprites.other[
          "official-artwork"
        ].front_default;
      await img.decode(); // Wait for image to fully load

      // Update state for new round
      setAnswered(false); // Reset answered state (shows silhouette)
      setSelectedId(null); // Clear previous selection
      setOptions(shuffled); // Set button options
      setPokemon(pokemonData[correctIndex]); // Set correct Pokemon
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Starts the game
  // Fetches first round
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setTimeLeft(30);
    fetchNewRound();
  };

  const handleGuess = (guessedPokemon) => {
    setAnswered(true); // Reveal Pokemon
    setSelectedId(guessedPokemon.id); // Track clicked button

    setTotal((prev) => prev + 1); //scoreboard, update total rounds

  if (guessedPokemon.id === pokemon.id) { // scoreboard, check if guess is correct
    setScore((prev) => prev + 1);   // scoreboard, add 1 to score
    setStreak((prev) => prev + 1);  // scoreboard, continue streak
  } else {
    setStreak(0); // scoreboard, reset streak on wrong guess
  }

    // Wait 700 micro seconds to show result, then fetch next round
    setTimeout(() => {
      fetchNewRound();
    }, 700);
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Who's That Pokemon?</h1>
      {gameStarted && !gameOver && <h2>Time Left: {timeLeft}s</h2>}

      <div className="scoreboard-wrapper">
        <Scoreboard topScore={topScore} score={score} total={total} streak={streak} />
      </div>

      <div className="display-box">
        {!gameStarted && !gameOver && (
          // Before game starts: show start button
          <button className="start-btn" onClick={startGame}>
            Start Game
          </button>
        )}


          {gameStarted && !gameOver && pokemon && (
          pokemon && <PokemonDisplay pokemon={pokemon} answered={answered} />
        )}
        {/* End game screen*/}
        {gameOver && (
          <div className="end-screen">
            <h1>Game Over!</h1>
            <p>Topscore: {topScore}</p>
            <p>Final Score: {score}</p>
            <p>Rounds Played: {total}</p>
            <p>Longest Streak: {streak}</p>
            <button className="start-btn" onClick={restartGame}>
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Pokemon name display - shows name when answered, empty space otherwise */}

      <p className="pokemon-name-display">
        {answered && pokemon ? pokemon.name.toUpperCase() : ""}
      </p>

      {/* Answer buttons - only show when game has started and Pokemon is loaded */}
      {gameStarted && !gameOver && pokemon && (
        <AnswerButtons
          options={options} // All 4 Pokemon options
          onGuess={handleGuess} // Function to call when button clicked
          answered={answered} // Disables buttons when answered in round
          correctId={pokemon.id} // ID for green styling if correct
          selectedId={selectedId} // ID for red styling if wrong
        />
      )}
    </div>
  );
}

export default PokemonGame;
