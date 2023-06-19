import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alert, Image, StyleSheet } from "react-native";
import { readData } from "../firebaseConfig";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getData } from "../lib/storage";
import { useDispatch, useSelector } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SideDrawer from "./SideDrawer";
import HomeScreen from "../screens/HomeScreen";
import PokemonListScreen from "../screens/PokemonListScreen";
import AuthScreen from "../screens/AuthScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import SignUpScreen from "../screens/SignUpScreen";
import LoadingScreen from "../screens/LoadingScreen";
import LastPokemonImage from "./LastPokemonImage";
import PokemonDetailScreen from "../screens/PokemonDetailScreen";
import MyPokemonScreen from "../screens/MyPokemonScreen";

import { Button, IconButton } from "react-native-paper";

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

const AuthStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={AuthScreen} />

      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

const DashboardStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PokemonDetail"
        component={PokemonDetailScreen}
        options={({ route }) => ({
          headerShown: false,
          title:
            route.params && route.params.customTitle
              ? route.params.customTitle
              : "Pokemon Details",
        })}
      />
    </Stack.Navigator>
  );
};

const MyPokemonStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPokemon"
        component={MyPokemonScreen}
        options={{
          headerTitleAlign: "center",
          title: "My Pokemons",
          headerShown: true,
          headerLeft: () => (
            <IconButton
              icon="menu"
              onPress={() => {
                navigation.toggleDrawer();
              }}
            />
          ),
          headerRight: () => <LastPokemonImage />,
        }}
      />
      <Stack.Screen
        name="PokemonDetail"
        component={PokemonDetailScreen}
        options={({ route }) => ({
          headerShown: false,
          title:
            route.params && route.params.customTitle
              ? route.params.customTitle
              : "Pokemon Details",
        })}
      />
    </Stack.Navigator>
  );
};

const PokemonStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PokemonList"
        component={PokemonListScreen}
        options={{
          headerTitleAlign: "center",
          title: "Pokemons",
          headerShown: true,
          headerLeft: () => (
            <IconButton
              icon="menu"
              onPress={() => {
                navigation.toggleDrawer();
              }}
            />
          ),
          headerRight: () => <LastPokemonImage />,
        }}
      />
      <Stack.Screen
        name="PokemonDetail"
        component={PokemonDetailScreen}
        options={({ route }) => ({
          headerShown: false,
          title:
            route.params && route.params.customTitle
              ? route.params.customTitle
              : "Pokemon Details",
        })}
      />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const auth = getAuth();
  const { pokemons } = useSelector((state) => state.USER);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const checkLocalUser = () => {
    getData("currentUser").then((currentUser) => {
      if (currentUser) {
        const { email, password } = currentUser.credential;
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            setLoading(false);
          })
          .catch((error) => {
            const { code } = error;
            setLoading(false);
            Alert.alert("Error", code);
          });
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    checkLocalUser();

    onAuthStateChanged(auth, (user) => {
      dispatch({ type: "user/setUser", payload: user });
      setUserData(user);

      if (user) {
        readData({
          link: `users/${user.uid}`,
          successCallback: (snapshot) => {
            if (snapshot) {
              const { pokemon, energy } = snapshot.val();

              dispatch({
                type: "user/setPokemons",
                payload: pokemon ? Object.values(pokemon) : [],
              });

              dispatch({
                type: "user/setEnergy",
                payload: energy,
              });
            }
          },
        });
      }
    });

    return () => {};
  }, []);

  if (loading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if (userData) {
    return (
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <SideDrawer {...props} />}
          screenOptions={{
            drawerActiveBackgroundColor: "#e93e25",
            drawerActiveTintColor: "#fff",
            drawerInactiveTintColor: "#555",
            headerTitleAlign: "center",
            headerRight: () => (
              <LastPokemonImage
                style={{ marginRight: 10 }}
                pokemons={pokemons}
              />
            ),
          }}
        >
          <Drawer.Screen
            name="Dashboard"
            component={DashboardStackScreen}
            options={{
              headerShown: false,
              drawerIcon: ({ color }) => (
                <Image
                  style={styles.drawerIcon}
                  source={require("../assets/icon.png")}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Pokemons"
            component={PokemonStackScreen}
            options={({ route }) => ({
              headerShadowVisible: false,
              headerShown: false,
              drawerIcon: ({ color }) => (
                <Image
                  style={styles.drawerIcon}
                  source={require("../assets/forgot.png")}
                />
              ),
            })}
          />
          {/* <Drawer.Screen
            name="PokemonCatchers"
            component={DashboardStackScreen}
            options={{
              title: "Pokemon Catchers",
              drawerIcon: ({ color }) => (
                <Image
                  style={styles.drawerIcon}
                  source={require("../assets/signup.png")}
                />
              ),
            }}
          /> */}
          <Drawer.Screen
            name="MyPokemons"
            component={MyPokemonStackScreen}
            options={({ route }) => ({
              headerShadowVisible: false,
              headerShown: false,
              drawerIcon: ({ color }) => (
                <Image
                  style={styles.drawerIcon}
                  source={require("../assets/login.png")}
                />
              ),
            })}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }

  return <NavigationContainer>{AuthStackScreen()}</NavigationContainer>;
};

export default Navigation;

const styles = StyleSheet.create({
  drawerIcon: {
    width: 30,
    height: 30,
  },
});
