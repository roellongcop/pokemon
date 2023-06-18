import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import PokemonImage from "./PokemonImage";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Pokemon = React.memo(({ pokemon, skeleton }) => {
  const navigation = useNavigation();
  const { details } = pokemon;
  const type = details.types[0].type.name;

  const [imageSource, setImageSource] = useState(
    require("../assets/water.png")
  );

  // Function to handle image source update
  const updateImageSource = () => {
    switch (type) {
      case "normal":
        setImageSource(require("../assets/normal.png"));
        break;

      case "fighting":
      case "ghost":
      case "unknown":
        setImageSource(require("../assets/fighting.png"));
        break;
      case "water":
      case "flying":
      case "electric":
      case "ice":
        setImageSource(require("../assets/water.png"));
        break;

      case "fire":
      case "steel":
      case "dragon":
        setImageSource(require("../assets/fire.png"));
        break;

      case "grass":
      case "psychic":
      case "fairy":
        setImageSource(require("../assets/grass.png"));
        break;

      case "bug":
      case "poison":
      case "ground":
      case "rock":
      case "shadow":

      case "dark":
        setImageSource(require("../assets/bug.png"));
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

  const handleDetail = () => {
    navigation.navigate("Pokemons", {
      screen: "PokemonDetail",
      params: {
        customTitle: pokemon.name,
        pokemon,
      },
    });
  };

  return (
    <TouchableOpacity onPress={handleDetail} style={styles.container}>
      <ImageBackground
        source={imageSource}
        resizeMode="cover"
        style={{ padding: 5 }}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.headContainer}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.type}>{details.types[0].type.name}</Text>
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
    </TouchableOpacity>
  );
});

export default Pokemon;

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: "#ccc",
    borderRadius: 5,
    color: "#ccc",
  },
  type: { color: "#fff", fontWeight: "bold", fontSize: 10 },
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
    marginHorizontal: 5,
    width: "48%", // Adjust the width as needed
    height: 130, // Adjust the height as needed
  },
  headContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
