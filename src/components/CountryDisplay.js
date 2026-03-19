import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

function CountryDisplay({ country, onMarkAsExplored, onAddExperience }) {
  const [isMarkingExplored, setIsMarkingExplored] = useState(false);
  const [justExplored, setJustExplored] = useState(false);

  const handleMarkAsExplored = async () => {
    setIsMarkingExplored(true);
    try {
      if (onMarkAsExplored) {
        await onMarkAsExplored(country);
        setJustExplored(true);
      }
    } finally {
      setIsMarkingExplored(false);
    }
  };

  const infoItems = [
    { label: 'Capital', value: country.capital },
    { label: 'Population', value: country.population },
    { label: 'Language', value: country.language },
    { label: 'Currency', value: country.currency },
    { label: 'Region', value: country.region },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Hero */}
      <section className="text-center mb-10" aria-labelledby="country-hero">
        {/* Flag with ambient glow */}
        <div className="relative inline-block mb-5">
          <motion.div
            className="text-7xl sm:text-8xl md:text-[7rem] leading-none select-none"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.06, rotate: [0, -3, 3, 0] }}
            role="img"
            aria-label={`Flag of ${country.name}`}
          >
            {country.flag}
          </motion.div>
          <div
            className="absolute inset-0 blur-3xl opacity-15 -z-10 scale-[2]"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)' }}
            aria-hidden="true"
          />
        </div>

        {/* Country name — editorial serif */}
        <h1
          id="country-hero"
          className="text-4xl sm:text-5xl md:text-6xl text-text-primary leading-[1.1] tracking-tight mb-3"
          style={{ fontFamily: "'DM Serif Display', Georgia, 'Times New Roman', serif" }}
        >
          {country.name}
        </h1>

        {/* Region */}
        <p className="text-text-tertiary text-xs tracking-[0.2em] uppercase mb-6">
          {country.region}
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-8">
          {country.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            onClick={handleMarkAsExplored}
            disabled={isMarkingExplored || justExplored}
            className={`btn w-full sm:w-auto ${justExplored ? 'bg-emerald-600/90 text-white border-emerald-500/30' : 'btn-secondary'}`}
            whileHover={!justExplored ? { scale: 1.02 } : {}}
            whileTap={!justExplored ? { scale: 0.98 } : {}}
            aria-label="Mark country as explored"
          >
            <motion.span
              className="inline-flex"
              animate={justExplored ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            </motion.span>
            {isMarkingExplored ? 'Marking...' : justExplored ? 'Explored!' : 'Mark as Explored'}
          </motion.button>

          <motion.button
            onClick={() => onAddExperience && onAddExperience(country)}
            className="btn btn-accent-primary w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Add cultural experience"
          >
            <PlusIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            Add Experience
          </motion.button>
        </div>
      </section>

      {/* Info Strip — horizontal, clean metadata row */}
      <section aria-labelledby="country-info">
        <h2 id="country-info" className="sr-only">Country Information</h2>
        <div className="border-t border-dark-border pt-6 pb-2">
          <dl className="flex flex-wrap justify-center gap-x-8 sm:gap-x-10 gap-y-4">
            {infoItems.map((item) => (
              <div key={item.label} className="text-center">
                <dt className="text-text-tertiary text-[11px] uppercase tracking-[0.15em] mb-1">
                  {item.label}
                </dt>
                <dd className="text-text-primary text-sm font-medium">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}

export default CountryDisplay;
