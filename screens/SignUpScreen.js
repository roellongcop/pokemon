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
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { getData, storeData } from "../lib/storage";
import NetInfo from "@react-native-community/netinfo";

const SignUpScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const handleSignUp = () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        const user = userCredential.user;

        dispatch({ type: "user/setUser", payload: user });
        storeData("user", user);
        storeData("userCredential", { email, password });

        setSnackMessage(code);
        setSnackbar(true);
      })
      .catch((error) => {
        setLoading(false);
        const { code } = error;
        setSnackMessage(code);
        setSnackbar(true);
      });
  };

  const handleBackToLogin = () => {
    navigation.navigate("Login");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setEmail("");
      setPassword("");
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      if (!state.isConnected) {
        setSnackMessage("No internet");
        setSnackbar(true);
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
          <StatusBar translucent backgroundColor="transparent" />
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
                style={authStyles.input}
                placeholder="Email"
                onChangeText={setEmail}
              />
              <TextInput
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
