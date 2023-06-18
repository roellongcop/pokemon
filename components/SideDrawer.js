import React, { useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { removeData } from "../lib/storage";
import { auth, firebaseSubscribe } from "../firebaseConfig";

const SideDrawer = (props) => {
  const dispatch = useDispatch();

  const { user, pokemons } = useSelector((state) => state.USER);

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        dispatch({ type: "user/setCurrentUser", payload: null });
        removeData("currentUser");
      })
      .catch((error) => {
        const { code } = error;
        console.log("error", code);
      });
  };

  useEffect(() => {
    firebaseSubscribe(`users/${user.uid}`, (snapshot) => {
      if (snapshot && snapshot.val()) {
        const { pokemon } = snapshot.val();
        dispatch({
          type: "user/setPokemons",
          payload: pokemon ? Object.values(pokemon) : [],
        });
      }
    });

  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <ImageBackground
          source={require("../assets/drawer-bg-2.png")}
          resizeMode="cover"
        >
          <View style={styles.profileContainer}>
            <Text style={styles.name}>{user?.email}</Text>
            <View style={styles.subTextContainer}>
              <Text style={styles.subText}>
                {pokemons?.length || 0} Owned Pokemons
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.drawerItemContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomMenuContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.bottomMenuTouchable}>
          <View style={styles.bottomTextContainer}>
            <Ionicons name="shield-outline" size={22} />
            <Text style={styles.bottomText}>My Account</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignout}
          style={styles.bottomMenuTouchable}
        >
          <View style={styles.bottomTextContainer}>
            <Ionicons name="exit-outline" size={22} />
            <Text style={styles.bottomText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SideDrawer;

const styles = StyleSheet.create({
  bottomMenuTouchable: { paddingVertical: 15 },
  subTextContainer: { flexDirection: "row" },
  subText: { color: "#fff" },
  bottomText: {
    marginLeft: 30,
    fontWeight: "bold",
    color: "#555",
  },
  bottomTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomMenuContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  drawerItemContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  contentContainerStyle: {
    backgroundColor: "transparent",
  },
  profileContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    marginTop: 120,
    padding: 20,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
});
