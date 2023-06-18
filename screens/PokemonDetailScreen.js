import React, { useEffect, useState } from "react";
import PokemonImage from "../components/PokemonImage";
import {
  ImageBackground,
  Image,
  ScrollView,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
  Modal,
  RefreshControl,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Button, Chip, IconButton } from "react-native-paper";
import { apiGet } from "../lib/api";
import { pushData } from "../firebaseConfig";
import { useSelector } from "react-redux";

const PokemonDetailScreen = ({ navigation, route }) => {
  const { user } = useSelector((state) => state.USER);
  const { pokemon } = route.params;
  const { details } = pokemon;
  const type = details.types[0].type.name;
  const [capturing, setCapturing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [captureRate, setCaptureRate] = useState("");
  const [imageSource, setImageSource] = useState(
    require("../assets/water.png")
  );

  const [captureSuccess, setCaptureSuccess] = useState(false);
  const [captureFailed, setCaptureFailed] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    updateImageSource();
    setIndex(0);
    setRefreshing(false);
  };

  const updateImageSource = () => {
    switch (type) {
      case "normal":
        setImageSource(require("../assets/normal.png"));
        break;

      case "fighting":
      case "ghost":
      case "unknown":
        setImageSource(require("../assets/fighting.png"));
        break;
      case "water":
      case "flying":
      case "electric":
      case "ice":
        setImageSource(require("../assets/water.png"));
        break;

      case "fire":
      case "steel":
      case "dragon":
        setImageSource(require("../assets/fire.png"));
        break;

      case "grass":
      case "psychic":
      case "fairy":
        setImageSource(require("../assets/grass.png"));
        break;

      case "bug":
      case "poison":
      case "ground":
      case "rock":
      case "shadow":

      case "dark":
        setImageSource(require("../assets/bug.png"));
        break;

      default:
        break;
    }
  };

  const getCaptureRate = () => {
    apiGet(details.species.url, {
      success: (data) => {
        if (data) {
          const { capture_rate } = data;

          setCaptureRate(capture_rate);
        }
      },
      error: (e) => {
        setCapturing(false);
      },
      offline: (state) => {
        setCapturing(false);
      },
    });
  };

  useEffect(() => {
    getCaptureRate();
    updateImageSource();
  }, []);

  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "stats", title: "Stats" },
    { key: "abilities", title: "Abilities" },
    { key: "moves", title: "Moves" },
    { key: "heldItems", title: "Items" },
  ]);

  const Stats = () => (
    <ScrollView>
      <View style={styles.tabContentContainer}>
        <Text style={styles.header}>Stats</Text>
        {details.stats.map((stat, index) => (
          <Text style={styles.item} key={index.toString()}>
            {stat.stat.name}: {stat.base_stat}
          </Text>
        ))}
        <View style={styles.tabContentContainer}>
          <Text style={styles.item}>Height: {details.height} in</Text>
          <Text style={styles.item}>Weight: {details.weight} lbs</Text>
        </View>
      </View>
    </ScrollView>
  );

  const Abilities = () => (
    <ScrollView>
      <View style={styles.tabContentContainer}>
        <Text style={styles.header}>Abilities</Text>
        {details.abilities.map((ability, index) => (
          <View key={index.toString()} style={{ marginBottom: 5 }}>
            <Chip mode="outlined" style={{ height: 50 }} icon="information">
              {ability.ability.name}
            </Chip>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const Moves = () => (
    <ScrollView>
      <View style={styles.tabContentContainer}>
        <Text style={styles.header}>Moves</Text>
        {details.moves.map((move, index) => (
          <View key={index.toString()} style={{ marginBottom: 5 }}>
            <Chip mode="outlined" style={{ height: 50 }} icon="information">
              {move.move.name}
            </Chip>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const HeldItems = () =>
    details.held_items.length ? (
      <ScrollView>
        <View style={styles.tabContentContainer}>
          <Text style={styles.header}>Held Items</Text>
          {details.held_items.map((item, index) => (
            <View key={index.toString()} style={{ marginBottom: 5 }}>
              <Chip mode="outlined" style={{ height: 50 }} icon="information">
                {item.item.name}
              </Chip>
            </View>
          ))}
        </View>
      </ScrollView>
    ) : (
      <View style={styles.tabContentContainer}>
        <Text style={styles.header}>No Held Items</Text>
      </View>
    );
  const Types = () => {
    return (
      <View style={{ display: "flex", flexDirection: "row" }}>
        {details.types.map((type, index) => (
          <Button
            style={{ marginLeft: 5 }}
            mode="elevated"
            key={index.toString()}
          >
            {type.type.name}
          </Button>
        ))}
      </View>
    );
  };

  const renderScene = SceneMap({
    stats: Stats,
    abilities: Abilities,
    moves: Moves,
    heldItems: HeldItems,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#337ab7" }}
      style={{
        backgroundColor: "#fff",
      }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: "#333", margin: 8 }}>{route.title}</Text>
      )}
    />
  );

  const renderLazyPlaceholder = ({ route }) => {
    return (
      <View style={styles.tabContentContainer}>
        <Text style={styles.header}>Loading {route.title}…</Text>
      </View>
    );
  };

  const handleCapture = () => {
    setCapturing(true);

    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 255) + 0;
      console.log("randomNumber", randomNumber);
      console.log("capture_rate", captureRate);
      if (randomNumber <= captureRate) {
        pushData({
          link: `users/${user.uid}/pokemon`,
          data: details.id,
          successCallback: () => {
            setCapturing(false);
            setCaptureSuccess(true);
          },
          errorCallback: (error) => {
            setCapturing(false);
            setCaptureFailed(true);
          },
        });
      } else {
        setCapturing(false);
        setCaptureFailed(true);
      }

      setCapturing(false);
    }, 5000);
  };

  const capturePercentage = () => {
    const percentage = (captureRate / 255) * 100;

    return percentage.toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <ImageBackground
          source={imageSource}
          resizeMode="stretch"
          style={styles.background}
        >
          <IconButton
            iconColor="#fff"
            icon="arrow-left"
            size={25}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{pokemon.name}</Text>
            <View>
              <Types />
            </View>
          </View>
          <View style={styles.imageContainer}>
            <PokemonImage pokemonId={details.id} width={250} height={250} />
          </View>

          <View style={styles.detailsContainer}>
            <Button
              onPress={handleCapture}
              disabled={capturing}
              loading={capturing}
              mode="contained"
              uppercase={true}
              style={styles.captureButton}
            >
              {capturing
                ? "capturing"
                : "capture pokemon (" + capturePercentage() + "%)"}
            </Button>
            <TabView
              lazy
              renderLazyPlaceholder={renderLazyPlaceholder}
              renderTabBar={renderTabBar}
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width }}
            />
          </View>
        </ImageBackground>
      </ScrollView>

      <Modal
        visible={capturing}
        animationType="slide"
        onRequestClose={() => setCapturing(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            width={200}
            height={200}
            source={require("../assets/capturing.gif")}
          />
        </View>
      </Modal>

      <Modal
        visible={captureSuccess}
        animationType="slide"
        onRequestClose={() => setCaptureSuccess(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 30, fontWeight: "bold", marginVertical: 10 }}
          >
            Capture Success
          </Text>
          <Button
            mode="contained"
            icon="close"
            buttonColor="#337ab7"
            labelStyle={{ color: "#fff" }}
            onPress={() => setCaptureSuccess(false)}
          >
            Close
          </Button>
        </View>
      </Modal>

      <Modal
        visible={captureFailed}
        animationType="slide"
        onRequestClose={() => setCaptureFailed(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 30, fontWeight: "bold", marginVertical: 10 }}
          >
            Capture Failed
          </Text>
          <Button
            mode="contained"
            icon="close"
            buttonColor="#337ab7"
            labelStyle={{ color: "#fff" }}
            onPress={() => setCaptureFailed(false)}
          >
            Close
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PokemonDetailScreen;

const styles = StyleSheet.create({
  captureButton: {
    marginTop: 45,
  },
  tabContentContainer: {
    marginTop: 20,
    paddingBottom: 600,
  },
  item: {
    fontSize: 16,
  },
  gallery: {
    height: 200,
    width: 200,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  background: {},
  imageContainer: {
    justifyContent: "center",
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  detailsContainer: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: -50,
    backgroundColor: "#fff",
    padding: 20,
    zIndex: 1,
    minHeight: "100%",
  },
  nameContainer: {
    paddingHorizontal: 20,
    // alignSelf: "flex-start",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textTransform: "capitalize",
  },
  container: {
    flex: 1,
  },
});
