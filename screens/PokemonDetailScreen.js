import React from "react";
import { Text, View, SafeAreaView } from "react-native";
import globalStyles from "../styles/globalStyles";


const PokemonDetailScreen = ({ navigation, route }) => {
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <Text>PokemonDetailScreen</Text>
    </SafeAreaView>
  );
};

export default PokemonDetailScreen;
