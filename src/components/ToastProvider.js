import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  InformationCircleIcon, 
  ExclamationTriangleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastIcon = ({ type }) => {
  const iconProps = {
    className: "w-5 h-5 flex-shrink-0",
    'aria-hidden': true
  };

  switch (type) {
    case 'success':
      return <CheckCircleIcon {...iconProps} className="w-5 h-5 flex-shrink-0 text-accent-success" />;
    case 'error':
      return <XCircleIcon {...iconProps} className="w-5 h-5 flex-shrink-0 text-accent-error" />;
    case 'warning':
      return <ExclamationTriangleIcon {...iconProps} className="w-5 h-5 flex-shrink-0 text-accent-warning" />;
    case 'info':
    default:
      return <InformationCircleIcon {...iconProps} className="w-5 h-5 flex-shrink-0 text-indigo-400" />;
  }
};

const Toast = ({ toast, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 200);
  }, [toast.id, onRemove]);

  // Auto-dismiss after duration
  React.useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(handleRemove, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleRemove]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'toast success border-accent-success';
      case 'error':
        return 'toast error border-accent-error';
      case 'warning':
        return 'toast border-accent-warning bg-accent-warning bg-opacity-10';
      case 'info':
      default:
        return 'toast info border-indigo-400';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ 
        opacity: isRemoving ? 0 : 1, 
        scale: isRemoving ? 0.8 : 1,
        y: isRemoving ? -20 : 0
      }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={getToastStyles()}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-start space-x-3">
        <ToastIcon type={toast.type} />
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className="text-sm font-semibold text-text-primary mb-1">
              {toast.title}
            </h4>
          )}
          <p className="text-sm text-text-secondary leading-relaxed">
            {toast.message}
          </p>
        </div>
        <motion.button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 text-text-tertiary hover:text-text-primary transition-colors rounded focus:outline-none focus:ring-2 focus:ring-brand-primary"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Dismiss notification"
        >
          <XMarkIcon className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const toast = useCallback((message, options = {}) => {
    return addToast({ message, ...options });
  }, [addToast]);

  const success = useCallback((message, options = {}) => {
    return addToast({ message, type: 'success', ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ message, type: 'error', duration: 7000, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ message, type: 'warning', ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ message, type: 'info', ...options });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    toast,
    success,
    error,
    warning,
    info
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div 
        className="fixed top-4 right-4 z-toast space-y-3 max-w-sm w-full"
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              onRemove={removeToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
