import { StyleSheet } from "react-native";

const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  overlay: {
    flex: 1,
    backgroundColor: "#eaeaea",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 40,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: 350,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 5,
  },
  helpButton: {
    alignSelf: "flex-start",
    marginLeft: -10
  },
  mainButton: { width: "90%", maxWidth: 350 },
  mainButtonLabel: { color: "#fff" },
  bottomLink: {
    position: "absolute",
    bottom: 20,
  },
});

export default authStyles;
