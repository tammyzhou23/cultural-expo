import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, GlobeAltIcon, TrophyIcon } from '@heroicons/react/24/outline';

function ProgressDashboard({ progress, onExploreClick }) {
  const { uniqueCountries, totalCountries, progressPercentage } = progress;

  return (
    <div className="card p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <motion.div
          className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-accent-primary rounded-lg mb-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <TrophyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </motion.div>
        <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-1">Journey Progress</h3>
        <p className="text-text-secondary text-xs sm:text-sm">Your cultural exploration journey</p>
      </div>

      {/* Progress Stats */}
      <div className="space-y-3 mb-4 sm:mb-6">
        {/* Countries Explored */}
        <div className="flex items-center justify-between p-3 bg-dark-tertiary rounded-lg">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent-secondary/10 rounded-lg flex items-center justify-center">
              <GlobeAltIcon className="w-4 h-4 text-accent-secondary" />
            </div>
            <div>
              <div className="text-xs sm:text-sm text-text-secondary">Countries Explored</div>
              <div className="text-base sm:text-lg font-semibold text-text-primary">
                {uniqueCountries} / {totalCountries}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Percentage */}
        <div className="flex items-center justify-between p-3 bg-dark-tertiary rounded-lg">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent-tertiary/10 rounded-lg flex items-center justify-center">
              <span className="text-accent-tertiary font-semibold text-xs sm:text-sm">%</span>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-text-secondary">World Coverage</div>
              <div className="text-base sm:text-lg font-semibold text-text-primary">{progressPercentage}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between text-xs sm:text-sm text-text-secondary mb-2">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-dark-tertiary rounded-full h-2 sm:h-3 overflow-hidden">
          <motion.div
            className="bg-accent-primary h-2 sm:h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Explore Button */}
      <motion.button
        onClick={onExploreClick}
        className="w-full btn btn-accent-primary group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <SparklesIcon className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
        Explore
      </motion.button>

      {/* Motivational Message */}
      <div className="text-center mt-3 sm:mt-4">
        <p className="text-text-secondary text-xs sm:text-sm">
          🌍 Keep exploring to discover more cultures!
        </p>
      </div>
    </div>
  );
}

export default ProgressDashboard;
