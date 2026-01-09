/**
 * Experience Manager Utility
 * Comprehensive system for managing cultural experiences, calendar integration, and user progress
 */

const EXPERIENCES_KEY = 'cultural_expo_experiences';
const USER_PREFERENCES_KEY = 'cultural_expo_preferences';
const ACHIEVEMENTS_KEY = 'cultural_expo_achievements';

// Current user scoping for storage
let currentUserId = 'guest';
export const setCurrentUserId = (userId) => {
  currentUserId = userId || 'guest';
};

const keyFor = (baseKey) => {
  return currentUserId === 'guest' ? baseKey : `${baseKey}__${currentUserId}`;
};

/**
 * Experience data structure:
 * {
 *   id: "unique_id",
 *   date: "2024-01-15",
 *   country: { id: "japan", name: "Japan", flag: "🇯🇵" },
 *   dishes: [
 *     { name: "Ramen", attempted: true, rating: 4, notes: "Delicious but took long", difficulty: "Hard" }
 *   ],
 *   drinks: [
 *     { name: "Sake", attempted: true, rating: 5, notes: "Perfect temperature", type: "Alcoholic" }
 *   ],
 *   movies: [
 *     { name: "Seven Samurai", watched: true, rating: 5, notes: "Epic masterpiece", year: "1954" }
 *   ],
 *   overall_notes: "Great cultural Sunday! Kids loved the food.",
 *   created_at: "2024-01-15T10:30:00Z",
 *   updated_at: "2024-01-15T10:30:00Z"
 * }
 */

/**
 * Get all cultural experiences from localStorage
 * @returns {Array} Array of experience objects
 */
export const getAllExperiences = () => {
  try {
    const experiences = localStorage.getItem(keyFor(EXPERIENCES_KEY));
    return experiences ? JSON.parse(experiences) : [];
  } catch (error) {
    console.error('Error reading experiences from localStorage:', error);
    return [];
  }
};

/**
 * Save experience to localStorage
 * @param {Object} experience - Experience object
 * @returns {string} Experience ID
 */
export const saveExperience = (experience) => {
  try {
    const experiences = getAllExperiences();
    const now = new Date().toISOString();
    
    if (experience.id) {
      // Update existing experience
      const index = experiences.findIndex(exp => exp.id === experience.id);
      if (index !== -1) {
        experiences[index] = { ...experience, updated_at: now };
      }
    } else {
      // Create new experience
      const newExperience = {
        ...experience,
        id: generateExperienceId(),
        created_at: now,
        updated_at: now
      };
      experiences.push(newExperience);
      experience.id = newExperience.id;
    }
    
    localStorage.setItem(keyFor(EXPERIENCES_KEY), JSON.stringify(experiences));
    
    // Dispatch custom event to notify components of experience changes
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('experienceChanged'));
    }
    
    return experience.id;
  } catch (error) {
    console.error('Error saving experience:', error);
    return null;
  }
};

/**
 * Delete experience by ID
 * @param {string} experienceId - Experience ID
 */
export const deleteExperience = (experienceId) => {
  try {
    const experiences = getAllExperiences();
    const filtered = experiences.filter(exp => exp.id !== experienceId);
    localStorage.setItem(keyFor(EXPERIENCES_KEY), JSON.stringify(filtered));
    
    // Dispatch custom event to notify components of experience changes
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('experienceChanged'));
    }
  } catch (error) {
    console.error('Error deleting experience:', error);
  }
};

/**
 * Get experience by ID
 * @param {string} experienceId - Experience ID
 * @returns {Object|null} Experience object or null
 */
export const getExperienceById = (experienceId) => {
  const experiences = getAllExperiences();
  return experiences.find(exp => exp.id === experienceId) || null;
};

/**
 * Get experiences for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array} Array of experiences for that date
 */
export const getExperiencesByDate = (date) => {
  const experiences = getAllExperiences();
  return experiences.filter(exp => exp.date === date);
};

/**
 * Get experiences for a specific month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {Array} Array of experiences for that month
 */
export const getExperiencesByMonth = (year, month) => {
  const experiences = getAllExperiences();
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  return experiences.filter(exp => exp.date.startsWith(monthStr));
};

/**
 * Check if experience exists for country on specific date
 * @param {string} countryId - Country ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Object|null} Existing experience or null
 */
export const getExperienceForCountryOnDate = (countryId, date) => {
  const experiences = getExperiencesByDate(date);
  return experiences.find(exp => exp.country.id === countryId) || null;
};

/**
 * Generate unique experience ID
 * @returns {string} Unique ID
 */
const generateExperienceId = () => {
  return 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Get cultural statistics
 * @returns {Object} Comprehensive statistics
 */
export const getCulturalStatistics = () => {
  const experiences = getAllExperiences();
  
  const stats = {
    totalExperiences: experiences.length,
    countriesExplored: new Set(experiences.map(exp => exp.country.id)).size,
    totalDishesAttempted: 0,
    totalDrinksAttempted: 0,
    totalMoviesWatched: 0,
    averageRatings: { dishes: 0, drinks: 0, movies: 0 },
    favoriteCuisines: {},
    mostActiveMonths: {},
    recentExperiences: [],
    achievements: []
  };
  
  let dishRatings = [];
  let drinkRatings = [];
  let movieRatings = [];
  
  experiences.forEach(exp => {
    // Count attempts and collect ratings
    exp.dishes?.forEach(dish => {
      if (dish.attempted) {
        stats.totalDishesAttempted++;
        if (dish.rating) dishRatings.push(dish.rating);
        
        // Track cuisine preferences
        const cuisine = exp.country.name;
        if (!stats.favoriteCuisines[cuisine]) {
          stats.favoriteCuisines[cuisine] = { count: 0, totalRating: 0, avgRating: 0 };
        }
        stats.favoriteCuisines[cuisine].count++;
        if (dish.rating) {
          stats.favoriteCuisines[cuisine].totalRating += dish.rating;
          stats.favoriteCuisines[cuisine].avgRating = 
            stats.favoriteCuisines[cuisine].totalRating / stats.favoriteCuisines[cuisine].count;
        }
      }
    });
    
    exp.drinks?.forEach(drink => {
      if (drink.attempted) {
        stats.totalDrinksAttempted++;
        if (drink.rating) drinkRatings.push(drink.rating);
      }
    });
    
    exp.movies?.forEach(movie => {
      if (movie.watched) {
        stats.totalMoviesWatched++;
        if (movie.rating) movieRatings.push(movie.rating);
      }
    });
    
    // Track active months
    const monthKey = exp.date.substring(0, 7); // YYYY-MM
    stats.mostActiveMonths[monthKey] = (stats.mostActiveMonths[monthKey] || 0) + 1;
  });
  
  // Calculate average ratings
  stats.averageRatings.dishes = dishRatings.length > 0 ? 
    dishRatings.reduce((a, b) => a + b, 0) / dishRatings.length : 0;
  stats.averageRatings.drinks = drinkRatings.length > 0 ? 
    drinkRatings.reduce((a, b) => a + b, 0) / drinkRatings.length : 0;
  stats.averageRatings.movies = movieRatings.length > 0 ? 
    movieRatings.reduce((a, b) => a + b, 0) / movieRatings.length : 0;
  
  // Recent experiences
  stats.recentExperiences = experiences
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  // Check for achievements
  stats.achievements = calculateAchievements(stats);
  
  return stats;
};

/**
 * Calculate achievements based on statistics
 * @param {Object} stats - Statistics object
 * @returns {Array} Array of achievement objects
 */
const calculateAchievements = (stats) => {
  const achievements = [];
  
  const achievementDefinitions = [
    { id: 'first_experience', name: 'First Steps', description: 'Recorded your first cultural experience', threshold: 1, value: stats.totalExperiences, emoji: '🌟' },
    { id: 'country_explorer', name: 'Country Explorer', description: 'Explored 5 different countries', threshold: 5, value: stats.countriesExplored, emoji: '🗺️' },
    { id: 'world_traveler', name: 'World Traveler', description: 'Explored 10 different countries', threshold: 10, value: stats.countriesExplored, emoji: '✈️' },
    { id: 'culinary_novice', name: 'Culinary Novice', description: 'Attempted 10 traditional dishes', threshold: 10, value: stats.totalDishesAttempted, emoji: '👨‍🍳' },
    { id: 'master_chef', name: 'Master Chef', description: 'Attempted 25 traditional dishes', threshold: 25, value: stats.totalDishesAttempted, emoji: '🥘' },
    { id: 'drink_enthusiast', name: 'Drink Enthusiast', description: 'Tried 15 traditional beverages', threshold: 15, value: stats.totalDrinksAttempted, emoji: '🍹' },
    { id: 'film_buff', name: 'Cultural Film Buff', description: 'Watched 20 cultural films', threshold: 20, value: stats.totalMoviesWatched, emoji: '🎬' },
    { id: 'consistent_explorer', name: 'Consistent Explorer', description: 'Recorded experiences for 30 days', threshold: 30, value: stats.totalExperiences, emoji: '📅' }
  ];
  
  achievementDefinitions.forEach(achievement => {
    if (achievement.value >= achievement.threshold) {
      achievements.push({
        ...achievement,
        earned: true,
        earnedDate: new Date().toISOString()
      });
    }
  });
  
  return achievements;
};

/**
 * Get user preferences
 * @returns {Object} User preferences object
 */
export const getUserPreferences = () => {
  try {
    const prefs = localStorage.getItem(keyFor(USER_PREFERENCES_KEY));
    return prefs ? JSON.parse(prefs) : {
      theme: 'light',
      lastSelectedCountry: null,
      calendarView: 'month',
      defaultRatings: true,
      notifications: true,
      autoSave: true,
      language: 'en'
    };
  } catch (error) {
    console.error('Error reading user preferences:', error);
    return {};
  }
};

/**
 * Save user preferences
 * @param {Object} preferences - Preferences object
 */
export const saveUserPreferences = (preferences) => {
  try {
    const currentPrefs = getUserPreferences();
    const updatedPrefs = { ...currentPrefs, ...preferences };
    localStorage.setItem(keyFor(USER_PREFERENCES_KEY), JSON.stringify(updatedPrefs));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

/**
 * Export experiences as JSON
 * @returns {string} JSON string of all experiences
 */
export const exportExperiences = () => {
  const experiences = getAllExperiences();
  const stats = getCulturalStatistics();
  const preferences = getUserPreferences();
  
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    version: '1.0',
    experiences,
    statistics: stats,
    preferences
  }, null, 2);
};

/**
 * Import experiences from JSON
 * @param {string} jsonData - JSON string of experiences
 * @returns {boolean} Success status
 */
export const importExperiences = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.experiences && Array.isArray(data.experiences)) {
      localStorage.setItem(keyFor(EXPERIENCES_KEY), JSON.stringify(data.experiences));
      
      if (data.preferences) {
        localStorage.setItem(keyFor(USER_PREFERENCES_KEY), JSON.stringify(data.preferences));
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing experiences:', error);
    return false;
  }
};

/**
 * Migrate guest data to user account
 * This should be called when a user signs in
 * @param {string} userId - The user ID to migrate data to
 * @returns {boolean} Success status
 */
export const migrateGuestDataToUser = (userId) => {
  try {
    if (!userId || userId === 'guest') {
      return false;
    }

    // Get guest data
    const guestExperiences = localStorage.getItem(EXPERIENCES_KEY);
    const guestPreferences = localStorage.getItem(USER_PREFERENCES_KEY);
    const guestAchievements = localStorage.getItem(ACHIEVEMENTS_KEY);

    // Get existing user data
    const userExperiencesKey = `${EXPERIENCES_KEY}__${userId}`;
    const userPreferencesKey = `${USER_PREFERENCES_KEY}__${userId}`;
    const userAchievementsKey = `${ACHIEVEMENTS_KEY}__${userId}`;

    let hasDataToMigrate = false;

    // Migrate experiences
    if (guestExperiences) {
      const guestExp = JSON.parse(guestExperiences);
      if (guestExp && guestExp.length > 0) {
        const existingUserExp = localStorage.getItem(userExperiencesKey);
        if (existingUserExp) {
          // Merge guest and user experiences, avoiding duplicates
          const userExp = JSON.parse(existingUserExp);
          const mergedExp = [...userExp];
          
          guestExp.forEach(guestExpItem => {
            // Check if experience already exists (by date and country)
            const exists = userExp.some(userExpItem => 
              userExpItem.date === guestExpItem.date && 
              userExpItem.country?.id === guestExpItem.country?.id
            );
            if (!exists) {
              mergedExp.push(guestExpItem);
            }
          });
          
          localStorage.setItem(userExperiencesKey, JSON.stringify(mergedExp));
        } else {
          // No existing user data, just copy guest data
          localStorage.setItem(userExperiencesKey, guestExperiences);
        }
        hasDataToMigrate = true;
      }
    }

    // Migrate preferences (user preferences take precedence)
    if (guestPreferences && !localStorage.getItem(userPreferencesKey)) {
      localStorage.setItem(userPreferencesKey, guestPreferences);
      hasDataToMigrate = true;
    }

    // Migrate achievements
    if (guestAchievements) {
      const guestAch = JSON.parse(guestAchievements);
      if (guestAch && guestAch.length > 0) {
        const existingUserAch = localStorage.getItem(userAchievementsKey);
        if (existingUserAch) {
          // Merge achievements
          const userAch = JSON.parse(existingUserAch);
          const mergedAch = [...userAch];
          
          guestAch.forEach(guestAchItem => {
            const exists = userAch.some(userAchItem => userAchItem.id === guestAchItem.id);
            if (!exists) {
              mergedAch.push(guestAchItem);
            }
          });
          
          localStorage.setItem(userAchievementsKey, JSON.stringify(mergedAch));
        } else {
          localStorage.setItem(userAchievementsKey, guestAchievements);
        }
        hasDataToMigrate = true;
      }
    }

    // Clear guest data after successful migration
    if (hasDataToMigrate) {
      localStorage.removeItem(EXPERIENCES_KEY);
      localStorage.removeItem(USER_PREFERENCES_KEY);
      localStorage.removeItem(ACHIEVEMENTS_KEY);
      
      // Dispatch event to notify components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('experienceChanged'));
        window.dispatchEvent(new CustomEvent('userDataMigrated'));
      }
    }

    return hasDataToMigrate;
  } catch (error) {
    console.error('Error migrating guest data to user:', error);
    return false;
  }
};

/**
 * Clear all data (with confirmation)
 */
export const clearAllData = () => {
  try {
    localStorage.removeItem(keyFor(EXPERIENCES_KEY));
    localStorage.removeItem(keyFor(USER_PREFERENCES_KEY));
    localStorage.removeItem(keyFor(ACHIEVEMENTS_KEY));
    
    // Dispatch event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('experienceChanged'));
    }
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

/**
 * Search experiences
 * @param {Object} filters - Search filters
 * @returns {Array} Filtered experiences
 */
export const searchExperiences = (filters) => {
  const experiences = getAllExperiences();
  
  return experiences.filter(exp => {
    // Country filter
    if (filters.country && exp.country.id !== filters.country) {
      return false;
    }
    
    // Date range filter
    if (filters.dateFrom && exp.date < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && exp.date > filters.dateTo) {
      return false;
    }
    
    // Rating filter
    if (filters.minRating) {
      const hasHighRating = [
        ...(exp.dishes || []),
        ...(exp.drinks || []),
        ...(exp.movies || [])
      ].some(item => item.rating && item.rating >= filters.minRating);
      
      if (!hasHighRating) return false;
    }
    
    // Text search
    if (filters.searchText) {
      const text = filters.searchText.toLowerCase();
      const searchableText = [
        exp.country.name,
        exp.overall_notes,
        ...(exp.dishes || []).map(d => d.name + ' ' + (d.notes || '')),
        ...(exp.drinks || []).map(d => d.name + ' ' + (d.notes || '')),
        ...(exp.movies || []).map(m => m.name + ' ' + (m.notes || ''))
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(text)) return false;
    }
    
    return true;
  });
};

/**
 * Get calendar data for a specific month
 * @param {number} year - Year
 * @param {number} month - Month (0-11)
 * @returns {Object} Calendar data with experiences
 */
export const getCalendarData = (year, month) => {
  const experiences = getExperiencesByMonth(year, month);
  const calendarData = {};
  
  experiences.forEach(exp => {
    const day = parseInt(exp.date.split('-')[2]);
    if (!calendarData[day]) {
      calendarData[day] = [];
    }
    calendarData[day].push({
      id: exp.id,
      country: exp.country,
      completedItems: {
        dishes: exp.dishes?.filter(d => d.attempted).length || 0,
        drinks: exp.drinks?.filter(d => d.attempted).length || 0,
        movies: exp.movies?.filter(m => m.watched).length || 0
      },
      totalItems: {
        dishes: exp.dishes?.length || 0,
        drinks: exp.drinks?.length || 0,
        movies: exp.movies?.length || 0
      },
      hasNotes: !!exp.overall_notes
    });
  });
  
  return calendarData;
};
