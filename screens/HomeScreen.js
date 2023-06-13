import React from "react";
import { Text, View, SafeAreaView } from "react-native";
import globalStyles from "../styles/globalStyles";


const HomeScreen = ({ navigation, route }) => {
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <Text>Home</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
