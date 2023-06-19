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
  FlatList,
  RefreshControl,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Badge, Button, Chip, IconButton } from "react-native-paper";
import { apiGet } from "../lib/api";
import { checkEnergy } from "../lib/user";
import { pushData, readData, setData } from "../firebaseConfig";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import Ionicons from "react-native-vector-icons/Ionicons";

const PokemonDetailScreen = ({ navigation, route }) => {
  const { user, energy, pokemons } = useSelector((state) => state.USER);
  const { pokemon, viewOnly } = route.params;
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
    checkEnergy(user);
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

  const ChipList = ({ data, dataKey, title }) =>
    data.length ? (
      <FlatList
        refreshing={refreshing}
        onRefresh={handleRefresh}
        data={data}
        renderItem={({ item, index }) => (
          <View key={index.toString()} style={{ marginBottom: 5 }}>
            <Chip mode="outlined" style={{ height: 50 }} icon="information">
              {item[dataKey].name}
            </Chip>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={<Text style={styles.header}>{title}</Text>}
      />
    ) : (
      <Text style={styles.header}>No {title}</Text>
    );

  const Stats = () => (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View>
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
    <ChipList data={details.abilities} dataKey="ability" title="Abilities" />
  );

  const Moves = () => (
    <ChipList data={details.moves} dataKey="move" title="Moves" />
  );

  const HeldItems = () => (
    <ChipList data={details.held_items} dataKey="item" title="Items" />
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
      indicatorStyle={{ backgroundColor: "#3699FF" }}
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
      const randomNumber = Math.floor(Math.random() * 2) + 1;

      if (randomNumber == 2) {
        const newPokemonLength = pokemons.length + 1;
        pushData({
          link: `users/${user.uid}/pokemon`,
          data: details.id,
          successCallback: () => {
            setCaptureSuccess(true);
            setCapturing(false);

            setData({
              link: `users/${user.uid}/energy`,
              data: {
                chance: energy.chance == 0 ? 0 : energy.chance - 1,
                time: new Date().getTime(),
              },
            });

            readData({
              link: "leaderboard",
              successCallback: (snapshot) => {
                if (snapshot && snapshot.val()) {
                  const leaderboard = snapshot.val();
                  if (leaderboard.totalPokemons < newPokemonLength) {
                    setData({
                      link: "leaderboard",
                      data: {
                        uid: user.uid,
                        name: user.displayName || user.email.split("@")[0],
                        lastPokemonId: details.id,
                        totalPokemons: newPokemonLength,
                        time: new Date().getTime(),
                      },
                    });
                  }
                }
              },
            });
          },
          errorCallback: (error) => {
            setCaptureFailed(true);
            setCapturing(false);
          },
        });
      } else {
        setCaptureFailed(true);
        setCapturing(false);
        setData({
          link: `users/${user.uid}/energy`,
          data: {
            chance: energy.chance == 0 ? 0 : energy.chance - 1,
            time: new Date().getTime(),
          },
        });
      }
    }, 4000);
  };

  const capturePercentage = () => {
    const percentage = (captureRate / 255) * 100;

    return percentage.toFixed(2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <ImageBackground
        source={imageSource}
        resizeMode="stretch"
        style={styles.background}
      >
        <IconButton
          style={styles.backButton}
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
          {viewOnly ? null : energy.chance ? (
            <Button
              onPress={handleCapture}
              disabled={capturing}
              loading={capturing}
              mode="contained"
              uppercase={true}
              style={styles.captureButton}
            >
              {capturing ? "capturing" : "capture pokemon"}
            </Button>
          ) : (
            <Button
              disabled={true}
              mode="contained"
              uppercase={true}
              style={styles.captureButton}
            >
              Not Enough Energy
            </Button>
          )}
          {viewOnly ? <Badge style={styles.captureBadge}>Captured</Badge> : null}

          <TabView
            style={viewOnly ? { marginTop: 20 } : null}
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

      <Modal
        visible={capturing}
        animationType="none"
        onRequestClose={() => setCapturing(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, { color: "#FFA800" }]}>
            {energy.chance} {energy.chance > 1 ? "Chances" : "Chance"} Left
          </Text>
          <Image
            width={200}
            height={200}
            source={require("../assets/capturing.gif")}
          />
        </View>
      </Modal>

      <Modal
        visible={captureSuccess}
        animationType="none"
        onRequestClose={() => setCaptureSuccess(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            <Ionicons name="checkmark-outline" size={30} />
            {pokemon.name} Captured!
          </Text>
          <PokemonImage pokemonId={details.id} width={300} height={300} />

          <View style={styles.modalFooterContainer}>
            <Button
              mode="contained"
              icon="eye"
              buttonColor="#1BC5BD"
              labelStyle={{ color: "#fff" }}
              onPress={() => {
                setCaptureSuccess(false);
                navigation.navigate("MyPokemons", {
                  screen: "MyPokemon",
                });
              }}
            >
              My Pokemons
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              mode="contained"
              icon="close"
              buttonColor="#3699FF"
              labelStyle={{ color: "#fff" }}
              onPress={() => setCaptureSuccess(false)}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>

      <Modal
        visible={captureFailed}
        animationType="none"
        onRequestClose={() => setCaptureFailed(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, { color: "#F64E60" }]}>
            <Ionicons name="close-outline" size={30} />
            Capture Failed
          </Text>
          <PokemonImage pokemonId={details.id} width={300} height={300} />
          <Button
            style={{ marginTop: 20 }}
            mode="contained"
            icon="close"
            buttonColor="#3699FF"
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
  captureBadge: {
    backgroundColor: '#1BC5BD',
    paddingHorizontal: 5,
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  modalFooterContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
    textTransform: "capitalize",
    color: "#1BC5BD",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 30,
  },
  captureButton: {
    marginTop: 45,
  },
  tabContentContainer: {
    marginTop: 20,
    // paddingBottom: 600,
    height: "100%",
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
    marginTop: 20,
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
