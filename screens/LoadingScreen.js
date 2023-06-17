import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar  } from "expo-status-bar";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
