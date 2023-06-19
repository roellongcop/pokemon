import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import pokemonSlice from "./slice/pokemonSlice";
import leaderboardSlice from "./slice/leaderboardSlice";
import { asyncFunctionMiddleware } from "./middleware/asyncFunctionMiddleware";
import { getData } from "../lib/storage";

const store = configureStore({
  reducer: {
    USER: userSlice,
    POKEMON: pokemonSlice,
    LEADERBOARD: leaderboardSlice,
  },
  middleware: [asyncFunctionMiddleware],
});

const loadUser = async (dispatch, state) => {
  const currentUser = await getData("currentUser");

  if (currentUser) {
    dispatch({ type: "user/setUser", payload: currentUser.user });
  }
};

store.dispatch(loadUser);

export default store;
