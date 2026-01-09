import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import foodDatabase from '../data/authenticFoodDatabase.json';

const FoodSection = ({ selectedCountry }) => {
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  // Get dishes for selected country
  const countryDishes = useMemo(() => {
    if (!selectedCountry) return [];
    return foodDatabase.dishes[selectedCountry.id] || [];
  }, [selectedCountry]);

  const handleCardClick = (dishId) => {
    setExpandedRecipe(expandedRecipe === dishId ? null : dishId);
  };

  if (!selectedCountry) {
    return (
      <div className="flex items-center justify-center min-h-48 py-12">
        <div className="text-center">
          <div className="text-4xl mb-3">🍴</div>
          <h3 className="text-lg font-medium text-text-secondary mb-2">Select a Country</h3>
          <p className="text-sm text-text-tertiary">Choose a country to explore its traditional cuisine</p>
        </div>
      </div>
    );
  }

  if (countryDishes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🍽️</div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No Dishes Found</h3>
        <p className="text-sm text-text-secondary">
          No dish information available for this country.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-accent-primary mb-2">
          Traditional Cuisine
        </h3>
        <p className="text-sm text-text-secondary">
          Discover authentic dishes from {selectedCountry.name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {countryDishes.map((dish, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className="relative"
          >
            <motion.div
              className={`card overflow-hidden cursor-pointer ${
                expandedRecipe === index
                  ? 'border-accent-primary'
                  : ''
              }`}
              whileHover={{ scale: 1.01 }}
              onClick={() => handleCardClick(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={expandedRecipe === index}
              aria-label={`${dish.name} - Click to ${expandedRecipe === index ? 'collapse' : 'expand'} details`}
            >
              {/* Card Header */}
              <div className="p-4 sm:p-6 text-center">
                <div className="text-3xl sm:text-4xl mb-3">🍽️</div>
                <h4 className="text-lg sm:text-xl font-semibold text-accent-primary mb-2">
                  {dish.name}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {dish.description}
                </p>
              </div>

              {/* Expandable Content */}
              <AnimatePresence>
                {expandedRecipe === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-dark-border bg-dark-tertiary"
                  >
                    <div className="p-4 sm:p-6 space-y-3">
                      {/* Cultural Story */}
                      <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-lg p-3 sm:p-4">
                        <h5 className="text-base font-semibold text-accent-primary mb-2 flex items-center">
                          <span className="mr-2">📖</span>
                          Cultural Story
                        </h5>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {dish.cultural_story || `${dish.name} is a beloved traditional dish that represents the authentic flavors and cooking techniques of ${selectedCountry.name}. This dish showcases the local ingredients and culinary heritage that locals cherish and visitors should experience.`}
                        </p>
                      </div>

                      {/* Dish Information */}
                      <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-lg p-3 sm:p-4">
                        <h5 className="text-base font-semibold text-accent-primary mb-2 flex items-center">
                          <span className="mr-2">🍽️</span>
                          Dish Information
                        </h5>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-accent-primary font-medium">Origin:</span>
                            <p className="text-text-secondary">Traditional {selectedCountry.name}</p>
                          </div>
                          <div>
                            <span className="text-accent-primary font-medium">Serving:</span>
                            <p className="text-text-secondary">Family style</p>
                          </div>
                        </div>
                      </div>

                      {/* Cooking Tips */}
                      <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-lg p-3 sm:p-4">
                        <h5 className="text-base font-semibold text-accent-primary mb-2 flex items-center">
                          <span className="mr-2">👨‍🍳</span>
                          Cooking Tips
                        </h5>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {dish.cooking_tips || `To prepare authentic ${dish.name}, focus on using fresh, local ingredients and traditional cooking methods. The key to this dish lies in the balance of flavors and the careful attention to cooking time and temperature.`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>


            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FoodSection;