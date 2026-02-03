// Pre-loaded image assets for Pokemon types
const TYPE_IMAGES = {
  normal: require("../assets/normal.png"),
  fighting: require("../assets/fighting.png"),
  ghost: require("../assets/fighting.png"),
  unknown: require("../assets/fighting.png"),
  water: require("../assets/water.png"),
  flying: require("../assets/water.png"),
  electric: require("../assets/water.png"),
  ice: require("../assets/water.png"),
  fire: require("../assets/fire.png"),
  steel: require("../assets/fire.png"),
  dragon: require("../assets/fire.png"),
  grass: require("../assets/grass.png"),
  psychic: require("../assets/grass.png"),
  fairy: require("../assets/grass.png"),
  bug: require("../assets/bug.png"),
  poison: require("../assets/bug.png"),
  ground: require("../assets/bug.png"),
  rock: require("../assets/bug.png"),
  shadow: require("../assets/bug.png"),
  dark: require("../assets/bug.png"),
};

const DEFAULT_IMAGE = require("../assets/water.png");

/**
 * Gets the background image for a Pokemon type
 * @param {string} type - The Pokemon type
 * @returns {ImageSource} The image source for the type
 */
export const getTypeImage = (type) => {
  return TYPE_IMAGES[type] || DEFAULT_IMAGE;
};

/**
 * All Pokemon types
 */
export const POKEMON_TYPES = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
  "unknown",
  "shadow",
];
