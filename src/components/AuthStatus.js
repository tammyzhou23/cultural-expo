import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

function AuthStatus() {
  const { user, loading, authEnabled, signInWithGoogle, signOutUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMenu]);

  if (loading) {
    return (
      <div className="text-text-secondary text-sm">
        Loading...
      </div>
    );
  }

  if (!user) {
    if (!authEnabled) {
      return (
        <button
          className="btn btn-ghost cursor-not-allowed opacity-60 text-xs sm:text-sm px-2 sm:px-3"
          aria-label="Sign in unavailable"
          title="Sign in unavailable. Configure Firebase env vars."
          disabled
        >
          <span className="hidden sm:inline">Sign in (setup required)</span>
          <span className="sm:hidden">Setup</span>
        </button>
      );
    }
    return (
      <button
        onClick={signInWithGoogle}
        className="btn btn-accent-primary text-xs sm:text-sm px-2 sm:px-3 whitespace-nowrap"
        aria-label="Sign in with Google"
      >
        <span className="hidden sm:inline">Sign in with Google</span>
        <span className="sm:hidden">Sign in</span>
      </button>
    );
  }

  const displayName = user.displayName || user.email || 'User';
  const photoURL = user.photoURL;
  const userEmail = user.email;

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      {photoURL ? (
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-dark-border hover:border-accent-primary transition-colors flex-shrink-0 cursor-pointer overflow-hidden focus-ring"
          aria-label={`User menu for ${displayName}`}
          aria-expanded={showMenu}
          aria-haspopup="true"
        >
          <img
            src={photoURL}
            alt={displayName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      ) : (
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-dark-tertiary hover:bg-dark-quaternary flex items-center justify-center text-text-secondary text-xs sm:text-sm font-medium flex-shrink-0 border-2 border-dark-border hover:border-accent-primary transition-colors focus-ring"
          aria-label={`User menu for ${displayName}`}
          aria-expanded={showMenu}
          aria-haspopup="true"
        >
          {displayName.slice(0, 1).toUpperCase()}
        </button>
      )}

      {/* User Menu Dropdown */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
            />
            
            {/* Dropdown Menu */}
            <motion.div
              className="absolute right-0 mt-2 w-64 bg-dark-tertiary border border-dark-border rounded-lg shadow-lg z-50 overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              role="menu"
              aria-orientation="vertical"
            >
              {/* User Info Section */}
              <div className="p-4 border-b border-dark-border">
                <div className="flex items-center gap-3">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt={displayName}
                      className="w-12 h-12 rounded-full border-2 border-dark-border flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-dark-secondary flex items-center justify-center text-text-primary text-lg font-medium border-2 border-dark-border flex-shrink-0">
                      {displayName.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text-primary truncate">
                      {displayName}
                    </div>
                    {userEmail && (
                      <div className="text-xs text-text-secondary truncate mt-0.5">
                        {userEmail}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-dark-border">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-text-secondary">Signed in</span>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="p-2">
                <button
                  onClick={() => {
                    signOutUser();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-primary hover:bg-dark-secondary rounded-lg transition-colors focus-ring"
                  role="menuitem"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 text-text-secondary" aria-hidden="true" />
                  <span>Sign out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AuthStatus;


