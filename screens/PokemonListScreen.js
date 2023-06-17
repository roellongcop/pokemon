import React, { useEffect, useRef, useState } from "react";
import { Text, View, SafeAreaView, FlatList } from "react-native";
import { apiGet, apiUrl } from "../lib/api";
import Pokemon from "../components/Pokemon";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";

const PokemonListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { pokemons, count, next, previous } = useSelector(
    (state) => state.POKEMON
  );

  const [searchTerm, setSearchTerm] = useState("");

  const flatListRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");

  const getPokemonDetails = async (url) => {
    const result = await fetch(url);
    const json = await result.json();

    return json;
  };

  const loadPokemons = (callback = () => {}) => {
    apiGet(`${apiUrl}pokemon`, {
      success: async (data) => {
        if (data) {
          const { count, next, previous, results } = data;

          for (const key in results) {
            if (Object.hasOwnProperty.call(results, key)) {
              const pokemon = results[key];
              results[key]["details"] = await getPokemonDetails(pokemon.url);
            }
          }

          dispatch({
            type: "pokemon/setState",
            payload: {
              count,
              next,
              previous,
              pokemons: results,
            },
          });
        }
        callback(data);
      },
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
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

  useEffect(() => {
    setRefreshing(true);
    loadPokemons(() => {
      setRefreshing(false);
    });
  }, []);

  const filteredPokemons = () => {
    return pokemons.filter((obj) => {
      const values = Object.values(obj).map((value) =>
        String(value).toLowerCase()
      );

      // if (segment == "All") {
      return values.some((value) => value.includes(searchTerm.toLowerCase()));
      // }

      // return (
      //   values.some((value) => value.includes(searchTerm.toLowerCase())) &&
      //   obj.user == segment
      // );
    });
  };

  const scrollToOffset = (offset) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: offset, animated: true });
    }
  };

  return (
    <SafeAreaView>
      <FlatList
        ref={flatListRef}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        data={filteredPokemons()}
        numColumns={2}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item, index }) => (
          <Pokemon pokemon={item} index={index} />
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

export default PokemonListScreen;

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    padding: 10,
  },
});
