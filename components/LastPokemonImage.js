import React, { useEffect, useState } from "react";
import PokemonImage from "./PokemonImage";
import { useSelector } from "react-redux";

const LastPokemonImage = ({ pokemons, height, width, style }) => {
  const userState = useSelector((state) => state.USER);
  const [lastPokemon, setLastPokemon] = useState(0);

  useEffect(() => {
    pokemons = pokemons || userState.pokemons;
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
