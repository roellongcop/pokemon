import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "user",
  initialState: {
    user: null,
    credential: { email: "", password: "" },
    pokemons: [],
  },
  reducers: {
    setCurrentUser: (state, action) => {
      if (action.payload) {
        const { user, credential, pokemons } = action.payload;

        state.user = user;
        state.credential = credential;
        state.pokemons = pokemons || [];
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setPokemons: (state, action) => {
      state.pokemons = action.payload;
    },
  },
});

export default slice.reducer;
