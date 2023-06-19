import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import { firebaseSubscribe } from "../firebaseConfig";

const LeaderBoardScreen = () => {

  const [leaderboards, setLeaderboards] = useState([]);

  useEffect(() => {
    firebaseSubscribe('users', (snapshot) => {
      if (snapshot) {
        const users = snapshot.val();

        const leaderboards = Object.values(users || []);

        // Sort the users array based on the pokemonCount in descending order
        leaderboards.sort((a, b) => b.totalPokemons - a.totalPokemons);

        setLeaderboards(leaderboards || []);
      }
    });
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>LeaderBoardScreen</Text>

      <FlatList
        // ref={flatListRef}
        // refreshing={refreshing}
        // onRefresh={handleRefresh}
        // onScroll={handleScroll}
        // scrollEventThrottle={16}
        data={leaderboards}
        numColumns={2}
        renderItem={({ item, index }) => (
          <Text>{item.details.name}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default LeaderBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
