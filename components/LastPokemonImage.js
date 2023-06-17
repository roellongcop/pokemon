import React, { useEffect, useState } from "react";
import PokemonImage from "./PokemonImage";

const LastPokemonImage = ({ pokemons, height, width, style }) => {
  const [lastPokemon, setLastPokemon] = useState(0);

    useEffect(() => {
    if (pokemons) {
      setLastPokemon(pokemons.slice(-1)[0]);
    }
  }, [pokemons]);

  return (
    <PokemonImage
      style={style}
      pokemonId={lastPokemon}
      width={width || 30}
      height={height || 30}
    />
  );
};

export default LastPokemonImage;
