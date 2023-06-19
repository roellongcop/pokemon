import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { firebaseOff, firebaseSubscribe, readData } from "../firebaseConfig";
import PokemonImage from "../components/PokemonImage";
import { Button, IconButton } from "react-native-paper";
import { apiGet, apiUrl } from "../lib/api";
import LastPokemonImage from "../components/LastPokemonImage";
import { checkEnergy } from "../lib/user";

const HomeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user, pokemons } = useSelector((state) => state.USER);
  const { lastPokemonId, name, time, totalPokemons, uid } = useSelector(
    (state) => state.LEADERBOARD
  );

  const [myPokemons, setMyPokemons] = useState([]);
  const [wildPokemons, setWildPokemons] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const populateMyPokemons = async (pokemons) => {
    let result = [];

    for (let i = pokemons.length - 3; i < pokemons.length; i++) {
      const pokemonId = pokemons[i];

      try {
        const details = await getPokemonDetails(
          `${apiUrl}pokemon/${pokemonId}`
        );
        result.push({
          name: details.name,
          id: details.id,
          details,
        });
      } catch (error) {}
    }

    setMyPokemons(result);
  };

  const getPokemonDetails = async (url) => {
    const result = await fetch(url);
    const json = await result.json();

    return json;
  };

  const addPokemonDetail = async (pokemons) => {
    for (const key in pokemons) {
      if (Object.hasOwnProperty.call(pokemons, key)) {
        const pokemon = pokemons[key];
        pokemons[key]["details"] = await getPokemonDetails(pokemon.url);
      }
    }

    return pokemons;
  };

  const loadPokemons = (callback = () => {}) => {
    apiGet(`${apiUrl}pokemon`, {
      success: async (data) => {
        if (data) {
          const { results } = data;

          const pokemons = await addPokemonDetail(results);

          setWildPokemons(pokemons);
        }
        callback(data);
      },
      error: (e) => {
        setRefreshing(false);
      },
      offline: (state) => {
        setRefreshing(false);
      },
    });
  };

  const loadMyPokemons = () => {
    readData({
      link: `users/${user.uid}/pokemon`,
      successCallback: (snapshot) => {
        if (snapshot) {
          const pokemon = snapshot.val() || [];

          populateMyPokemons(pokemon ? Object.values(pokemon) : []);
        }

        setRefreshing(false);
      },
      errorCallback: () => {
        setRefreshing(false);
      },
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);

    checkEnergy(user);
    loadMyPokemons();

    loadPokemons();
  };

  useEffect(() => {
    loadMyPokemons();

    loadPokemons();

    firebaseSubscribe("leaderboard", (snapshot) => {
      if (snapshot) {
        dispatch({ type: "leadboard/setState", payload: snapshot.val() });
      }
    });

    return () => {
      firebaseOff("leaderboard");
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <ImageBackground
          source={require("../assets/water.png")}
          resizeMode="cover"
          style={styles.background}
        >
          <View style={styles.headerContainer}>
            <IconButton
              icon="menu"
              onPress={() => {
                navigation.toggleDrawer();
              }}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Dashboard", { screen: "MyAccount" });
              }}
            >
              <LastPokemonImage pokemons={pokemons} />
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.label}>Top Catcher!</Text>
            <View style={styles.topCatcherContainer}>
              <View style={styles.image}>
                <PokemonImage
                  pokemonId={lastPokemonId}
                  width={80}
                  height={80}
                />
              </View>

              <View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.total}>
                  Pokemons: {totalPokemons.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <View style={styles.categoryContainer}>
            <View style={styles.flexContainer}>
              <Text style={styles.subLabel}>My Recent Pokemons</Text>
              <Button
                onPress={() => {
                  navigation.navigate("MyPokemons", {
                    screen: "MyPokemon",
                  });
                }}
              >
                View All
              </Button>
            </View>
            <View style={styles.pokemonContainer}>
              {!myPokemons.length ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                myPokemons.map((pokemon, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      navigation.navigate("PokemonDetail", {
                        customTitle: pokemon.name,
                        pokemon,
                        viewOnly: true,
                      });
                    }}
                  >
                    <View style={styles.myPokemon}>
                      <PokemonImage
                        pokemonId={pokemon.id}
                        width={100}
                        height={100}
                      />
                      <Text style={styles.pokemonName}>{pokemon.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>

          <View style={styles.categoryContainer}>
            <View style={styles.flexContainer}>
              <Text style={styles.subLabel}>Wild Pokemons</Text>
              <Button
                onPress={() => {
                  navigation.navigate("Pokemons", {
                    screen: "PokemonList",
                  });
                }}
              >
                View All
              </Button>
            </View>
            <View style={[styles.pokemonContainer, { paddingBottom: 20 }]}>
              {!wildPokemons.length ? (
                <ActivityIndicator size="small" color="#0000ff" />
              ) : (
                wildPokemons.map((pokemon, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      navigation.navigate("PokemonDetail", {
                        customTitle: pokemon.name,
                        pokemon,
                        viewOnly: false,
                      });
                    }}
                  >
                    <View style={styles.singleWildPokemon}>
                      <PokemonImage
                        pokemonId={pokemon.details.id}
                        width={80}
                        height={80}
                      />
                      <Text style={styles.pokemonName}>
                        {pokemon.details.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    paddingRight: 10,
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  singleWildPokemon: {
    elevation: 2,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 3,
  },
  pokemonName: {
    textAlign: "center",
    marginTop: 5,
    textTransform: "capitalize",
  },
  myPokemon: {
    elevation: 2,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  pokemonContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryContainer: {
    marginTop: 20,
  },
  subLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6a6a6a",
    marginBottom: 10,
  },
  label: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  topCatcherContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    elevation: 2,
  },
  contentContainer: {
    marginHorizontal: 10,
  },

  menu: {
    marginTop: 30,
  },
  background: {
    height: 180,
    marginBottom: 40,
  },
  top: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  image: {
    padding: 10,
  },
  total: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
  },
  leaderboard: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    // paddingTop: 30,
    // padding: 10,
  },
});

export default HomeScreen;
