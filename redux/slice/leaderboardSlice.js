import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "leadboard",
  initialState: {
    lastPokemonId: 0,
    name: null,
    time: 0,
    totalPokemons: 0,
    uid: null,
  },
  reducers: {
    setState: (state, action) => {
      const { lastPokemonId, name, time, totalPokemons, uid } = action.payload;

      state.lastPokemonId = lastPokemonId || 0;
      state.name = name || null;
      state.time = time || 0;
      state.totalPokemons = totalPokemons || 0;
      state.uid = uid || null;
    },
  },
});
export default slice.reducer;
