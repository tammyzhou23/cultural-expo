import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { getAllCountries, getRegionStats } from '../utils/countrySelector';
import { getAllExperiences } from '../utils/experienceManager';
import VirtualizedCountryList from './VirtualizedCountryList';
import { LazySection } from './LazyLoading';
import { Spinner } from './LoadingStates';

function CountrySelector({ onCountrySelect, countries = null, onRandomSelect }) {
  const [allCountries, setAllCountries] = useState([]);
  const [regionStats, setRegionStats] = useState({});
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [exploredCountries, setExploredCountries] = useState(new Set());

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        const countriesData = countries || getAllCountries();
        const regions = getRegionStats();
        const experiences = getAllExperiences();
        
        // Additional safety checks
        setAllCountries(Array.isArray(countriesData) ? countriesData : []);
        setRegionStats(regions && typeof regions === 'object' ? regions : {});

        if (Array.isArray(experiences)) {
          const exploredSet = new Set(experiences.map(exp => exp.country?.name).filter(Boolean));
          setExploredCountries(exploredSet);
        } else {
          setExploredCountries(new Set());
        }
      } catch (error) {
        console.error('Error loading CountrySelector data:', error);
        setAllCountries([]);
        setRegionStats({});
        setExploredCountries(new Set());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [countries]);

  // Memoized filtered countries for performance
  const filteredCountries = useMemo(() => {
    if (!Array.isArray(allCountries)) return [];
    if (selectedRegion === 'All') return allCountries;
    return allCountries.filter(country => country.region === selectedRegion);
  }, [allCountries, selectedRegion]);

  const regions = useMemo(() => {
    if (!regionStats || typeof regionStats !== 'object' || Object.keys(regionStats).length === 0) {
      return ['All'];
    }
    return ['All', ...Object.keys(regionStats).sort()];
  }, [regionStats]);

  if (isLoading) {
    return (
      <div className="text-center max-w-6xl mx-auto py-16">
        <div className="mb-8">
          <Spinner size="xl" className="mb-4" />
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Loading Countries
          </h2>
          <p className="text-text-secondary">
            Preparing your cultural exploration...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center max-w-6xl mx-auto">
      {/* Region Filter - One Line Horizontal Scroll */}
      <LazySection delay={0.1}>
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h3 className="text-xs font-medium text-text-tertiary mb-2 text-center uppercase tracking-wide">
            Filter by Region
          </h3>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent" role="tablist">
            {regions.map((region) => (
              <motion.button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  selectedRegion === region
                    ? 'bg-accent-primary text-white shadow-glow'
                    : 'bg-dark-tertiary text-text-secondary hover:bg-dark-border hover:text-text-primary'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                role="tab"
                aria-selected={selectedRegion === region}
                aria-label={`Filter by ${region} region`}
              >
                {region}{region !== 'All' && regionStats && regionStats[region] ? (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                    selectedRegion === region ? 'bg-white/20' : 'bg-dark-border'
                  }`}>
                    {regionStats[region]}
                  </span>
                ) : null}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </LazySection>

      {/* Random CTA Button */}
      <LazySection delay={0.2}>
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.button
            onClick={onRandomSelect}
            className="btn btn-accent-primary inline-flex items-center group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Randomly select a country"
          >
            <SparklesIcon className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
            <span>Surprise Me</span>
          </motion.button>
        </motion.div>
      </LazySection>

      {/* Virtualized Countries List */}
      <LazySection delay={0.3}>
        {filteredCountries && Array.isArray(filteredCountries) && filteredCountries.length > 0 ? (
          <VirtualizedCountryList
            countries={filteredCountries}
            onCountrySelect={onCountrySelect}
            exploredCountries={exploredCountries}
          />
        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="empty-illustration">🔍</div>
            <h3 className="empty-title">No countries found</h3>
            <p className="empty-description">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </LazySection>
    </div>
  );
}

export default CountrySelector;