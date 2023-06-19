import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "user",
  initialState: {
    user: null,
    pokemons: [],
    energy: {
      chance: 0,
      time: new Date().getTime()
    },
    details: null
  },
  reducers: {
    
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setPokemons: (state, action) => {
      state.pokemons = action.payload;
    },

    setEnergy: (state, action) => {
      state.energy = action.payload;
    },
    setDetails: (state, action) => {
      state.details = action.payload;
    }
    
  },
});
export default slice.reducer;