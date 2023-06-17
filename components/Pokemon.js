import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import PokemonImage from "./PokemonImage";
import { ImageBackground } from "react-native";

const Pokemon = ({ pokemon, index }) => {
  const { details } = pokemon;
  // const type = 'water';
  const type = details.types[0].type.name || "water";

  const [imageSource, setImageSource] = useState(
    require("../assets/water.png")
  );

  // Function to handle image source update
  const updateImageSource = () => {
    switch (details.types[0].type.name) {
      case "fighting":
      case "ghost":
      case "unknown":
        const fighting = require("../assets/fighting.png");
        setImageSource(fighting);
      case "water":
      case "flying":
      case "electric":
      case "ice":
        const water = require("../assets/water.png");
        setImageSource(water);
        break;

      case "fire":
      case "steel":
      case "dragon":
        const fire = require("../assets/fire.png");
        setImageSource(fire);
        break;

      case "grass":
      case "psychic":
      case "fairy":
        const grass = require("../assets/grass.png");
        setImageSource(grass);
        break;

      case "bug":
      case "poison":
      case "ground":
      case "rock":
      case "shadow":

      case "dark":
        const bug = require("../assets/bug.png");
        setImageSource(bug);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    updateImageSource();
  }, []);

  const renderStats = (stat, index) => {
    if (stat.stat.name == "special-attack") {
      return;
    }
    if (stat.stat.name == "special-defense") {
      return;
    }
    return (
      <Text key={index.toString()} style={styles.stats}>
        {stat.stat.name}: {stat.base_stat}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imageSource}
        resizeMode="cover"
        style={{ padding: 5 }}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.headContainer}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 10}}>{details.types[0].type.name}</Text>
        </View>
        <View style={styles.contentContainer}>
          <View>
            {details.stats.map((stat, index) => renderStats(stat, index))}
          </View>
          <View>
            <PokemonImage
              style={styles.image}
              width={80}
              height={80}
              pokemonId={details.id}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Pokemon;

const styles = StyleSheet.create({
  image: {
    position: "relative",
  },
  stats: {
    fontSize: 11,
  },
  contentContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  name: {
    textTransform: "capitalize",
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    justifyContent: "center",
    margin: 5,
    marginBottom: 0,
    width: "48%", // Adjust the width as needed
    height: 130, // Adjust the height as needed
  },
  headContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
