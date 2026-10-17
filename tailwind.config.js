/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#070707',
          dark: '#0f0f11',
          surface: '#151518',
          card: '#1c1c21',
          border: '#2a2a32',
          muted: '#71717a',
          silver: '#e2e8f0',
          white: '#ffffff',
          gold: '#c5a059',
          platinum: '#f8fafc',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'serif'],
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        luxury: '.25em',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
