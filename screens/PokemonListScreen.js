import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import { apiGet, apiUrl } from "../lib/api";
import Pokemon from "../components/Pokemon";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  IconButton,
  Searchbar,
  SegmentedButtons,
} from "react-native-paper";
import { checkEnergy } from "../lib/user";

const PokemonListScreen = ({ navigation, route }) => {
  const { user } = useSelector((state) => state.USER);
  const dispatch = useDispatch();
  const { pokemons, count, next, previous } = useSelector(
    (state) => state.POKEMON
  );

  const [segment, setSegment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingMore, setLoadingMore] = useState(false);
  const flatListRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");

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
          const { count, next, previous, results } = data;

          const pokemons = await addPokemonDetail(results);

          dispatch({
            type: "pokemon/setState",
            payload: {
              count,
              next,
              previous,
              pokemons,
            },
          });
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

  const handleRefresh = () => {
    checkEnergy(user);

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

  const filteredPokemons = pokemons.filter((obj) => {
    const values = Object.values(obj).map((value) =>
      String(value).toLowerCase()
    );

    return values.some((value) => value.includes(searchTerm.toLowerCase()));
  });
  const scrollToOffset = (offset) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: offset, animated: true });
    }
  };

  const loadMore = () => {
    setLoadingMore(true);
    apiGet(next, {
      success: async (data) => {
        if (data) {
          const { count, next, previous, results } = data;

          const pokemons = await addPokemonDetail(results);

          dispatch({
            type: "pokemon/next",
            payload: {
              count,
              next,
              previous,
              pokemons,
            },
          });
        }
        setLoadingMore(false);
      },
      error: (e) => {
        setLoadingMore(false);
      },
      offline: (state) => {
        setLoadingMore(false);
      },
    });
  };

  const renderFooter = () => {
    return next ? (
      <View>
        <Button
          size={30}
          disabled={loadingMore}
          loading={loadingMore}
          onPress={loadMore}
        >
          Load More
        </Button>
      </View>
    ) : null;
  };

  const segmentButtons = () => {
    const types = [
      "normal",
      "fighting",
      "flying",
      "poison",
      "ground",
      "rock",
      "bug",
      "ghost",
      "steel",
      "fire",
      "water",
      "grass",
      "electric",
      "psychic",
      "ice",
      "dragon",
      "dark",
      "fairy",
      "unknown",
      "shadow",
    ];
    let result = [
      {
        value: "All",
        label: "All",
        // icon: "crowd",
        // showSelectedCheck: true,
        checkedColor: "#fff",
        style: {
          backgroundColor: segment == "All" ? "#337ab7" : "#fff",
          borderColor: segment == "All" ? "#337ab7" : "#ddd",
        },
      },
    ];

    types.forEach((type) => {
      result.push({
        value: type,
        label: type,
        // icon: "crowd",
        // showSelectedCheck: true,
        checkedColor: "#fff",
        style: {
          backgroundColor: segment == type ? "#337ab7" : "#fff",
          borderColor: segment == type ? "#337ab7" : "#ddd",
        },
      });
    });

    return result;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ margin: 10 }}>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchTerm}
          value={searchTerm}
          inputStyle={{ paddingBottom: 10 }}
          style={styles.searchInput}
        />
      </View>

      <Text style={{ marginLeft: 10 }}>
        Showing {filteredPokemons.length} of {pokemons.length} records
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
          <Pokemon pokemon={item} index={index} skeleton={refreshing} />
        )}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter}
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
