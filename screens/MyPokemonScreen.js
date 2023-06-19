import React, { useEffect, useRef, useState } from "react";
import { Text, View, SafeAreaView, FlatList, StyleSheet } from "react-native";
import { apiUrl } from "../lib/api";
import Pokemon from "../components/Pokemon";
import { useSelector } from "react-redux";
import { IconButton, Searchbar } from "react-native-paper";
import { checkEnergy } from "../lib/user";

const MyPokemonScreen = ({ navigation, route }) => {
  const { user, pokemons } = useSelector((state) => state.USER);
  const [myPokemons, setMyPokemons] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [searchTerm, setSearchTerm] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    loadPokemons();
  }, [pokemons]);

  const getPokemonDetails = async (url) => {
    const result = await fetch(url);
    const json = await result.json();

    return json;
  };

  const loadPokemons = async (callback = () => {}) => {
    let result = [];

    for (let index = 0; index < pokemons.length; index++) {
      const pokemonId = pokemons[index];

      const details = await getPokemonDetails(`${apiUrl}pokemon/${pokemonId}`);
      result.push({
        name: details.name,
        details: details,
      });
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

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const { y } = contentOffset;

    if (y > offset) {
      setScrollDirection("down");
    } else {
      setScrollDirection("up");
    }
    setOffset(y);
  };

  const scrollToOffset = (offset) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: offset, animated: true });
    }
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

      {scrollDirection == "down" && offset ? (
        <IconButton
          icon="arrow-up"
          mode="contained"
          size={30}
          style={{ position: "absolute", bottom: 10, right: 20 }}
          onPress={() => scrollToOffset(1)}
        />
      ) : null}
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
