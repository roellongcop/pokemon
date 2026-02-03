import React, { useEffect, useState } from "react";
import { Text, View, SafeAreaView, FlatList, StyleSheet } from "react-native";
import Pokemon from "../components/Pokemon";
import { useSelector } from "react-redux";
import { IconButton, Searchbar } from "react-native-paper";
import { checkEnergy } from "../lib/user";
import { getPokemonById } from "../lib/pokemon";
import useScrollToTop from "../hooks/useScrollToTop";

const MyPokemonScreen = ({ navigation, route }) => {
  const { user, pokemons } = useSelector((state) => state.USER);
  const [myPokemons, setMyPokemons] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    flatListRef,
    handleScroll,
    scrollToOffset,
    showScrollToTop,
  } = useScrollToTop();

  useEffect(() => {
    loadPokemons();
  }, [pokemons]);

  const loadPokemons = async (callback = () => {}) => {
    const result = [];

    for (const pokemonId of pokemons) {
      try {
        const details = await getPokemonById(pokemonId);
        result.push({
          name: details.name,
          details: details,
        });
      } catch (error) {
        console.error("Error fetching pokemon:", error);
      }
    }

    setMyPokemons(result.reverse());
    callback();
  };

  const filteredPokemons = myPokemons.filter((obj) => {
    const values = Object.values(obj).map((value) =>
      String(value).toLowerCase()
    );

    return values.some((value) => value.includes(searchTerm.toLowerCase()));
  });

  const handleRefresh = () => {
    setRefreshing(true);
    checkEnergy(user);

    loadPokemons(() => {
      setRefreshing(false);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ margin: 10 }}>
        <Searchbar
          placeholder="Search"
          onChangeText={(val) => {
            setSearchTerm(val);
          }}
          value={searchTerm}
          inputStyle={{ paddingBottom: 10 }}
          style={styles.searchInput}
        />
      </View>

      <Text style={{ marginLeft: 10 }}>
        Showing {filteredPokemons.length} of {myPokemons.length} records
      </Text>
      <FlatList
        ref={flatListRef}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={filteredPokemons}
        numColumns={2}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item, index }) => (
          <Pokemon pokemon={item} index={index} viewOnly={true} />
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
    </SafeAreaView>
  );
};

export default MyPokemonScreen;

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    padding: 10,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    height: 50,
    marginBottom: 0,
  },
  segmentButtons: {
    marginTop: 5,
    marginBottom: 0,
  },
});
