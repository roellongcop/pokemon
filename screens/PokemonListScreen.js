import React from "react";
import { Text, View, SafeAreaView } from "react-native";
import globalStyles from "../styles/globalStyles";


const PokemonListScreen = ({ navigation, route }) => {
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <Text>PokemonListScreen</Text>
    </SafeAreaView>
  );
};

export default PokemonListScreen;
