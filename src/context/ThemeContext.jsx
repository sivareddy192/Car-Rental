import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Default to 'light' (white theme with black text) as requested by user
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('rd_theme');
    if (saved) return saved;
    return 'light'; // Default white theme with black text
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('rd_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      id="theme-toggle-btn"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      aria-label={`Switch to ${isDark ? 'White' : 'Dark'} mode`}
      title={`Switch to ${isDark ? 'White' : 'Dark'} mode`}
      className={`relative inline-flex items-center justify-center transition-colors duration-200 outline-none select-none ${
        showLabel ? 'h-10 px-3.5 gap-2 rounded-2xl' : 'w-10 h-10 rounded-2xl'
      } ${
        isDark
          ? 'bg-[#141724] hover:bg-[#1a1f30] border border-white/[0.08] text-amber-400 shadow-[0_2px_12px_rgba(0,0,0,0.25)]'
          : 'bg-[#f2f4f7] hover:bg-[#e5e8ed] border border-slate-200/90 text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ rotate: -70, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 70, scale: 0.5, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 22,
          }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400 fill-amber-400/25" strokeWidth={2.2} />
          ) : (
            <Moon className="w-5 h-5 fill-slate-800 text-slate-800" strokeWidth={0} />
          )}
        </motion.div>
      </AnimatePresence>
      {showLabel && (
        <span className="text-xs font-bold tracking-wide">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </motion.button>
  );
};

