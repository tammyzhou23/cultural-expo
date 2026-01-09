import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { getAllCountries, getRegionStats } from '../utils/countrySelector';
import { getAllExperiences } from '../utils/experienceManager';
import VirtualizedCountryList from './VirtualizedCountryList';
import { LazySection, SkeletonCard } from './LazyLoading';
import { Spinner } from './LoadingStates';

function CountrySelector({ onCountrySelect, countries = null, onRandomSelect }) {
  const [allCountries, setAllCountries] = useState([]);
  const [regionStats, setRegionStats] = useState({});
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [exploredCountries, setExploredCountries] = useState(new Set());

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const countriesData = countries || getAllCountries();
        const regions = getRegionStats();
        const experiences = getAllExperiences();
        
        // Additional safety checks
        if (!countriesData || !Array.isArray(countriesData)) {
          console.warn('CountrySelector: Invalid countries data', countriesData);
          setAllCountries([]);
        } else {
          setAllCountries(countriesData);
        }
        
        if (!regions || typeof regions !== 'object') {
          console.warn('CountrySelector: Invalid regions data', regions);
          setRegionStats({});
        } else {
          setRegionStats(regions);
        }
        
        if (!experiences || !Array.isArray(experiences)) {
          console.warn('CountrySelector: Invalid experiences data', experiences);
          setExploredCountries(new Set());
        } else {
          const exploredSet = new Set(experiences.map(exp => exp.country?.name).filter(Boolean));
          setExploredCountries(exploredSet);
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

  const getRegionColor = (region) => {
    const colors = {
      'East Asia': 'bg-red-500',
      'Southern Europe': 'bg-blue-500',
      'North America': 'bg-green-500',
      'South Asia': 'bg-yellow-500',
      'Western Europe': 'bg-purple-500',
      'Southeast Asia': 'bg-orange-500',
      'North Africa': 'bg-indigo-500',
      'East Africa': 'bg-pink-500',
      'South America': 'bg-teal-500',
      'Central Asia': 'bg-cyan-500',
      'Caribbean': 'bg-lime-500'
    };
    return colors[region] || 'bg-accent-primary';
  };

  // Memoized filtered countries for performance
  const filteredCountries = useMemo(() => {
    try {
      if (!allCountries || !Array.isArray(allCountries)) {
        return [];
      }
      
      let countries = allCountries;
      
      // Filter by region
      if (selectedRegion !== 'All') {
        countries = countries.filter(country => country.region === selectedRegion);
      }
      
      return countries;
    } catch (error) {
      console.error('Error filtering countries:', error);
      return [];
    }
  }, [allCountries, selectedRegion]);

  const regions = useMemo(() => {
    try {
      if (!regionStats || typeof regionStats !== 'object' || Object.keys(regionStats).length === 0) {
        return ['All'];
      }
      return ['All', ...Object.keys(regionStats).sort()];
    } catch (error) {
      console.error('Error creating regions list:', error);
      return ['All'];
    }
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
          <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent" role="tablist">
            {regions.map((region) => (
              <motion.button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  selectedRegion === region
                    ? 'bg-accent-secondary/20 text-accent-secondary shadow-sm'
                    : 'bg-dark-tertiary/20 text-text-tertiary hover:bg-dark-tertiary/30 hover:text-text-secondary'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                role="tab"
                aria-selected={selectedRegion === region}
                aria-label={`Filter by ${region} region`}
              >
                {region} {region !== 'All' && `(${(regionStats && regionStats[region]) || 0})`}
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
            className="btn btn-accent-primary inline-flex items-center"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Randomly select a country"
          >
            <SparklesIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            <span>Random Country</span>
          </motion.button>
        </motion.div>
      </LazySection>

      {/* Virtualized Countries List */}
      <LazySection delay={0.3}>
        {filteredCountries && Array.isArray(filteredCountries) && filteredCountries.length > 0 ? (
          <VirtualizedCountryList
            countries={filteredCountries}
            onCountrySelect={onCountrySelect}
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