import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, GlobeAltIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useToast } from '../components/ToastProvider';
import CountrySelector from '../components/CountrySelector';
import MapView from '../components/MapView';
import { getAllCountries, selectRandomCountry } from '../utils/countrySelector';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning, explorer';
  if (hour < 17) return 'Good afternoon, explorer';
  return 'Good evening, explorer';
};

function DiscoverPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  useEffect(() => {
    const countries = getAllCountries();
    setFilteredCountries(countries);
  }, []);

  useEffect(() => {
    const countries = getAllCountries();
    if (searchQuery.trim()) {
      const filtered = countries.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
      setSearchSuggestions(
        filtered.slice(0, 5).map(c => ({ name: c.name, region: c.region, flag: c.flag }))
      );
      setShowSearchSuggestions(true);
    } else {
      setFilteredCountries(countries);
      setShowSearchSuggestions(false);
    }
  }, [searchQuery]);

  const handleCountrySelect = (country) => {
    navigate(`/country/${country.id}`);
    toast.success(`Welcome to ${country.name}! 🌍`);
  };

  const handleRandomizer = () => {
    const randomCountry = selectRandomCountry();
    if (randomCountry) {
      navigate(`/country/${randomCountry.id}`);
      toast.success(`🎲 Randomly selected ${randomCountry.name}!`);
    } else {
      toast.error('No countries available for random selection');
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    const country = getAllCountries().find(c => c.name === suggestion.name);
    if (country) {
      setSearchQuery('');
      setShowSearchSuggestions(false);
      navigate(`/country/${country.id}`);
      toast.success(`Welcome to ${country.name}! 🌍`);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ type: 'tween', ease: 'anticipate', duration: 0.4 }}
    >
      {/* Hero Section */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <p className="text-text-secondary text-sm mb-2">{getGreeting()}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3 tracking-tight">
          Discover the World's Cultures
        </h2>
        <p className="text-text-secondary text-base">
          80 countries · food · drinks · cinema
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        className="bg-dark-secondary rounded-xl p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                className="input pl-10 w-full focus-ring-inset"
                aria-label="Search countries by name or region"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
                <MagnifyingGlassIcon className="w-5 h-5 text-text-tertiary" />
              </div>
            </div>

            {/* Search Suggestions */}
            <AnimatePresence>
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-dark-tertiary rounded-lg shadow-lg z-50 overflow-hidden"
                >
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.name}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-dark-quaternary transition-colors flex items-center space-x-3"
                    >
                      <span className="text-lg">{suggestion.flag}</span>
                      <div>
                        <div className="text-text-primary font-medium">{suggestion.name}</div>
                        <div className="text-text-secondary text-sm">{suggestion.region}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-dark-tertiary rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-accent-primary text-white shadow-lg'
                  : 'text-text-secondary hover:text-text-primary hover:bg-dark-quaternary'
              }`}
              aria-label="List view"
              title="List View"
            >
              <ListBulletIcon className={`w-5 h-5 ${viewMode === 'list' ? 'text-white' : 'text-text-secondary'}`} />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'map'
                  ? 'bg-accent-primary text-white shadow-lg'
                  : 'text-text-secondary hover:text-text-primary hover:bg-dark-quaternary'
              }`}
              aria-label="Map view"
              title="Map View"
            >
              <GlobeAltIcon className={`w-5 h-5 ${viewMode === 'map' ? 'text-white' : 'text-text-secondary'}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {viewMode === 'map' ? (
          <MapView
            countries={filteredCountries}
            onCountrySelect={handleCountrySelect}
            onClose={() => setViewMode('list')}
          />
        ) : filteredCountries && filteredCountries.length > 0 ? (
          <CountrySelector
            onCountrySelect={handleCountrySelect}
            countries={filteredCountries}
            onRandomSelect={handleRandomizer}
          />
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-text-secondary">
              <div className="text-4xl mb-4">⏳</div>
              <h3 className="text-lg font-semibold mb-2">Loading countries...</h3>
              <p className="text-sm">Please wait while we prepare your cultural exploration.</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default DiscoverPage;
