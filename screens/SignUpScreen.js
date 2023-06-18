import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StatusBar,
  RefreshControl,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import authStyles from "../styles/authStyles";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { storeData } from "../lib/storage";
import NetInfo from "@react-native-community/netinfo";
import { pushData, readData } from "../firebaseConfig";
import { auth } from "../firebaseConfig";
import { setData } from "../firebaseConfig";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const showSnackBar = (message) => {
    setSnackMessage(message);
    setSnackbar(true);
  };

  const addStartPokemon = (user) => {
    pushData({
      link: `users/${user.uid}/pokemon`,
      data: 1,
    });
    pushData({
      link: `users/${user.uid}/pokemon`,
      data: 2,
    });
    pushData({
      link: `users/${user.uid}/pokemon`,
      data: 3,
    });
  };

  const addStartEnery = (user) => {
    setData({
      link: `users/${user.uid}/energy`,
      data: {
        chance: 3,
        time: new Date().getTime(),
      },
    });
  };

  const handleSignUp = () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        addStartPokemon(user);
        addStartEnery(user);

        readData({
          link: "leaderboard",
          successCallback: (snapshot) => {
            if (snapshot && snapshot.val()) {
            } else {
              setData({
                link: 'leaderboard',
                data: {
                  uid: user.uid,
                  totalPokemons: 3,
                  time: new Date().getTime(),
                },
              });
            }
          },
        });

        storeData("currentUser", {
          user,
          credential: { email, password },
        });

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const { code } = error;
        showSnackBar(code);
      });
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setEmail("");
    setPassword("");
    setRefreshing(false);
  };

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        showSnackBar("No internet");
      }
    });
  }, []);

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView
        contentContainerStyle={authStyles.contentContainerStyle}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={authStyles.container}>
          <View style={authStyles.overlay}>
            <View style={authStyles.headerContainer}>
              <Image
                source={require("../assets/signup.png")}
                style={authStyles.image}
              />
              <Text style={authStyles.logo}>Create your Account</Text>
            </View>

            <View style={authStyles.inputContainer}>
              <TextInput
                value={email}
                style={authStyles.input}
                placeholder="Email"
                onChangeText={setEmail}
              />
              <TextInput
                value={password}
                style={authStyles.input}
                placeholder="Password"
                onChangeText={setPassword}
                secureTextEntry={true}
              />

              <Button
                style={authStyles.helpButton}
                labelStyle={authStyles.helpButtonLabel}
                onPress={handleBackToLogin}
              >
                Back to Login
              </Button>
            </View>

            <Button
              style={authStyles.mainButton}
              disabled={loading}
              loading={loading}
              buttonColor="#337ab7"
              mode="contained"
              icon="pencil"
              labelStyle={authStyles.mainButtonLabel}
              onPress={handleSignUp}
            >
              Create Account
            </Button>

            <Snackbar
              visible={snackbar}
              onDismiss={() => {
                setSnackbar(false);
              }}
              action={{
                label: "OK",
                onPress: () => {
                  setSnackbar(false);
                },
              }}
            >
              {snackMessage}
            </Snackbar>
          </View>
          <ExpoStatusBar style="auto" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
