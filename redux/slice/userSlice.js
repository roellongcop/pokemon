import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "user",
  initialState: {
    user: null,
    pokemons: [],
  },
  reducers: {
    
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setPokemons: (state, action) => {
      state.pokemons = action.payload;
    },
  },
});
export default slice.reducer;