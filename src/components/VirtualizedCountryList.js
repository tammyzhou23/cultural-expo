import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const REGION_COLORS = {
  'East Asia':           'bg-slate-500/15 text-slate-400',
  'Southern Europe':     'bg-slate-500/15 text-slate-400',
  'Western Asia/Europe': 'bg-slate-500/15 text-slate-400',
  'Europe/Asia':         'bg-slate-500/15 text-slate-400',
  'North America':       'bg-indigo-500/15 text-indigo-400',
  'Western Europe':      'bg-indigo-500/15 text-indigo-400',
  'Central Asia':        'bg-indigo-500/15 text-indigo-400',
  'Northern Europe':     'bg-indigo-500/15 text-indigo-400',
  'Central Europe':      'bg-indigo-500/15 text-indigo-400',
  'Eastern Europe':      'bg-indigo-500/15 text-indigo-400',
  'South Asia':          'bg-amber-500/15 text-amber-400',
  'Southeast Asia':      'bg-amber-500/15 text-amber-400',
  'North Africa':        'bg-amber-500/15 text-amber-400',
  'Western Asia':        'bg-amber-500/15 text-amber-400',
  'Oceania':             'bg-amber-500/15 text-amber-400',
  'East Africa':         'bg-teal-500/15 text-teal-400',
  'South America':       'bg-teal-500/15 text-teal-400',
  'Caribbean':           'bg-teal-500/15 text-teal-400',
  'West Africa':         'bg-teal-500/15 text-teal-400',
  'Central Africa':      'bg-teal-500/15 text-teal-400',
  'Southern Africa':     'bg-teal-500/15 text-teal-400',
  'Central America':     'bg-teal-500/15 text-teal-400',
};

const CountryCard = React.memo(({ country, onCountrySelect, index, isExplored }) => {
  if (!country || !country.name) return null;

  const regionClass = REGION_COLORS[country.region] || 'bg-accent-primary/20 text-accent-primary';

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.01 }}
    >
      <motion.button
        onClick={() => onCountrySelect(country)}
        className="card w-full p-5 group h-full relative"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Explore ${country.name}`}
      >
        {/* Explored badge */}
        {isExplored && (
          <div className="absolute top-3 right-3">
            <CheckCircleIcon className="w-5 h-5 text-green-400" aria-label="Already explored" />
          </div>
        )}

        <div className="flex flex-col items-center text-center gap-3">
          {/* Flag */}
          <motion.div
            className="text-4xl sm:text-5xl leading-none"
            whileHover={{ scale: 1.15, rotate: [0, -3, 3, 0] }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {country.flag}
          </motion.div>

          {/* Name */}
          <h3 className="text-base sm:text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors leading-tight">
            {country.name}
          </h3>

          {/* Region pill */}
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${regionClass}`}>
            {country.region}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
});

CountryCard.displayName = 'CountryCard';

const VirtualizedCountryList = ({ countries = [], onCountrySelect, exploredCountries = new Set() }) => {
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 p-2 sm:p-4">
        {countries.map((country, index) => (
          <CountryCard
            key={country.id || country.name || index}
            country={country}
            onCountrySelect={onCountrySelect}
            index={index}
            isExplored={exploredCountries.has(country.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default VirtualizedCountryList;
