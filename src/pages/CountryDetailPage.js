import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import CountryDisplay from '../components/CountryDisplay';
import FoodSection from '../components/FoodSection';
import DrinkSection from '../components/DrinkSection';
import MovieSection from '../components/MovieSection';
import BookCoverTransition from '../components/BookCoverTransition';
import { getAllCountries } from '../utils/countrySelector';

const SECTIONS = [
  { id: 'food', label: 'Cuisine', icon: '🍴' },
  { id: 'drinks', label: 'Drinks', icon: '🍹' },
  { id: 'cinema', label: 'Cinema', icon: '🎬' },
];

function SectionDivider({ icon, label }) {
  return (
    <div className="flex items-center gap-4 mb-8 max-w-4xl mx-auto px-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-dark-border to-transparent" />
      <span className="flex items-center gap-2 text-text-tertiary text-[11px] font-medium tracking-[0.2em] uppercase select-none">
        <span>{icon}</span>
        {label}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-dark-border to-transparent" />
    </div>
  );
}

function CountryDetailPage({ onMarkAsExplored, onAddExperience }) {
  const { countryId } = useParams();
  const [showCover, setShowCover] = useState(true);
  const [activeSection, setActiveSection] = useState('food');
  const [showStickyNav, setShowStickyNav] = useState(false);

  const heroRef = useRef(null);
  const foodRef = useRef(null);
  const drinksRef = useRef(null);
  const cinemaRef = useRef(null);

  const coverDone = !showCover;
  const country = getAllCountries().find(c => c.id === countryId) || null;

  // Lock body scroll during cover animation
  useEffect(() => {
    if (showCover) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [showCover]);

  // Scroll spy: track which section is in view + toggle sticky nav
  useEffect(() => {
    if (!coverDone) return;

    const heroEl = heroRef.current;
    const heroObserver = new IntersectionObserver(
      ([entry]) => setShowStickyNav(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.dataset.section) {
            setActiveSection(entry.target.dataset.section);
          }
        });
      },
      { threshold: 0.15, rootMargin: '-100px 0px -40% 0px' }
    );

    if (heroEl) heroObserver.observe(heroEl);
    [foodRef, drinksRef, cinemaRef].forEach(ref => {
      if (ref.current) sectionObserver.observe(ref.current);
    });

    return () => {
      heroObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [coverDone]);

  const scrollToSection = useCallback((sectionId) => {
    const refs = { food: foodRef, drinks: drinksRef, cinema: cinemaRef };
    const ref = refs[sectionId];
    if (ref?.current) {
      const top = ref.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  // 404
  if (!country) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-32 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-6xl mb-6">🗺️</div>
        <h2 className="text-2xl font-bold text-text-primary mb-3">Country not found</h2>
        <p className="text-text-secondary mb-8">
          We couldn't find a country with the id{' '}
          <code className="text-accent-primary">"{countryId}"</code>.
        </p>
        <Link to="/" className="btn btn-accent-primary">Back to Discover</Link>
      </motion.div>
    );
  }

  return (
    <>
      {showCover && (
        <BookCoverTransition country={country} onComplete={() => setShowCover(false)} />
      )}

      {/* Sticky Section Nav — appears when hero scrolls out of view */}
      <AnimatePresence>
        {showStickyNav && coverDone && (
          <motion.div
            initial={{ y: -48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -48, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-16 sm:top-[4.5rem] left-0 right-0 z-30 flex justify-center py-2 pointer-events-none"
          >
            <nav
              className="pointer-events-auto bg-dark-secondary/90 backdrop-blur-xl border border-dark-border rounded-full px-1 py-1 flex gap-0.5 shadow-lg shadow-black/20"
              aria-label="Content sections"
            >
              {SECTIONS.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`relative px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'text-white'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                  aria-current={activeSection === section.id ? 'true' : undefined}
                >
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="sectionPill"
                      className="absolute inset-0 bg-white/[0.08] border border-white/[0.06] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span className="hidden sm:inline text-xs">{section.icon}</span>
                    {section.label}
                  </span>
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        {/* Breadcrumb */}
        <motion.nav
          className="mb-2"
          initial={{ opacity: 0 }}
          animate={coverDone ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center gap-1.5 text-sm">
            <li>
              <Link
                to="/"
                className="text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Discover
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRightIcon className="w-3 h-3 text-text-disabled" />
            </li>
            <li>
              <span className="text-text-secondary">{country.name}</span>
            </li>
          </ol>
        </motion.nav>

        {/* Hero + Info */}
        <div ref={heroRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={coverDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CountryDisplay
              country={country}
              onMarkAsExplored={onMarkAsExplored}
              onAddExperience={onAddExperience}
            />
          </motion.div>
        </div>

        {/* Cultural Sections */}
        <div className="mt-16">
          <div ref={foodRef} data-section="food" className="scroll-mt-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={coverDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              <SectionDivider icon="🍴" label="Cuisine" />
              <FoodSection selectedCountry={country} />
            </motion.div>
          </div>

          <div ref={drinksRef} data-section="drinks" className="mt-20 scroll-mt-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={coverDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              <SectionDivider icon="🍹" label="Drinks" />
              <DrinkSection selectedCountry={country} />
            </motion.div>
          </div>

          <div ref={cinemaRef} data-section="cinema" className="mt-20 scroll-mt-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={coverDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              <SectionDivider icon="🎬" label="Cinema" />
              <MovieSection selectedCountry={country} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CountryDetailPage;
