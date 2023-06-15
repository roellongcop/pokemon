import React, { useEffect } from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";
import globalStyles from "../styles/globalStyles";
import { IconButton } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { firebaseSubscribe } from "../firebaseConfig";

const HomeScreen = ({ navigation, route }) => {
  const { user, pokemons } = useSelector((state) => state.USER);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('user', user);
    // firebaseSubscribe(`users/${user.uid}`, (snapshot) => {
    //   if (snapshot) {
    //     const data = snapshot.val();
    //     if (data) {
    //       const transformedData = Object.entries(data).map(
    //         ([key, value]) => ({
    //           key,
    //           ...value,
    //         })
    //       );
    //       dispatch({ type: "user/setPokemons", payload: transformedData });
    //     }
    //   }
    // });
  }, [])
  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <View style={styles.headerContainer}>
        <IconButton
          icon="menu"
          size={30}
          onPress={() => navigation.openDrawer()}
        />

        <Ionicons name="star" size={22} color="green" />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center"
  }
})
