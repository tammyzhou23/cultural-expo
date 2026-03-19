import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import CulturalCalendar from '../components/CulturalCalendar';
import ProgressDashboard from '../components/ProgressDashboard';

function JournalPage({
  onDateSelect,
  onAddExperience,
  onEditExperience,
  dataRefreshKey,
  journeyProgress
}) {
  const navigate = useNavigate();
  const hasExperiences = journeyProgress.uniqueCountries > 0;

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
      className="flex flex-col lg:flex-row gap-12"
    >
      {/* Main Calendar Section */}
      <div className="flex-1">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 tracking-tight">
            Your Cultural Journey
          </h2>
          <p className="text-lg text-text-secondary mb-6 leading-relaxed max-w-2xl mx-auto">
            Track your cultural experiences and discover new traditions through our interactive calendar
          </p>
        </motion.div>

        {!hasExperiences ? (
          /* Empty state */
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.div
              className="text-7xl mb-6"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🌍
            </motion.div>
            <h3 className="text-2xl font-bold text-text-primary mb-3">
              Every great journey starts somewhere
            </h3>
            <p className="text-text-secondary max-w-sm mb-8 leading-relaxed">
              Pick a country, explore its food, drinks, and cinema — then come back here to see your journey unfold.
            </p>
            <motion.button
              onClick={() => navigate('/')}
              className="btn btn-accent-primary inline-flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <GlobeAltIcon className="w-5 h-5" aria-hidden="true" />
              Discover a Country
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            key={dataRefreshKey}
          >
            <CulturalCalendar
              onDateSelect={onDateSelect}
              onAddExperience={onAddExperience}
              onEditExperience={onEditExperience}
            />
          </motion.div>
        )}
      </div>

      {/* Progress Sidebar */}
      <div className="lg:w-80">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          key={dataRefreshKey}
        >
          <ProgressDashboard
            progress={journeyProgress}
            onExploreClick={() => navigate('/')}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default JournalPage;
