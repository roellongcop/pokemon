import React, { useEffect } from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { StatusBar  } from "expo-status-bar";

const HomeScreen = ({ navigation, route }) => {
  const { user, pokemons } = useSelector((state) => state.USER);

  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.headerContainer}>
        <IconButton
          icon="menu"
          size={30}
          onPress={() => navigation.openDrawer()}
        />

        <Ionicons name="star" size={22} color="green" />
        
      </View>
      <Text>asd</Text>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center"
  }
});

export default HomeScreen;

