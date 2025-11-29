function PokemonDisplay({ pokemon, answered }) {
  return (
    <img
      // Apply silhouette class (black) or revealed class (color) based on answered state
      className={`pokemon-img ${answered ? "revealed" : "silhouette"}`}
      src={pokemon.sprites.other["official-artwork"].front_default}
      alt="Pokemon"
    />
  );
}

export default PokemonDisplay;
