import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const CountryCard = React.memo(({ country, onCountrySelect, index }) => {
  if (!country || !country.name) {
    return null;
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.01 }}
    >
      <motion.button
        onClick={() => onCountrySelect(country)}
        className="card w-full p-3 sm:p-4 group h-full"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Explore ${country.name}`}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
            <div className="text-2xl sm:text-3xl">{country.flag}</div>
            <div className="text-left flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors truncate">
                {country.name}
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary truncate">{country.region}</p>
            </div>
          </div>
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0" aria-hidden="true" />
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
});

CountryCard.displayName = 'CountryCard';

const VirtualizedCountryList = ({ countries = [], onCountrySelect }) => {
  // Safety check for countries array
  if (!countries || !Array.isArray(countries) || countries.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center text-text-secondary">
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-lg font-semibold mb-2">No countries available</h3>
          <p className="text-sm">Try adjusting your filters or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 p-2 sm:p-4">
        {countries.map((country, index) => (
          <CountryCard
            key={country.id || country.name || index}
            country={country}
            onCountrySelect={onCountrySelect}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default VirtualizedCountryList;
