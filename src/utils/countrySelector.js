import countriesData from '../data/countries.json';

const STORAGE_KEY = 'cultural_expo_countries';
const USED_COUNTRIES_KEY = 'cultural_expo_used_countries';

/**
 * Gets all available countries from the database
 * @returns {Array} Array of country objects
 */
export const getAllCountries = () => {
  if (!countriesData || !countriesData.countries) return [];
  return countriesData.countries;
};

/**
 * Gets used countries from localStorage
 * @returns {Array} Array of used country IDs
 */
const getUsedCountries = () => {
  try {
    const used = localStorage.getItem(USED_COUNTRIES_KEY);
    return used ? JSON.parse(used) : [];
  } catch (error) {
    console.error('Error reading used countries from localStorage:', error);
    return [];
  }
};

/**
 * Saves used countries to localStorage
 * @param {Array} usedCountries - Array of used country IDs
 */
const saveUsedCountries = (usedCountries) => {
  try {
    localStorage.setItem(USED_COUNTRIES_KEY, JSON.stringify(usedCountries));
  } catch (error) {
    console.error('Error saving used countries to localStorage:', error);
  }
};

/**
 * Gets the last selected country from localStorage
 * @returns {Object|null} Last selected country object or null
 */
export const getLastSelectedCountry = () => {
  try {
    const lastSelected = localStorage.getItem(STORAGE_KEY);
    return lastSelected ? JSON.parse(lastSelected) : null;
  } catch (error) {
    console.error('Error reading last selected country from localStorage:', error);
    return null;
  }
};

/**
 * Saves the selected country to localStorage
 * @param {Object} country - Country object to save
 */
export const saveSelectedCountry = (country) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(country));
  } catch (error) {
    console.error('Error saving selected country to localStorage:', error);
  }
};

/**
 * Gets available countries (not yet used in current cycle)
 * @returns {Array} Array of available country objects
 */
export const getAvailableCountries = () => {
  const allCountries = getAllCountries();
  const usedCountries = getUsedCountries();
  
  // If all countries have been used, reset the cycle
  if (usedCountries.length >= allCountries.length) {
    saveUsedCountries([]);
    return allCountries;
  }
  
  // Return countries that haven't been used yet
  return allCountries.filter(country => !usedCountries.includes(country.id));
};

/**
 * Marks a country as used in the current cycle
 * @param {string} countryId - ID of the country to mark as used
 */
const markCountryAsUsed = (countryId) => {
  const usedCountries = getUsedCountries();
  if (!usedCountries.includes(countryId)) {
    usedCountries.push(countryId);
    saveUsedCountries(usedCountries);
  }
};

/**
 * Selects a random country from available countries
 * @returns {Object} Randomly selected country object
 */
export const selectRandomCountry = () => {
  const availableCountries = getAvailableCountries();
  
  if (availableCountries.length === 0) {
    // This shouldn't happen due to reset logic, but fallback to all countries
    const allCountries = getAllCountries();
    const randomIndex = Math.floor(Math.random() * allCountries.length);
    const selectedCountry = allCountries[randomIndex];
    
    // Reset and mark this country as used
    saveUsedCountries([selectedCountry.id]);
    saveSelectedCountry(selectedCountry);
    
    return selectedCountry;
  }
  
  // Select random country from available ones
  const randomIndex = Math.floor(Math.random() * availableCountries.length);
  const selectedCountry = availableCountries[randomIndex];
  
  // Mark as used and save selection
  markCountryAsUsed(selectedCountry.id);
  saveSelectedCountry(selectedCountry);
  
  return selectedCountry;
};

/**
 * Gets a specific country by ID
 * @param {string} countryId - ID of the country to find
 * @returns {Object|null} Country object or null if not found
 */
export const getCountryById = (countryId) => {
  const allCountries = getAllCountries();
  return allCountries.find(country => country.id === countryId) || null;
};

/**
 * Gets countries by region
 * @param {string} region - Region name to filter by
 * @returns {Array} Array of countries in the specified region
 */
export const getCountriesByRegion = (region) => {
  const allCountries = getAllCountries();
  return allCountries.filter(country => 
    country.region.toLowerCase().includes(region.toLowerCase())
  );
};

/**
 * Searches countries by name
 * @param {string} searchTerm - Search term for country names
 * @returns {Array} Array of countries matching the search term
 */
export const searchCountries = (searchTerm) => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  const allCountries = getAllCountries();
  const term = searchTerm.toLowerCase();
  
  return allCountries.filter(country =>
    country.name.toLowerCase().includes(term) ||
    country.capital.toLowerCase().includes(term) ||
    country.region.toLowerCase().includes(term)
  );
};

/**
 * Gets statistics about country selection
 * @returns {Object} Object containing selection statistics
 */
export const getSelectionStats = () => {
  const allCountries = getAllCountries();
  const usedCountries = getUsedCountries();
  
  return {
    totalCountries: allCountries.length,
    countriesExplored: usedCountries.length,
    countriesRemaining: allCountries.length - usedCountries.length,
    completionPercentage: Math.round((usedCountries.length / allCountries.length) * 100),
    cycleComplete: usedCountries.length >= allCountries.length
  };
};

/**
 * Resets the selection cycle (clears used countries)
 */
export const resetSelectionCycle = () => {
  saveUsedCountries([]);
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Gets regions with country counts
 * @returns {Object} Object with regions as keys and country counts as values
 */
export const getRegionStats = () => {
  const allCountries = getAllCountries();
  const regionCounts = {};

  if (!allCountries || allCountries.length === 0) return regionCounts;

  allCountries.forEach(country => {
    if (!country || !country.region) return;
    const region = country.region;
    regionCounts[region] = (regionCounts[region] || 0) + 1;
  });

  return regionCounts;
};
