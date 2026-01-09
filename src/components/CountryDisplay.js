import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GlobeAltIcon, 
  MapPinIcon, 
  UsersIcon, 
  ChatBubbleLeftRightIcon, 
  CurrencyDollarIcon, 
  UserIcon, 
  FilmIcon, 
  MusicalNoteIcon, 
  SwatchIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

function CountryDisplay({ country, onMarkAsExplored, onAddExperience }) {
  const [isMarkingExplored, setIsMarkingExplored] = useState(false);

  const handleMarkAsExplored = async () => {
    setIsMarkingExplored(true);
    try {
      if (onMarkAsExplored) {
        await onMarkAsExplored(country);
      }
    } finally {
      setIsMarkingExplored(false);
    }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Simplified Hero Section */}
      <section className="text-center space-y-4" aria-labelledby="country-hero">
        <motion.div 
          className="text-5xl sm:text-6xl mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          role="img"
          aria-label={`Flag of ${country.name}`}
        >
          {country.flag}
        </motion.div>
        
        <div className="space-y-2">
          <h1 
            id="country-hero"
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-text-primary leading-tight"
          >
            {country.name}
          </h1>
          
          <div className="inline-flex items-center px-3 py-1.5 bg-dark-secondary border border-dark-border rounded-full">
            <GlobeAltIcon className="w-4 h-4 text-accent-primary mr-2" aria-hidden="true" />
            <span className="text-sm text-text-secondary">{country.region}</span>
          </div>
          
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto leading-relaxed px-4">
            {country.description}
          </p>

          {/* Action Buttons - Simplified */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <motion.button
              onClick={handleMarkAsExplored}
              disabled={isMarkingExplored}
              className="btn btn-primary w-full sm:w-auto"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Mark country as explored"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              {isMarkingExplored ? 'Marking...' : 'Mark as Explored'}
            </motion.button>
            
            <motion.button
              onClick={() => onAddExperience && onAddExperience(country)}
              className="btn btn-accent-primary w-full sm:w-auto"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Add cultural experience"
            >
              <PlusIcon className="w-4 h-4 mr-2" aria-hidden="true" />
              Add Experience
            </motion.button>
          </div>
        </div>
      </section>
      
      {/* Simplified Information Grid */}
      <section className="space-y-4" aria-labelledby="country-info">
        <h2 id="country-info" className="sr-only">Country Information</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Capital City */}
          <motion.div 
            className="group card p-3 sm:p-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="capital-heading"
          >
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-2">
                <MapPinIcon className="w-4 h-4 text-accent-primary" aria-hidden="true" />
              </div>
              <h3 id="capital-heading" className="text-xs sm:text-sm font-medium text-text-secondary">Capital</h3>
            </div>
            <p className="text-base sm:text-lg font-semibold text-accent-primary">{country.capital}</p>
          </motion.div>
          
          {/* Population */}
          <motion.div 
            className="group card p-3 sm:p-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="population-heading"
          >
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 bg-accent-secondary/10 rounded-lg flex items-center justify-center mr-2">
                <UsersIcon className="w-4 h-4 text-accent-secondary" aria-hidden="true" />
              </div>
              <h3 id="population-heading" className="text-xs sm:text-sm font-medium text-text-secondary">Population</h3>
            </div>
            <p className="text-base sm:text-lg font-semibold text-accent-secondary">{country.population}</p>
          </motion.div>
          
          {/* Language */}
          <motion.div 
            className="group card p-3 sm:p-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="language-heading"
          >
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 bg-accent-tertiary/10 rounded-lg flex items-center justify-center mr-2">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-accent-tertiary" aria-hidden="true" />
              </div>
              <h3 id="language-heading" className="text-xs sm:text-sm font-medium text-text-secondary">Language</h3>
            </div>
            <p className="text-base sm:text-lg font-semibold text-accent-tertiary">{country.language}</p>
          </motion.div>
          
          {/* Currency */}
          <motion.div 
            className="group card p-3 sm:p-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="currency-heading"
          >
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-2">
                <CurrencyDollarIcon className="w-4 h-4 text-accent-primary" aria-hidden="true" />
              </div>
              <h3 id="currency-heading" className="text-xs sm:text-sm font-medium text-text-secondary">Currency</h3>
            </div>
            <p className="text-base sm:text-lg font-semibold text-accent-primary">{country.currency}</p>
          </motion.div>
          
          {/* Geographic Region */}
          <motion.div 
            className="group card p-3 sm:p-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="region-heading"
          >
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 bg-accent-secondary/10 rounded-lg flex items-center justify-center mr-2">
                <UserIcon className="w-4 h-4 text-accent-secondary" aria-hidden="true" />
              </div>
              <h3 id="region-heading" className="text-xs sm:text-sm font-medium text-text-secondary">Region</h3>
            </div>
            <p className="text-base sm:text-lg font-semibold text-accent-secondary">{country.region}</p>
          </motion.div>
        </div>
      </section>
      
      {/* Simplified Call to Action */}
      <section className="text-center space-y-3" aria-labelledby="explore-cta">
        <h2 id="explore-cta" className="sr-only">Explore Culture</h2>
        
        <p className="text-text-secondary text-sm max-w-xl mx-auto">
          Scroll down to discover traditional foods, beverages, and films from {country.name}
        </p>
      </section>
    </motion.div>
  );
}

export default CountryDisplay;