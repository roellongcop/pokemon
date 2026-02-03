import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Stores a value in AsyncStorage
 * @param {string} key - The storage key
 * @param {*} value - The value to store (will be JSON stringified)
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error storing data for key "${key}":`, error);
    return false;
  }
};

/**
 * Retrieves a value from AsyncStorage
 * @param {string} key - The storage key
 * @returns {Promise<*|null>} The parsed value or null if not found/error
 */
const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error reading data for key "${key}":`, error);
    return null;
  }
};

/**
 * Removes a value from AsyncStorage
 * @param {string} key - The storage key
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
    return false;
  }
};

/**
 * Clears all data from AsyncStorage
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error("Error clearing all data:", error);
    return false;
  }
};

/**
 * Gets all keys from AsyncStorage
 * @returns {Promise<Array<string>>} Array of keys or empty array on error
 */
const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys || [];
  } catch (error) {
    console.error("Error getting all keys:", error);
    return [];
  }
};

export { storeData, getData, removeData, clearAllData, getAllKeys };