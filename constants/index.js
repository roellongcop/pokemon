// API Constants
export const API_URL = "https://pokeapi.co/api/v2/";

// Firebase Paths
export const FIREBASE_PATHS = {
  USERS: "users",
  LEADERBOARD: "leaderboard",
  POKEMON: "pokemon",
  ENERGY: "energy",
  DETAILS: "details",
};

// User paths builder
export const getUserPath = (uid, subPath = "") => {
  const basePath = `${FIREBASE_PATHS.USERS}/${uid}`;
  return subPath ? `${basePath}/${subPath}` : basePath;
};

export const getUserPokemonPath = (uid) =>
  getUserPath(uid, FIREBASE_PATHS.POKEMON);

export const getUserEnergyPath = (uid) =>
  getUserPath(uid, FIREBASE_PATHS.ENERGY);

export const getUserDetailsPath = (uid) =>
  getUserPath(uid, FIREBASE_PATHS.DETAILS);

// Default energy settings
export const DEFAULT_ENERGY = {
  MAX_CHANCE: 5,
  RECOVERY_TIME_MS: 60000, // 1 minute
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;

// Redux Action Types
export const ACTION_TYPES = {
  USER: {
    SET_USER: "user/setUser",
    SET_ENERGY: "user/setEnergy",
    SET_POKEMONS: "user/setPokemons",
    SET_DETAILS: "user/setDetails",
    LOGOUT: "user/logout",
  },
  POKEMON: {
    SET_STATE: "pokemon/setState",
    NEXT: "pokemon/next",
  },
  LEADERBOARD: {
    SET_STATE: "leadboard/setState",
  },
};

// Screen Names
export const SCREENS = {
  HOME: "Home",
  POKEMON_LIST: "PokemonList",
  POKEMON_DETAIL: "PokemonDetail",
  MY_POKEMON: "MyPokemon",
  MY_ACCOUNT: "MyAccount",
  LEADERBOARD: "LeaderBoard",
  AUTH: "Auth",
};

// Navigation Stack Names
export const STACKS = {
  DASHBOARD: "Dashboard",
  POKEMONS: "Pokemons",
  MY_POKEMONS: "MyPokemons",
  POKEMON_CATCHERS: "PokemonCatchers",
};
