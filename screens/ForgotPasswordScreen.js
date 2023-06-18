import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StatusBar,
  Image,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import authStyles from "../styles/authStyles";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import NetInfo from "@react-native-community/netinfo";

const ForgotPasswordScreen = ({ navigation }) => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const handleLoginBtn = () => {
    navigation.navigate("Login");
  };

  const handleRefresh = () => {
    setRefreshing(true);

    setEmail("");
    setRefreshing(false);
  };

  const showSnackBar = (message) => {
    setSnackMessage(message);
    setSnackbar(true);
  };

  const handleResetPassword = () => {
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        showSnackBar("Password reset email sent");
      })
      .catch((error) => {
        setLoading(false);
        const { code } = error;
        showSnackBar(code);
      });
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
                source={require("../assets/forgot.png")}
                style={authStyles.image}
              />
              <Text style={authStyles.logo}>Reset your Password</Text>
            </View>

            <View style={authStyles.inputContainer}>
              <TextInput
                value={email}
                style={authStyles.input}
                placeholder="Email"
                onChangeText={setEmail}
              />
              <Button style={authStyles.helpButton} onPress={handleLoginBtn}>
                Back to Login
              </Button>
            </View>

            <Button
              disabled={loading}
              loading={loading}
              buttonColor="#337ab7"
              mode="contained"
              icon="email-fast-outline"
              labelStyle={{ color: "#fff" }}
              onPress={handleResetPassword}
            >
              Reset Password
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

export default ForgotPasswordScreen;
