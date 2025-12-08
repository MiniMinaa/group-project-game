import { useState } from "react";
import { useEffect } from "react";
import PokemonDisplay from "./components/PokemonDisplay";
import AnswerButtons from "./components/AnswerButtons";
import {AudioManager} from './utility/audioManager';

function PokemonGame() {
  useEffect(() => {
    const handleFirstClick = () => {
      AudioManager.playBg();
      window.removeEventListener("click", handleFirstClick);
    };

    window.addEventListener("click", handleFirstClick);
    return () => {
      AudioManager.stopBg();
      window.removeEventListener("click", handleFirstClick);
    };
  }, []);


  const [gameStarted, setGameStarted] = useState(false); // Track if game has started
  const [pokemon, setPokemon] = useState(null); // Store the current correct Pokemon
  const [options, setOptions] = useState([]); // Store all 4 Pokemon options for buttons
  const [answered, setAnswered] = useState(false); // Track if user has answered current round
  const [selectedId, setSelectedId] = useState(null); // Track which button user clicked

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
    fetchNewRound();
  };

  const handleGuess = (guessedPokemon) => {
    setAnswered(true); // Reveal Pokemon
    setSelectedId(guessedPokemon.id); // Track clicked button

    // Wait 700 micro seconds to show result, then fetch next round
    setTimeout(() => {
      fetchNewRound();
    }, 700);
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Who's That Pokemon?</h1>

      <div className="display-box">
        {!gameStarted ? (
          // Before game starts: show start button
          <button className="start-btn" onClick={startGame}>
            Start Game
          </button>
        ) : (
          // During game: show Pokemon sprite (if loaded)
          pokemon && <PokemonDisplay pokemon={pokemon} answered={answered} />
        )}
      </div>

      {/* Pokemon name display - shows name when answered, empty space otherwise */}

      <p className="pokemon-name-display">
        {answered && pokemon ? pokemon.name.toUpperCase() : ""}
      </p>

      {/* Answer buttons - only show when game has started and Pokemon is loaded */}
      {gameStarted && pokemon && (
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
