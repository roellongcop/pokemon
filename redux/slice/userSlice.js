import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "user",
  initialState: {
    user: null,
    pokemons: [],
    energy: {
      chance: 0,
      time: new Date().getTime(),
    },
    details: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload || state.user;
    },
    setPokemons: (state, action) => {
      state.pokemons = action.payload || state.pokemons;
    },

    setEnergy: (state, action) => {
      state.energy = action.payload || state.energy;
    },
    setDetails: (state, action) => {
      state.details = action.payload || state.details;
    },
  },
});
export default slice.reducer;
