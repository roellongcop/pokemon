import NetInfo from "@react-native-community/netinfo";

export const apiUrl = "https://pokeapi.co/api/v2/";

export const apiGet = (url, { success, error, offline }) => {
  NetInfo.fetch().then((state) => {
    if (state.isConnected) {
      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          success(json);
        })
        .catch((e) => {
          error(e);
        });
    } else {
      offline(state);
    }
  });
};
