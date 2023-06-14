import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Alert, Image, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { app } from "../firebaseConfig";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getData, storeData } from "../lib/storage";
import { useDispatch } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SideDrawer from "./SideDrawer";
import HomeScreen from "../screens/HomeScreen";
import PokemonListScreen from "../screens/PokemonListScreen";
import AuthScreen from "../screens/AuthScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import SignUpScreen from "../screens/SignUpScreen";

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={AuthScreen} />

      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

const DashboardStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

const PokemonStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PokemonList" component={PokemonListScreen} />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const [userData, setUserData] = useState(null);
  const auth = getAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData("userCredential").then((credential) => {
      if (credential) {
        const { email, password } = credential;
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            setLoading(false);
            const user = userCredential.user || null;

            dispatch({ type: "user/setUser", payload: user });
            storeData("user", user);
            storeData("userCredential", { email, password });
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
    onAuthStateChanged(auth, (user) => {
      setUserData(user);
    });
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
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
          }}
        >
          <Drawer.Screen
            name="Dashboard"
            component={DashboardStackScreen}
            options={{
              drawerIcon: ({ color }) => (
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../assets/icon.png")}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Pokemons"
            component={PokemonStackScreen}
            options={{
              drawerIcon: ({ color }) => (
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../assets/forgot.png")}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="PokemonCatchers"
            component={PokemonStackScreen}
            options={{
              title: "Pokemon Catchers",
              drawerIcon: ({ color }) => (
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../assets/signup.png")}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="MyPokemons"
            component={PokemonStackScreen}
            options={{
              title: "My Pokemons",
              drawerIcon: ({ color }) => (
                <Image
                  style={{ width: 30, height: 30 }}
                  source={require("../assets/login.png")}
                />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }

  return <NavigationContainer>{AuthStackScreen()}</NavigationContainer>;
};

export default Navigation;
