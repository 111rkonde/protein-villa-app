/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Neon Emerald
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          accent: '#22c55e',
          neon: '#10b981',
          orange: '#f97316',
          gold: '#eab308',
        },
        dark: {
          bg: '#0a0d12',
          surface: '#111722',
          card: '#161e2e',
          border: '#1f293d',
          subtle: '#2d3748',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px -3px rgba(16, 185, 129, 0.45)',
        'neon-strong': '0 0 30px 2px rgba(16, 185, 129, 0.65)',
        'glow-orange': '0 0 20px -3px rgba(249, 115, 22, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' },
          'to': { boxShadow: '0 0 25px rgba(16, 185, 129, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
