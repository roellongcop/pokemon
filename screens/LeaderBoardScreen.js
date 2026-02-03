import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import { firebaseSubscribe } from "../firebaseConfig";
import PokemonImage from "../components/PokemonImage";
import { timeAgo } from "../lib/date";
import { Badge, IconButton } from "react-native-paper";
import { checkEnergy } from "../lib/user";
import { useSelector } from "react-redux";
import useScrollToTop from "../hooks/useScrollToTop";
import { FIREBASE_PATHS } from "../constants";

const LeaderBoardScreen = () => {
  const { user } = useSelector((state) => state.USER);
  const [leaderboards, setLeaderboards] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {
    flatListRef,
    handleScroll,
    scrollToOffset,
    showScrollToTop,
  } = useScrollToTop();

  const handleRefresh = () => {
    setRefreshing(true);
    checkEnergy(user);
    setRefreshing(false);
  };

  useEffect(() => {
    firebaseSubscribe(FIREBASE_PATHS.USERS, (snapshot) => {
      if (snapshot) {
        const users = snapshot.val();
        const sortedLeaderboards = Object.values(users || []).sort(
          (a, b) => b.details.totalPokemons - a.details.totalPokemons
        );
        setLeaderboards(sortedLeaderboards);
      }
    });
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <FlatList
        ref={flatListRef}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={leaderboards}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Badge style={styles.badge}>
              <Text style={styles.badgeText}>{index + 1}</Text>
            </Badge>
            <View style={styles.imageContainer}>
              <PokemonImage
                pokemonId={item.details.lastPokemonId}
                width={50}
                height={50}
              />
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{item.details.name}</Text>
                <Text>{timeAgo(item.energy.time)}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.total}>
                {item.details.totalPokemons.toLocaleString()}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {showScrollToTop && (
        <IconButton
          icon="arrow-up"
          mode="contained"
          size={30}
          style={{ position: "absolute", bottom: 10, right: 20 }}
          onPress={() => scrollToOffset(0)}
        />
      )}
    </View>
  );
};

export default LeaderBoardScreen;

const styles = StyleSheet.create({
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: 0,
  },
  total: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: "#1BC5BD",
    paddingVertical: 2,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  name: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  nameContainer: {
    marginLeft: 5,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    margin: 10,
    marginVertical: 5,
  },
  container: {
    flex: 1,
  },
});
