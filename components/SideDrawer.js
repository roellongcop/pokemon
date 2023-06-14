import React from "react";
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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useSelector } from "react-redux";

const CustomDrawer = (props) => {
  const { user } = useSelector((state) => state.USER);
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
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: "#fff",
                }}
              >
                280 Owned Pokemons
              </Text>
            </View>
          </View>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#eee" }}>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="information-circle-outline" size={22} />
            <Text
              style={{
                marginLeft: 30,
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Learn More
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                marginLeft: 30,
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
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
