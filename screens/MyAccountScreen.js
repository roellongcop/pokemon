import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { timeAgo } from "../lib/date";
import PokemonImage from "../components/PokemonImage";
import { apiUrl } from "../lib/api";
import {
  SafeAreaView,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { checkEnergy } from "../lib/user";
import { Button } from "react-native-paper";
import { auth, updateProfile } from "../firebaseConfig";
import { setData } from "../firebaseConfig";

const MyAccountScreen = () => {
  const { user, pokemons, energy, details } = useSelector((state) => state.USER);

  const [name, setName] = useState(user?.displayName);

  const [lastPokemon, setLastPokemon] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPokemonDetails = async (url) => {
    const result = await fetch(url);
    const json = await result.json();

    return json;
  };

  const getLastPokemon = async () => {
    const pokemonId = pokemons[pokemons.length - 1];
    const details = await getPokemonDetails(`${apiUrl}pokemon/${pokemonId}`);

    setLastPokemon(details);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    checkEnergy(user);
    getLastPokemon();
    setRefreshing(false);
  };

  const handleChaneName = () => {
    setLoading(true);
    const currentUser = auth.currentUser;

    updateProfile(currentUser, {
      displayName: name,
    })
      .then(() => {
        setData({
          link: `users/${currentUser.uid}/details/name`,
          data: name,
          successCallback: () => {
            Alert.alert("Success", "Successfully updated Name");
            setLoading(false);
          },
          errorCallback: () => {
            Alert.alert("Error", "Error updating display name");
            setLoading(false);
          },
        });
      })
      .catch((error) => {
        Alert.alert("Error", "Error updating display name");
        setLoading(false);
      });
  };

  useEffect(() => {
    setName(user.displayName || details?.name || user?.email?.split('@')[0])
    getLastPokemon();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.contentContainer}>
          <Text style={styles.header}>Energy</Text>
          <View style={styles.card}>
            <Text>Chance: {energy.chance}</Text>
            <Text>Last used: {timeAgo(energy.time)}</Text>
          </View>

          <Text style={styles.header}>Pokemons</Text>
          <View style={styles.card}>
            <Text>Total Pokemon: {pokemons.length}</Text>
          </View>

          <Text style={styles.header}>Last Pokemon</Text>
          <View style={styles.card}>
            <View style={styles.lastPokemonContainer}>
              <PokemonImage
                pokemonId={lastPokemon?.id}
                width={200}
                height={200}
              />
              <View>
                <Text style={styles.statsHeader}>{lastPokemon?.name}</Text>
                {lastPokemon?.stats.map((stat, index) => (
                  <Text style={styles.item} key={index.toString()}>
                    {stat.stat.name}: {stat.base_stat}
                  </Text>
                ))}
                <View style={styles.tabContentContainer}>
                  <Text style={styles.item}>
                    Height: {lastPokemon?.height} in
                  </Text>
                  <Text style={styles.item}>
                    Weight: {lastPokemon?.weight} lbs
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.header}>Account Details</Text>
          <View style={styles.card}>
            <Text>Email: {user.email}</Text>
            <Text>ID: {user.uid}</Text>

            <Text>Name:</Text>
            <TextInput
              placeholder="Enter Code Name"
              style={styles.input}
              onChangeText={setName}
              value={name}
            />

            <Button
              disabled={loading}
              loading={loading}
              style={styles.button}
              mode="contained"
              onPress={handleChaneName}
            >
              Change Name
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  tabContentContainer: {},
  item: {
    fontSize: 16,
  },
  statsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  lastPokemonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  card: {
    elevation: 2,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  contentContainer: {
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 3,
    marginTop: 10,
  },
  container: {
    flex: 1,
  },
});
