import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  BookOpenIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ToastProvider, { useToast } from './components/ToastProvider';
import AuthStatus from './components/AuthStatus';
import AddExperienceModal from './components/AddExperienceModal';
import CulturalIcon from './components/CulturalIcon';
import { getAllExperiences, saveExperience } from './utils/experienceManager';
import { selectRandomCountry, getAllCountries } from './utils/countrySelector';
import DiscoverPage from './pages/DiscoverPage';
import JournalPage from './pages/JournalPage';
import CountryDetailPage from './pages/CountryDetailPage';

// Subtle ambient glow colour per region — used for background radial gradient
// Subtle ambient glow per region — 4 muted groups matching region pill colors
const AMBIENT_COLORS = {
  'East Asia':           'rgba(148, 163, 184, 0.08)',  // slate
  'Southern Europe':     'rgba(148, 163, 184, 0.08)',  // slate
  'Western Asia/Europe': 'rgba(148, 163, 184, 0.08)',  // slate
  'Europe/Asia':         'rgba(148, 163, 184, 0.08)',  // slate
  'North America':       'rgba(99,  102, 241, 0.08)',  // indigo
  'Western Europe':      'rgba(99,  102, 241, 0.08)',  // indigo
  'Central Asia':        'rgba(99,  102, 241, 0.08)',  // indigo
  'Northern Europe':     'rgba(99,  102, 241, 0.08)',  // indigo
  'Central Europe':      'rgba(99,  102, 241, 0.08)',  // indigo
  'Eastern Europe':      'rgba(99,  102, 241, 0.08)',  // indigo
  'South Asia':          'rgba(245, 158, 11,  0.08)',  // amber
  'Southeast Asia':      'rgba(245, 158, 11,  0.08)',  // amber
  'North Africa':        'rgba(245, 158, 11,  0.08)',  // amber
  'Western Asia':        'rgba(245, 158, 11,  0.08)',  // amber
  'Oceania':             'rgba(245, 158, 11,  0.08)',  // amber
  'East Africa':         'rgba(20,  184, 166, 0.08)',  // teal
  'South America':       'rgba(20,  184, 166, 0.08)',  // teal
  'Caribbean':           'rgba(20,  184, 166, 0.08)',  // teal
  'West Africa':         'rgba(20,  184, 166, 0.08)',  // teal
  'Central Africa':      'rgba(20,  184, 166, 0.08)',  // teal
  'Southern Africa':     'rgba(20,  184, 166, 0.08)',  // teal
  'Central America':     'rgba(20,  184, 166, 0.08)',  // teal
};

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [initialDate, setInitialDate] = useState(null);
  const [announcements, setAnnouncements] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const [isRandomizing, setIsRandomizing] = useState(false);

  // Active nav detection
  const isDiscover = location.pathname === '/';
  const isJournal = location.pathname === '/journal';

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            navigate('/');
            announce('Navigated to Discover page');
            break;
          case '2':
            e.preventDefault();
            navigate('/journal');
            announce('Navigated to Journal page');
            break;
          case 'e':
            e.preventDefault();
            handleAddExperience();
            break;
          case 'l':
            e.preventDefault();
            handleRandomizer();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []); // eslint-disable-line

  // Listen for experience / user changes
  useEffect(() => {
    const refresh = () => setDataRefreshKey(prev => prev + 1);
    window.addEventListener('experienceChanged', refresh);
    window.addEventListener('userChanged', refresh);
    return () => {
      window.removeEventListener('experienceChanged', refresh);
      window.removeEventListener('userChanged', refresh);
    };
  }, []);

  const announce = (message) => {
    setAnnouncements(message);
    setTimeout(() => setAnnouncements(''), 1000);
  };

  const handleAddExperience = (date = null) => {
    setInitialDate(date);
    setShowAddExperienceModal(true);
    announce('Opening add experience modal');
  };

  const handleRandomizer = () => {
    setIsRandomizing(true);
    setTimeout(() => setIsRandomizing(false), 600);
    const randomCountry = selectRandomCountry();
    if (randomCountry) {
      navigate(`/country/${randomCountry.id}`);
      toast.success(`🎲 Randomly selected ${randomCountry.name}!`);
      announce(`Randomly selected ${randomCountry.name}`);
    } else {
      toast.error('No countries available for random selection');
    }
  };

  const handleMarkAsExplored = async (country) => {
    try {
      const experience = {
        date: new Date().toISOString().split('T')[0],
        country,
        dishes: [],
        drinks: [],
        movies: [],
        notes: ''
      };
      const experienceId = saveExperience(experience);
      if (experienceId) {
        toast.success(`🎉 ${country.name} has been added to your cultural journey!`);
        announce(`${country.name} has been added to your cultural journey.`);
        setEditingExperienceId(experienceId);
        setInitialDate(new Date().toISOString().split('T')[0]);
        setShowAddExperienceModal(true);
      }
    } catch (error) {
      console.error('Error marking country as explored:', error);
      toast.error('Failed to mark country as explored');
    }
  };

  const handleExperienceAdded = (experience) => {
    toast.success(`🎉 Experience added for ${experience.country.name}!`);
    announce(`Experience added for ${experience.country.name}`);
  };

  const handleEditExperience = (experienceId) => {
    setEditingExperienceId(experienceId);
    setInitialDate(null);
    setShowAddExperienceModal(true);
    announce('Opening experience editor');
  };

  const handleDateSelect = (dateString, experiences) => {
    if (experiences.length > 0) {
      handleEditExperience(experiences[0].id);
    } else {
      handleAddExperience(dateString);
    }
  };

  // Journey progress (recalculated on dataRefreshKey change)
  const experiences = getAllExperiences() || [];
  const uniqueCountries = new Set(experiences.map(exp => exp.country?.id)).size;
  const totalCountries = 50;
  const journeyProgress = {
    uniqueCountries,
    totalCountries,
    progressPercentage: Math.round((uniqueCountries / totalCountries) * 100)
  };

  // Derive ambient glow from active country page
  const countryRouteMatch = location.pathname.match(/^\/country\/(.+)$/);
  const activeCountryId = countryRouteMatch ? countryRouteMatch[1] : null;
  const activeCountry = activeCountryId
    ? getAllCountries().find(c => c.id === activeCountryId)
    : null;
  const ambientColor = activeCountry
    ? AMBIENT_COLORS[activeCountry.region] || 'rgba(99, 102, 241, 0.08)'
    : null;
  const ambientGradient = ambientColor
    ? `radial-gradient(ellipse 55% 45% at 82% 12%, ${ambientColor}, transparent 68%)`
    : 'none';

  const navButtonClass = (active) =>
    `btn flex-shrink-0 relative ${
      active
        ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/30 border-2 border-accent-primary'
        : 'btn-ghost hover:bg-dark-tertiary text-text-secondary border-2 border-transparent'
    }`;

  return (
    <div className="min-h-screen bg-dark-primary text-text-primary relative">
      {/* Ambient background glow — fades in/out per country region */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        animate={{ opacity: ambientColor ? 1 : 0, background: ambientGradient }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      {/* Skip to content */}
      <a href="#main-content" className="skip-link focus:top-4" aria-label="Skip to main content">
        Skip to main content
      </a>

      {/* Accessibility live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" role="status">
        {announcements}
      </div>

      {/* Global Navigation Header */}
      <motion.header
        className="bg-dark-secondary border-b border-dark-border backdrop-blur-sm sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        role="banner"
      >
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink min-w-0"
              style={{ maxWidth: 'calc(100% - 300px)' }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate('/')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/'); }
              }}
              aria-label="Return to homepage"
              title="Click to return to homepage"
            >
              <div className="relative flex-shrink-0">
                <motion.div
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-accent-primary rounded-lg flex items-center justify-center shadow-glow"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <CulturalIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
                </motion.div>
              </div>
              <div className="hidden sm:block min-w-0 overflow-hidden">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-text-primary tracking-tight truncate">
                  Cultural Expo
                </h1>
                <p className="text-text-secondary text-xs hidden lg:block truncate">
                  Food, drinks & cinema from 80 countries
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center gap-1 lg:gap-2 flex-shrink-0"
              role="navigation"
              aria-label="Primary navigation"
            >
              {/* Discover */}
              <motion.button
                onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                className={navButtonClass(isDiscover)}
                style={isDiscover ? { boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 4px 6px rgba(99,102,241,0.3)' } : {}}
                whileHover={{ scale: isDiscover ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Go to Discover page"
                title="Discover (⌘1)"
                aria-current={isDiscover ? 'page' : undefined}
              >
                <GlobeAltIcon className={`w-4 h-4 flex-shrink-0 ${isDiscover ? 'text-white' : 'text-text-secondary'}`} aria-hidden="true" />
                <span className={`ml-1.5 lg:ml-2 text-xs lg:text-sm whitespace-nowrap font-semibold ${isDiscover ? 'text-white' : 'text-text-secondary'}`}>
                  Discover
                </span>
                {isDiscover && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                    layoutId="activeUnderline"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>

              {/* Journal */}
              <motion.button
                onClick={() => { navigate('/journal'); setMobileMenuOpen(false); }}
                className={navButtonClass(isJournal)}
                style={isJournal ? { boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2), 0 4px 6px rgba(99,102,241,0.3)' } : {}}
                whileHover={{ scale: isJournal ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Go to Journal page"
                title="Journal (⌘2)"
                aria-current={isJournal ? 'page' : undefined}
              >
                <BookOpenIcon className={`w-4 h-4 flex-shrink-0 ${isJournal ? 'text-white' : 'text-text-secondary'}`} aria-hidden="true" />
                <span className={`ml-1.5 lg:ml-2 text-xs lg:text-sm whitespace-nowrap font-semibold ${isJournal ? 'text-white' : 'text-text-secondary'}`}>
                  Journal
                </span>
                {isJournal && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
                    layoutId="activeUnderline"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>

              {/* Add Experience */}
              <motion.button
                onClick={() => { handleAddExperience(); setMobileMenuOpen(false); }}
                className="btn btn-ghost flex-shrink-0 hover:bg-dark-tertiary p-2 lg:px-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Add new cultural experience"
                title="Add Experience (⌘E)"
              >
                <PlusIcon className="w-4 h-4 flex-shrink-0 text-text-secondary" aria-hidden="true" />
                <span className="ml-1.5 lg:ml-2 text-xs lg:text-sm whitespace-nowrap hidden xl:inline text-text-secondary">Add</span>
              </motion.button>

              {/* Randomizer */}
              <motion.button
                onClick={() => { handleRandomizer(); setMobileMenuOpen(false); }}
                className="btn btn-ghost flex-shrink-0 hover:bg-dark-tertiary p-2 lg:px-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Random country selector"
                title="Random Country (⌘L)"
              >
                <motion.span
                  animate={isRandomizing ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="inline-flex"
                >
                  <ArrowPathIcon className="w-4 h-4 flex-shrink-0 text-text-secondary" aria-hidden="true" />
                </motion.span>
                <span className="ml-1.5 lg:ml-2 text-xs lg:text-sm whitespace-nowrap hidden xl:inline text-text-secondary">Randomize</span>
              </motion.button>

              {/* Auth */}
              <div className="ml-1 lg:ml-2 pl-1 lg:pl-2 border-l border-dark-border flex-shrink-0">
                <AuthStatus />
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn btn-ghost p-2 flex-shrink-0 min-w-[44px]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                id="mobile-menu"
                className="md:hidden mt-3 pt-3 border-t border-dark-border px-3 sm:px-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                role="navigation"
                aria-label="Mobile navigation"
              >
                <div className="flex flex-col gap-2 pb-2">
                  <button
                    onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                    className={`btn w-full justify-start relative ${
                      isDiscover
                        ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/30 border-l-4 border-white'
                        : 'btn-ghost hover:bg-dark-tertiary text-text-secondary border-l-4 border-transparent'
                    }`}
                    aria-label="Go to Discover page"
                    aria-current={isDiscover ? 'page' : undefined}
                  >
                    <GlobeAltIcon className={`w-5 h-5 mr-3 flex-shrink-0 ${isDiscover ? 'text-white' : 'text-text-secondary'}`} aria-hidden="true" />
                    <span className={`text-sm font-semibold ${isDiscover ? 'text-white' : 'text-text-secondary'}`}>Discover</span>
                  </button>

                  <button
                    onClick={() => { navigate('/journal'); setMobileMenuOpen(false); }}
                    className={`btn w-full justify-start relative ${
                      isJournal
                        ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/30 border-l-4 border-white'
                        : 'btn-ghost hover:bg-dark-tertiary text-text-secondary border-l-4 border-transparent'
                    }`}
                    aria-label="Go to Journal page"
                    aria-current={isJournal ? 'page' : undefined}
                  >
                    <BookOpenIcon className={`w-5 h-5 mr-3 flex-shrink-0 ${isJournal ? 'text-white' : 'text-text-secondary'}`} aria-hidden="true" />
                    <span className={`text-sm font-semibold ${isJournal ? 'text-white' : 'text-text-secondary'}`}>Journal</span>
                  </button>

                  <button
                    onClick={() => { handleAddExperience(); setMobileMenuOpen(false); }}
                    className="btn w-full justify-start btn-ghost"
                    aria-label="Add new cultural experience"
                  >
                    <PlusIcon className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm">Add Experience</span>
                  </button>

                  <button
                    onClick={() => { handleRandomizer(); setMobileMenuOpen(false); }}
                    className="btn w-full justify-start btn-ghost"
                    aria-label="Random country selector"
                  >
                    <ArrowPathIcon className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm">Randomize</span>
                  </button>

                  <div className="pt-2 mt-2 border-t border-dark-border">
                    <AuthStatus />
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Content */}
      <main
        className="container mx-auto px-4 sm:px-6 py-6 sm:py-12"
        id="main-content"
        aria-label="Cultural exploration content"
      >
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/journal" element={
              <JournalPage
                key={dataRefreshKey}
                onDateSelect={handleDateSelect}
                onAddExperience={handleAddExperience}
                onEditExperience={handleEditExperience}
                dataRefreshKey={dataRefreshKey}
                journeyProgress={journeyProgress}
              />
            } />
            <Route path="/country/:countryId" element={
              <CountryDetailPage
                onMarkAsExplored={handleMarkAsExplored}
                onAddExperience={handleAddExperience}
              />
            } />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Add Experience Modal */}
      <AddExperienceModal
        isOpen={showAddExperienceModal}
        onClose={() => {
          setShowAddExperienceModal(false);
          setEditingExperienceId(null);
        }}
        selectedDate={initialDate}
        onExperienceAdded={handleExperienceAdded}
        editingExperienceId={editingExperienceId}
      />
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
