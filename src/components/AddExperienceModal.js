import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  CalendarIcon,
  GlobeAltIcon,
  PlusIcon,
  CheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { getAllCountries } from '../utils/countrySelector';
import { saveExperience, getExperienceById } from '../utils/experienceManager';
import authenticFoodData from '../data/authenticFoodDatabase.json';
import drinksData from '../data/drinks.json';
import moviesData from '../data/movies.json';

const AddExperienceModal = ({ isOpen, onClose, selectedDate, onExperienceAdded, editingExperienceId }) => {
  const [date, setDate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Food section
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [customFood, setCustomFood] = useState('');
  const [showCustomFoodInput, setShowCustomFoodInput] = useState(false);
  
  // Drink section
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [customDrink, setCustomDrink] = useState('');
  const [showCustomDrinkInput, setShowCustomDrinkInput] = useState(false);
  
  // Movie section
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [customMovie, setCustomMovie] = useState('');
  const [showCustomMovieInput, setShowCustomMovieInput] = useState(false);
  
  // Notes
  const [notes, setNotes] = useState('');
  
  const allCountries = getAllCountries();
  const filteredCountries = allCountries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Load existing experience data when editing
  useEffect(() => {
    if (editingExperienceId && isOpen) {
      const experience = getExperienceById(editingExperienceId);
      if (experience) {
        // Set date
        setDate(experience.date || new Date().toISOString().split('T')[0]);
        
        // Set country
        setSelectedCountry(experience.country || null);
        setCountrySearch(experience.country?.name || '');
        
        // Set foods (dishes)
        setSelectedFoods(experience.dishes || []);
        
        // Set drinks
        setSelectedDrinks(experience.drinks || []);
        
        // Set movies
        setSelectedMovies(experience.movies || []);
        
        // Set notes
        setNotes(experience.overall_notes || '');
      }
    } else if (isOpen) {
      // Reset form when opening for new experience
      if (selectedDate) {
        setDate(selectedDate);
      } else {
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
      }
      setSelectedCountry(null);
      setCountrySearch('');
      setSelectedFoods([]);
      setSelectedDrinks([]);
      setSelectedMovies([]);
      setNotes('');
      setShowCustomFoodInput(false);
      setShowCustomDrinkInput(false);
      setShowCustomMovieInput(false);
      setCustomFood('');
      setCustomDrink('');
      setCustomMovie('');
    }
  }, [editingExperienceId, isOpen, selectedDate]);

  // Get suggestions based on selected country
  const getFoodSuggestions = () => {
    if (!selectedCountry || !selectedCountry.id) return [];
    const countryKey = selectedCountry.id.toLowerCase();
    return authenticFoodData.dishes[countryKey] || [];
  };

  const getDrinkSuggestions = () => {
    if (!selectedCountry || !selectedCountry.id) return [];
    const countryKey = selectedCountry.id.toLowerCase();
    return drinksData[countryKey] || [];
  };

  const getMovieSuggestions = () => {
    if (!selectedCountry || !selectedCountry.id) return [];
    const countryKey = selectedCountry.id.toLowerCase();
    return moviesData[countryKey] || [];
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountrySearch(country.name);
    setShowCountryDropdown(false);
  };

  const handleFoodToggle = (food) => {
    setSelectedFoods(prev => {
      const existing = prev.find(f => f.name === food.name);
      if (existing) {
        return prev.filter(f => f.name !== food.name);
      } else {
        // Preserve custom flag if it exists, otherwise add as new item
        return [...prev, { 
          name: food.name, 
          attempted: false, 
          rating: 0, 
          notes: '',
          custom: food.custom || false
        }];
      }
    });
  };

  const handleDrinkToggle = (drink) => {
    setSelectedDrinks(prev => {
      const existing = prev.find(d => d.name === drink.name);
      if (existing) {
        return prev.filter(d => d.name !== drink.name);
      } else {
        // Preserve custom flag if it exists, otherwise add as new item
        return [...prev, { 
          name: drink.name, 
          attempted: false, 
          rating: 0, 
          notes: '',
          custom: drink.custom || false
        }];
      }
    });
  };

  const handleMovieToggle = (movie) => {
    setSelectedMovies(prev => {
      const existing = prev.find(m => m.title === movie.title);
      if (existing) {
        return prev.filter(m => m.title !== movie.title);
      } else {
        // Preserve custom flag and handle year property for custom movies
        return [...prev, { 
          title: movie.title, 
          year: movie.year || null, 
          watched: false, 
          rating: 0, 
          notes: '',
          custom: movie.custom || false
        }];
      }
    });
  };

  const addCustomFood = () => {
    if (customFood.trim()) {
      setSelectedFoods(prev => [...prev, { name: customFood.trim(), attempted: false, rating: 0, notes: '', custom: true }]);
      setCustomFood('');
      setShowCustomFoodInput(false);
    }
  };

  const addCustomDrink = () => {
    if (customDrink.trim()) {
      setSelectedDrinks(prev => [...prev, { name: customDrink.trim(), attempted: false, rating: 0, notes: '', custom: true }]);
      setCustomDrink('');
      setShowCustomDrinkInput(false);
    }
  };

  const addCustomMovie = () => {
    if (customMovie.trim()) {
      setSelectedMovies(prev => [...prev, { title: customMovie.trim(), watched: false, rating: 0, notes: '', custom: true }]);
      setCustomMovie('');
      setShowCustomMovieInput(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedCountry) {
      return;
    }

    const experience = {
      ...(editingExperienceId && { id: editingExperienceId }), // Include ID if editing
      date,
      country: selectedCountry,
      dishes: selectedFoods,
      drinks: selectedDrinks,
      movies: selectedMovies,
      overall_notes: notes
    };

    const experienceId = saveExperience(experience);
    if (experienceId) {
      onExperienceAdded(experience);
      onClose();
      // Reset form
      setSelectedCountry(null);
      setCountrySearch('');
      setSelectedFoods([]);
      setSelectedDrinks([]);
      setSelectedMovies([]);
      setNotes('');
    }
  };

  const isFormValid = selectedCountry && (selectedFoods.length > 0 || selectedDrinks.length > 0 || selectedMovies.length > 0);

  // Show validation status
  const getValidationMessage = () => {
    if (!selectedCountry) return 'Please select a country';
    if (selectedFoods.length === 0 && selectedDrinks.length === 0 && selectedMovies.length === 0) {
      return 'Please select at least one food, drink, or movie';
    }
    return 'Ready to save!';
  };

  // Focus trap and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Focus trap - get all focusable elements
    const modal = document.querySelector('[role="dialog"]');
    const focusableElements = modal?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);
    
    // Focus first element when modal opens
    setTimeout(() => firstElement?.focus(), 100);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-modal p-0 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          className="bg-dark-tertiary rounded-none sm:rounded-2xl shadow-2xl max-w-4xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-hidden border-0 sm:border border-dark-border flex flex-col"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-dark-border bg-dark-secondary">
            <div>
              <h2 id="modal-title" className="text-xl sm:text-2xl font-semibold text-text-primary flex items-center">
                {editingExperienceId ? (
                  <>
                    <GlobeAltIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-accent-primary" aria-hidden="true" />
                    Edit Cultural Experience
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-accent-primary" aria-hidden="true" />
                    Add Cultural Experience
                  </>
                )}
              </h2>
              <p className="text-text-secondary text-xs sm:text-sm mt-1">
                {editingExperienceId ? 'Update your cultural exploration journey' : 'Record your cultural exploration journey'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-dark-tertiary rounded-lg transition-colors"
              title="Close"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label htmlFor="experience-date" className="block text-sm font-medium text-text-primary mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-2 text-accent-primary" aria-hidden="true" />
                    Date
                  </label>
                  <input
                    id="experience-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input"
                    aria-label="Select date for experience"
                  />
                </div>

                {/* Country Selection */}
                <div className="relative">
                  <label htmlFor="country-search" className="block text-sm font-medium text-text-primary mb-2">
                    <GlobeAltIcon className="w-4 h-4 inline mr-2 text-accent-primary" aria-hidden="true" />
                    Country *
                  </label>
                  <div className="relative">
                    <input
                      id="country-search"
                      type="text"
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setShowCountryDropdown(true);
                      }}
                      onFocus={() => setShowCountryDropdown(true)}
                      placeholder="Search for a country..."
                      className="input pr-10"
                      aria-label="Search and select country"
                      aria-autocomplete="list"
                      aria-expanded={showCountryDropdown}
                      aria-controls="country-dropdown"
                    />
                    <MagnifyingGlassIcon className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary pointer-events-none" aria-hidden="true" />
                  </div>
                  
                  {/* Country Dropdown */}
                  <AnimatePresence>
                    {showCountryDropdown && (
                      <motion.div
                        id="country-dropdown"
                        className="absolute z-10 w-full mt-1 bg-dark-secondary border border-dark-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        role="listbox"
                      >
                        {filteredCountries.map((country) => (
                          <button
                            key={country.id}
                            onClick={() => handleCountrySelect(country)}
                            className="w-full px-4 py-3 text-left hover:bg-dark-tertiary flex items-center space-x-3 transition-colors"
                            role="option"
                            aria-selected={selectedCountry?.id === country.id}
                          >
                            <span className="text-lg" aria-hidden="true">{country.flag}</span>
                            <span className="text-text-primary">{country.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="experience-notes" className="block text-sm font-medium text-text-primary mb-2">
                    Notes
                  </label>
                  <textarea
                    id="experience-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes about your experience..."
                    rows={4}
                    className="input resize-none"
                    aria-label="Add notes about your experience"
                  />
                </div>
              </div>

              {/* Right Column - Cultural Items */}
              <div className="space-y-4 sm:space-y-6">
                {/* Food Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3">🍽️ Food & Dishes</h3>
                  {selectedCountry ? (
                    <div className="space-y-2 sm:space-y-3">
                      {/* Selected Custom Foods */}
                      {selectedFoods.filter(f => f.custom).length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-text-secondary uppercase tracking-wide">Custom Dishes</div>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedFoods.filter(f => f.custom).map((food) => (
                              <button
                                key={`custom-${food.name}`}
                                onClick={() => handleFoodToggle(food)}
                                className="p-3 text-left rounded-lg border bg-accent-primary/10 border-accent-primary text-text-primary transition-colors hover:bg-accent-primary/15"
                                aria-pressed="true"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs">✨</span>
                                    <div className="font-medium text-sm">{food.name}</div>
                                  </div>
                                  <CheckIcon className="w-5 h-5 text-accent-primary" aria-hidden="true" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {getFoodSuggestions().length > 0 && (
                        <div className="space-y-2">
                          {selectedFoods.filter(f => f.custom).length > 0 && (
                            <div className="text-xs font-medium text-text-secondary uppercase tracking-wide">Suggested Dishes</div>
                          )}
                          <div className="grid grid-cols-1 gap-2">
                            {getFoodSuggestions().map((food) => (
                              <button
                                key={food.name}
                                onClick={() => handleFoodToggle(food)}
                                className={`p-3 text-left rounded-lg border transition-colors ${
                                  selectedFoods.find(f => f.name === food.name)
                                    ? 'bg-accent-primary/10 border-accent-primary text-text-primary'
                                    : 'bg-dark-secondary border-dark-border text-text-secondary hover:bg-dark-tertiary'
                                }`}
                                aria-pressed={selectedFoods.find(f => f.name === food.name) ? 'true' : 'false'}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-sm">{food.name}</div>
                                  {selectedFoods.find(f => f.name === food.name) && (
                                    <CheckIcon className="w-5 h-5 text-accent-primary" aria-hidden="true" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Custom Food Input */}
                      {showCustomFoodInput ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customFood}
                            onChange={(e) => setCustomFood(e.target.value)}
                            placeholder="Enter custom dish name..."
                            className="input flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && addCustomFood()}
                            aria-label="Enter custom dish name"
                          />
                          <button
                            onClick={addCustomFood}
                            className="btn btn-accent-primary"
                            aria-label="Add custom dish"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowCustomFoodInput(false);
                              setCustomFood('');
                            }}
                            className="btn btn-secondary"
                            aria-label="Cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomFoodInput(true)}
                          className="w-full p-3 border-2 border-dashed border-dark-border rounded-lg text-text-tertiary hover:border-accent-primary hover:text-accent-primary transition-colors"
                          aria-label="Add custom dish"
                        >
                          + Add Custom Dish
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-text-tertiary text-center py-8 text-sm">
                      Select a country to see food suggestions
                    </div>
                  )}
                </div>

                {/* Drinks Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3">🍹 Drinks & Beverages</h3>
                  {selectedCountry ? (
                    <div className="space-y-2 sm:space-y-3">
                      {/* Selected Custom Drinks */}
                      {selectedDrinks.filter(d => d.custom).length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-text-secondary uppercase tracking-wide">Custom Drinks</div>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedDrinks.filter(d => d.custom).map((drink) => (
                              <button
                                key={`custom-${drink.name}`}
                                onClick={() => handleDrinkToggle(drink)}
                                className="p-3 text-left rounded-lg border bg-accent-primary/10 border-accent-primary text-text-primary transition-colors hover:bg-accent-primary/15"
                                aria-pressed="true"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs">✨</span>
                                    <div className="font-medium text-sm">{drink.name}</div>
                                  </div>
                                  <CheckIcon className="w-5 h-5 text-accent-primary" aria-hidden="true" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {getDrinkSuggestions().length > 0 && (
                        <div className="space-y-2">
                          {selectedDrinks.filter(d => d.custom).length > 0 && (
                            <div className="text-xs font-medium text-text-secondary uppercase tracking-wide">Suggested Drinks</div>
                          )}
                          <div className="grid grid-cols-1 gap-2">
                            {getDrinkSuggestions().map((drink) => (
                              <button
                                key={drink.id}
                                onClick={() => handleDrinkToggle(drink)}
                                className={`p-3 text-left rounded-lg border transition-colors ${
                                  selectedDrinks.find(d => d.name === drink.name)
                                    ? 'bg-accent-primary/10 border-accent-primary text-text-primary'
                                    : 'bg-dark-secondary border-dark-border text-text-secondary hover:bg-dark-tertiary'
                                }`}
                                aria-pressed={selectedDrinks.find(d => d.name === drink.name) ? 'true' : 'false'}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-sm">{drink.name}</div>
                                  {selectedDrinks.find(d => d.name === drink.name) && (
                                    <CheckIcon className="w-5 h-5 text-accent-primary" aria-hidden="true" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Custom Drink Input */}
                      {showCustomDrinkInput ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customDrink}
                            onChange={(e) => setCustomDrink(e.target.value)}
                            placeholder="Enter custom drink name..."
                            className="input flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && addCustomDrink()}
                            aria-label="Enter custom drink name"
                          />
                          <button
                            onClick={addCustomDrink}
                            className="btn btn-accent-primary"
                            aria-label="Add custom drink"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowCustomDrinkInput(false);
                              setCustomDrink('');
                            }}
                            className="btn btn-secondary"
                            aria-label="Cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomDrinkInput(true)}
                          className="w-full p-3 border-2 border-dashed border-dark-border rounded-lg text-text-tertiary hover:border-accent-primary hover:text-accent-primary transition-colors"
                          aria-label="Add custom drink"
                        >
                          + Add Custom Drink
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-text-tertiary text-center py-8 text-sm">
                      Select a country to see drink suggestions
                    </div>
                  )}
                </div>

                {/* Movies Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3">🎬 Movies & Films</h3>
                  {selectedCountry ? (
                    <div className="space-y-2 sm:space-y-3">
                      {/* Selected Custom Movies */}
                      {selectedMovies.filter(m => m.custom).length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-text-secondary uppercase tracking-wide">Custom Movies</div>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedMovies.filter(m => m.custom).map((movie) => (
                              <button
                                key={`custom-${movie.title}`}
                                onClick={() => handleMovieToggle(movie)}
                                className="p-3 text-left rounded-lg border bg-accent-primary/10 border-accent-primary text-text-primary transition-colors hover:bg-accent-primary/15"
                                aria-pressed="true"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs">✨</span>
                                    <div className="font-medium text-sm">{movie.title}</div>
                                  </div>
                                  <CheckIcon className="w-5 h-5 text-accent-primary" aria-hidden="true" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {getMovieSuggestions().length > 0 && (
                        <div className="space-y-2">
                          {selectedMovies.filter(m => m.custom).length > 0 && (
                            <div className="text-xs font-medium text-text-secondary uppercase tracking-wide">Suggested Movies</div>
                          )}
                          <div className="grid grid-cols-1 gap-2">
                            {getMovieSuggestions().map((movie) => (
                              <button
                                key={movie.id}
                                onClick={() => handleMovieToggle(movie)}
                                className={`p-3 text-left rounded-lg border transition-colors ${
                                  selectedMovies.find(m => m.title === movie.title)
                                    ? 'bg-accent-primary/10 border-accent-primary text-text-primary'
                                    : 'bg-dark-secondary border-dark-border text-text-secondary hover:bg-dark-tertiary'
                                }`}
                                aria-pressed={selectedMovies.find(m => m.title === movie.title) ? 'true' : 'false'}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-sm">{movie.title} ({movie.year})</div>
                                  {selectedMovies.find(m => m.title === movie.title) && (
                                    <CheckIcon className="w-5 h-5 text-accent-primary" aria-hidden="true" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Custom Movie Input */}
                      {showCustomMovieInput ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customMovie}
                            onChange={(e) => setCustomMovie(e.target.value)}
                            placeholder="Enter custom movie title..."
                            className="input flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && addCustomMovie()}
                            aria-label="Enter custom movie title"
                          />
                          <button
                            onClick={addCustomMovie}
                            className="btn btn-accent-primary"
                            aria-label="Add custom movie"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setShowCustomMovieInput(false);
                              setCustomMovie('');
                            }}
                            className="btn btn-secondary"
                            aria-label="Cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomMovieInput(true)}
                          className="w-full p-3 border-2 border-dashed border-dark-border rounded-lg text-text-tertiary hover:border-accent-primary hover:text-accent-primary transition-colors"
                          aria-label="Add custom movie"
                        >
                          + Add Custom Movie
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-text-tertiary text-center py-8 text-sm">
                      Select a country to see movie suggestions
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Save Button */}
          <div className="sticky bottom-0 bg-dark-secondary border-t border-dark-border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div className="text-xs sm:text-sm text-text-secondary">
                {selectedCountry && (
                  <div>
                    <span>Selected: {selectedCountry.flag} {selectedCountry.name}</span>
                    <div className="text-xs mt-1">
                      {selectedFoods.length} foods • {selectedDrinks.length} drinks • {selectedMovies.length} movies
                    </div>
                  </div>
                )}
                {!selectedCountry && (
                  <span className="text-text-tertiary">{getValidationMessage()}</span>
                )}
              </div>
              <div className="flex w-full sm:w-auto gap-3">
                <button
                  onClick={onClose}
                  className="btn btn-secondary flex-1 sm:flex-none"
                  aria-label="Cancel and close modal"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`btn flex-1 sm:flex-none ${
                    isFormValid
                      ? 'btn-accent-primary'
                      : 'btn-ghost opacity-50 cursor-not-allowed'
                  }`}
                  aria-label={isFormValid ? (editingExperienceId ? 'Update experience' : 'Save experience') : getValidationMessage()}
                >
                  {isFormValid ? (editingExperienceId ? '💾 Update Experience' : '💾 Save Experience') : getValidationMessage()}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddExperienceModal;
