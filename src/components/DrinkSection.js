import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BeakerIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

// Import the comprehensive drinks database
import drinksData from '../data/drinks.json';

function DrinkSection({ selectedCountry }) {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    if (selectedCountry && selectedCountry.id) {
      setDrinks(drinksData[selectedCountry.id] || []);
      setSelectedDrink(null);
    } else {
      setDrinks([]);
      setSelectedDrink(null);
    }
  }, [selectedCountry]);

  // Early return if no country is selected
  if (!selectedCountry || !selectedCountry.id) {
    return (
      <div className="flex items-center justify-center min-h-48 py-12">
        <div className="text-center">
          <div className="text-4xl mb-3">🍹</div>
          <h3 className="text-lg font-medium text-text-secondary mb-2">Traditional Drinks</h3>
          <p className="text-sm text-text-tertiary">Select a country to explore its beverages</p>
        </div>
      </div>
    );
  }

  const getTemperatureIcon = (temperature) => {
    if (temperature.includes('Hot')) return <span className="text-red-400 text-lg">🔥</span>;
    if (temperature.includes('Cold')) return <span className="text-blue-400 text-lg">❄️</span>;
    if (temperature.includes('Chilled')) return <span className="text-blue-400 text-lg">🧊</span>;
    return <span className="text-gray-400 text-lg">🌡️</span>;
  };



  const handleCardClick = (drinkId) => {
    setSelectedDrink(selectedDrink === drinkId ? null : drinkId);
  };

  if (drinks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🍹</div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No Drinks Found</h3>
        <p className="text-sm text-text-secondary">
          No drink information available for this country.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2">
          Traditional Drinks
        </h3>
        <p className="text-sm text-text-secondary">
          Discover authentic beverages and cocktails from {selectedCountry.name}
        </p>
      </div>

      {/* Drinks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {drinks.map((drink, index) => (
            <motion.div
              key={drink.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              className="relative"
            >
              <motion.div
                className={`card overflow-hidden cursor-pointer ${
                  selectedDrink === drink.id
                    ? 'border-dark-border-hover'
                    : ''
                }`}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleCardClick(drink.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(drink.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={selectedDrink === drink.id}
                aria-label={`${drink.name} - Click to ${selectedDrink === drink.id ? 'collapse' : 'expand'} details`}
              >
                {/* Drink Header */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl sm:text-4xl">{drink.emoji}</div>
                  </div>

                  <h4 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">{drink.name}</h4>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">{drink.description}</p>

                  {/* Quick Info */}
                  <div className="flex items-center justify-between text-xs sm:text-sm text-text-tertiary mb-4">
                    <div className="flex items-center space-x-2">
                      {getTemperatureIcon(drink.temperature)}
                      <span>{drink.temperature}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {drink.alcohol_content !== 'non-alcoholic' && (
                        <BeakerIcon className="w-4 h-4 text-text-secondary" />
                      )}
                      <span>{drink.alcohol_content}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Drink Content */}
                <AnimatePresence>
                  {selectedDrink === drink.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-dark-border bg-dark-tertiary"
                    >
                      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                        {/* Origin Story */}
                        <div className="bg-white/[0.03] border border-dark-border rounded-lg p-3 sm:p-4">
                          <h5 className="text-base font-semibold mb-2 text-text-primary flex items-center space-x-2">
                            <span>📖</span>
                            <span>Cultural Story</span>
                          </h5>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {drink.origin_story}
                          </p>
                        </div>

                        {/* Ingredients */}
                        <div className="bg-white/[0.03] border border-dark-border rounded-lg p-3 sm:p-4">
                          <h5 className="text-base font-semibold mb-2 text-text-primary flex items-center space-x-2">
                            <span>🥄</span>
                            <span>Ingredients</span>
                          </h5>
                          <div className="space-y-2">
                            {drink.ingredients.map((ingredient, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="text-text-primary font-medium">{ingredient.item}</span>
                                <div className="flex items-center space-x-3 text-text-secondary">
                                  <span>{ingredient.quantity}</span>
                                  <span className="text-text-tertiary">({ingredient.quantity_imperial})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Serving Details */}
                        <div className="bg-white/[0.03] border border-dark-border rounded-lg p-3 sm:p-4">
                          <h5 className="text-base font-semibold mb-2 text-text-primary flex items-center space-x-2">
                            <span>🍷</span>
                            <span>Serving</span>
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-text-secondary font-medium">Glassware:</span>
                              <p className="text-text-secondary mt-1">{drink.glassware}</p>
                            </div>
                            <div>
                              <span className="text-text-secondary font-medium">Garnish:</span>
                              <p className="text-text-secondary mt-1">{drink.garnish}</p>
                            </div>
                          </div>
                        </div>

                        {/* Substitution Suggestions */}
                        <div className="bg-white/[0.03] border border-dark-border rounded-lg p-3 sm:p-4">
                          <h5 className="text-base font-semibold mb-2 text-text-primary flex items-center space-x-2">
                            <span>💡</span>
                            <span>Substitution Tips</span>
                          </h5>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {drink.type === 'cocktail' && drink.ingredients.some(i => i.category === 'liqueur') && 
                              "If you can't find specialty liqueurs, try using similar flavored spirits or syrups. For example, replace Aperol with Campari or a bitter orange liqueur."}
                            {drink.type === 'traditional_drink' && 
                              "Traditional ingredients can often be substituted with more accessible alternatives. Look for similar flavors in your local grocery store."}
                            {drink.type === 'non_alcoholic' && 
                              "Non-alcoholic versions can be enhanced with fresh herbs, spices, or fruit juices for added complexity."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>


              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}

export default DrinkSection;
