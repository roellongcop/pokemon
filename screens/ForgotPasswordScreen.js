import React, { useState } from "react";
import { View, Text, TextInput, Alert, StatusBar, Image } from "react-native";
import { Button } from "react-native-paper";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import authStyles from "../styles/authStyles";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordScreen = ({ navigation }) => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginBtn = () => {
    navigation.navigate("Login");
  };

  const handleResetPassword = () => {
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        Alert.alert("Success", "Password reset email sent");
      })
      .catch((error) => {
        setLoading(false);
        const { code } = error;
        Alert.alert("Error", code);
      });
  };

  return (
    <View style={authStyles.container}>
      <StatusBar translucent backgroundColor="transparent" />

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
          icon="login"
          labelStyle={{ color: "#fff" }}
          onPress={handleResetPassword}
        >
          Reset Password
        </Button>
      </View>
      <ExpoStatusBar style="auto" />
    </View>
  );
};

export default ForgotPasswordScreen;
