import React from "react";
import { Image } from "react-native";
import { SvgUri } from "react-native-svg";

const PokemonImage = ({ pokemonId, width, height, style }) => {
  const source = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;

  if (!pokemonId) {
    return (
      <Image
        style={[
          style,
          {
            width,
            height,
          },
        ]}
        source={require("../assets/icon.png")}
      />
    );
  }
  return (
    <SvgUri
      style={style}
      width={width || 40}
      height={height || 40}
      uri={source}
    />
  );
};

export default PokemonImage;
