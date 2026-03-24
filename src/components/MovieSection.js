import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, StarIcon, CalendarIcon, UserIcon, FilmIcon } from '@heroicons/react/24/outline';
import movieData from '../data/movies.json';

function MovieSection({ selectedCountry }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (selectedCountry && selectedCountry.id) {
      setMovies(movieData[selectedCountry.id] || []);
      setSelectedMovie(null);
    } else {
      setMovies([]);
      setSelectedMovie(null);
    }
  }, [selectedCountry]);

  // Early return if no country is selected
  if (!selectedCountry || !selectedCountry.id) {
    return (
      <div className="flex items-center justify-center min-h-48 py-12">
        <div className="text-center">
          <div className="text-4xl mb-3">🎬</div>
          <h3 className="text-lg font-medium text-text-secondary mb-2">Cinema & Films</h3>
          <p className="text-sm text-text-tertiary">Select a country to explore its movie culture</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🎬</div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No Movies Found</h3>
        <p className="text-sm text-text-secondary">
          No movie information available for this country.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2">
          Cinema & Films
        </h3>
        <p className="text-sm text-text-secondary">Explore {selectedCountry.name}'s movie culture</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {movies.map((movie, index) => (
          <motion.div
            key={movie.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className={`card cursor-pointer ${
              selectedMovie === movie.title
                ? 'border-dark-border-hover'
                : ''
            }`}
            onClick={() => setSelectedMovie(selectedMovie === movie.title ? null : movie.title)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedMovie(selectedMovie === movie.title ? null : movie.title);
              }
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            tabIndex={0}
            role="button"
            aria-expanded={selectedMovie === movie.title}
            aria-label={`${movie.title} - Click to ${selectedMovie === movie.title ? 'collapse' : 'expand'} details`}
          >
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="text-3xl sm:text-4xl">{movie.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg sm:text-xl font-semibold text-text-primary">{movie.title}</h4>
                    <span className="text-text-secondary text-base sm:text-lg">{movie.rating}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">
                    <span className="font-medium">{movie.year}</span> • {movie.director} • {movie.duration}min
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(movie.genre) ? movie.genre.map((g, index) => (
                      <span key={index} className="px-2 py-1 rounded-full text-xs font-medium border border-dark-border bg-white/[0.03] text-text-secondary">
                        {g}
                      </span>
                    )) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium border border-dark-border bg-white/[0.03] text-text-secondary">
                        {movie.genre}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {selectedMovie === movie.title && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pt-4 border-t border-dark-border"
                  >
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-text-primary text-sm mb-1">Plot Summary</h5>
                        <p className="text-sm text-text-secondary">
                          {movie.description || 'A compelling story that showcases the unique cultural perspective of this region.'}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-text-primary text-sm mb-1">Category</h5>
                        <p className="text-sm text-text-secondary">
                          {movie.category || 'Cultural Film'}
                        </p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-text-primary text-sm mb-1">Cultural Significance</h5>
                        <p className="text-sm text-text-secondary">
                          {movie.cultural_significance || `This film represents important aspects of ${selectedCountry.name}'s culture, storytelling traditions, and cinematic heritage.`}
                        </p>
                      </div>

                      {movie.awards && movie.awards.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-text-primary text-sm mb-1">Awards</h5>
                          <p className="text-sm text-text-secondary">
                            {movie.awards.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
    </div>
  );
}

export default MovieSection;

