import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "pokemon",
  initialState: {
    pokemons: [],
    count: 0,
    next: null,
    previous: null,
  },
  reducers: {
    setState: (state, action) => {
      const { pokemons, count, next, previous } = action.payload;
      state.pokemons = pokemons;
      state.count = count;
      state.next = next;
      state.previous = previous;
    },
    next: (state, action) => {
      const { pokemons, count, next, previous } = action.payload;

      state.pokemons = [...state.pokemons, ...pokemons];
      state.count = count;
      state.next = next;
      state.previous = previous;
    },
  },
});
export default slice.reducer;
