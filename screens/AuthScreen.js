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
  TouchableOpacity,
} from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import authStyles from "../styles/authStyles";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { getData, storeData } from "../lib/storage";
import NetInfo from "@react-native-community/netinfo";

const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const handleSignIn = (callback = () => {}) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        const user = userCredential.user || null;

        dispatch({ type: "user/setUser", payload: user });
        storeData("user", user);
        storeData("userCredential", { email, password });
        callback();
      })
      .catch((error) => {
        callback();
        setLoading(false);
        const { code } = error;
        setSnackMessage(code);
        setSnackbar(true);
      });
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getData("userCredential").then((credential) => {
      if (credential) {
        const { email, password } = credential;

        setEmail(email);
        setPassword(password);
        NetInfo.fetch().then((state) => {
          if (state.isConnected) {
            handleSignIn(() => {
              setRefreshing(false);
            });
          } else {
            setRefreshing(false);
            setSnackMessage("No internet");
            setSnackbar(true);
          }
        });
      } else {
        setRefreshing(false);
      }
    });
  };

  const handleCreateAccount = () => {
    navigation.navigate("SignUp");
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
                source={require("../assets/login.png")}
                style={authStyles.image}
              />
              <Text style={authStyles.logo}>Sign In your Account</Text>
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
                onPress={handleForgotPassword}
              >
                Forgot Password?
              </Button>
            </View>

            <Button
              style={authStyles.mainButton}
              disabled={loading}
              loading={loading}
              buttonColor="#337ab7"
              mode="contained"
              icon="login"
              labelStyle={authStyles.mainButtonLabel}
              onPress={handleSignIn}
            >
              Sign In
            </Button>

            <View style={authStyles.bottomLink}>
              <Button onPress={handleCreateAccount}>
                Don't have an account?
              </Button>
            </View>

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

export default AuthScreen;
