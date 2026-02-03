import React, { useMemo } from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import PokemonImage from "./PokemonImage";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getTypeImage } from "../lib/imageMapper";

const Pokemon = React.memo(({ pokemon, viewOnly }) => {
  const navigation = useNavigation();
  const { details } = pokemon;
  const type = details.types[0].type.name;

  const imageSource = useMemo(() => getTypeImage(type), [type]);

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
    navigation.navigate("PokemonDetail", {
      customTitle: pokemon.name,
      pokemon,
      viewOnly
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
          <Text style={styles.name}>{details.name}</Text>
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
    // justifyContent: "center",
    marginHorizontal: 5,
    marginVertical: -3,
    width: "48%", // Adjust the width as needed
    height: 130, // Adjust the height as needed
  },
  headContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
