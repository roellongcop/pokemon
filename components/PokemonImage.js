import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Image } from "react-native";
import { SvgUri } from "react-native-svg";

const PokemonImage = ({ pokemonId, width, height, style }) => {
  const [isLoading, setIsLoading] = useState(true);
  const source = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;

  const onError = (e) => {
    setIsLoading(false);
  };

  const onLoad = () => {
    setIsLoading(false);
  };

  const DefaultImage = () => (
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

  if (!pokemonId) {
    return <DefaultImage />;
  }
  return (
    <>
      <SvgUri
        style={style}
        width={width || 40}
        height={height || 40}
        onError={onError}
        onLoad={onLoad}
        uri={source}
      />
      {isLoading && <DefaultImage />}
    </>
  );
};

export default PokemonImage;
