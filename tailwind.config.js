/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Dark Mode Design System (Notion/Linear/Cursor Inspired)
        dark: {
          'primary': '#0A0A0F',     // Primary background — warm-tinted
          'secondary': '#15141A',   // Card backgrounds
          'tertiary': '#201E26',    // Hover states
          'quaternary': '#2C2A34',  // Highest elevation
          'border': '#2E2C36',      // Subtle borders
          'border-hover': '#3E3C48', // Hover borders
        },
        text: {
          'primary': '#FFFFFF',     // High contrast white
          'secondary': '#A1A1AA',   // Zinc-400 — clear step down
          'tertiary': '#71717A',    // Zinc-500 — subtle
          'inverse': '#18181B',     // Dark text for light backgrounds
        },
        accent: {
          'success': '#238636',     // Success green
          'error': '#DA3633',       // Error red
          'info': '#6366F1',        // Info indigo
          'warning': '#FB8500',     // Warning orange
        },
        brand: {
          'primary': '#6366F1',     // Indigo primary
          'secondary': '#818CF8',   // Indigo secondary
          'tertiary': '#A5B4FC',    // Indigo light
        },
        progress: {
          'DEFAULT': '#22C55E',     // Green — growth
          'light': '#4ADE80',       // Green-400
        },
        glass: {
          'bg': 'rgba(21, 20, 26, 0.8)',        // Glass background — warm-tinted
          'border': 'rgba(46, 44, 54, 0.6)',    // Glass border
          'text': 'rgba(255, 255, 255, 0.9)',   // Glass text
        }
      },
      fontSize: {
        'xs': ['clamp(0.75rem, 1.5vw, 0.875rem)', { lineHeight: '1.5', fontWeight: '400' }],
        'sm': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.5', fontWeight: '400' }],
        'base': ['clamp(1rem, 2vw, 1.125rem)', { lineHeight: '1.6', fontWeight: '400' }],
        'lg': ['clamp(1.125rem, 2.5vw, 1.25rem)', { lineHeight: '1.6', fontWeight: '500' }],
        'xl': ['clamp(1.25rem, 3vw, 1.5rem)', { lineHeight: '1.5', fontWeight: '500' }],
        '2xl': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.4', fontWeight: '600' }],
        '3xl': ['clamp(1.875rem, 5vw, 2.5rem)', { lineHeight: '1.3', fontWeight: '600' }],
        '4xl': ['clamp(2.25rem, 6vw, 3rem)', { lineHeight: '1.2', fontWeight: '600' }],
        '5xl': ['clamp(3rem, 8vw, 4rem)', { lineHeight: '1.1', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
      },
      borderRadius: {
        'card': '8px',
        'modal': '12px',
        'button': '6px',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'modal': '0 8px 16px rgba(0, 0, 0, 0.2)',
        'inner-soft': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        // Enhanced animations for modern feel
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'spring': 'spring 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'modal-in': 'modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'modal-out': 'modalOut 0.2s ease-in',
        'toast-in': 'toastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'stagger': 'stagger 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' },
        },
        spring: {
          '0%': { transform: 'scale(0.9) rotate(-1deg)' },
          '50%': { transform: 'scale(1.05) rotate(0.5deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        modalOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(-100%) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        stagger: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        'glass': '8px',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal-backdrop': '900',
        'modal': '1000',
        'toast': '1100',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}