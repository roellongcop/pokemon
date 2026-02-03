import { apiUrl } from "./api";

/**
 * Fetches Pokemon details from the PokeAPI
 * @param {string} url - The full URL to fetch Pokemon details from
 * @returns {Promise<Object>} The Pokemon details
 */
export const getPokemonDetails = async (url) => {
  const result = await fetch(url);
  const json = await result.json();
  return json;
};

/**
 * Fetches Pokemon details by ID
 * @param {number|string} pokemonId - The Pokemon ID
 * @returns {Promise<Object>} The Pokemon details
 */
export const getPokemonById = async (pokemonId) => {
  return getPokemonDetails(`${apiUrl}pokemon/${pokemonId}`);
};

/**
 * Adds details to each Pokemon in an array by fetching from the API
 * @param {Array} pokemons - Array of Pokemon objects with url property
 * @returns {Promise<Array>} Array of Pokemon objects with added details
 */
export const addPokemonDetails = async (pokemons) => {
  const pokemonsWithDetails = [...pokemons];

  for (const key in pokemonsWithDetails) {
    if (Object.hasOwnProperty.call(pokemonsWithDetails, key)) {
      const pokemon = pokemonsWithDetails[key];
      pokemonsWithDetails[key].details = await getPokemonDetails(pokemon.url);
    }
  }

  return pokemonsWithDetails;
};

/**
 * Loads Pokemon details for an array of Pokemon IDs
 * @param {Array<number>} pokemonIds - Array of Pokemon IDs
 * @returns {Promise<Array>} Array of Pokemon objects with name and details
 */
export const loadPokemonsByIds = async (pokemonIds) => {
  const result = [];

  for (const pokemonId of pokemonIds) {
    const details = await getPokemonById(pokemonId);
    result.push({
      name: details.name,
      id: details.id,
      details,
    });
  }

  return result;
};
