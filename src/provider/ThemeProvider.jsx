import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun as LuSun, Moon as LuMoon } from 'lucide-react';

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {},
    isDark: false
});

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        try {
            const saved = localStorage.getItem('luxe_theme');
            if (saved === 'dark' || saved === 'light') return saved;
            return 'light'; // Default: White Theme
        } catch {
            return 'light';
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        try {
            localStorage.setItem('luxe_theme', theme);
        } catch (e) {
            console.error(e);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

export const ThemeToggle = ({ className = "" }) => {
    const { toggleTheme, isDark } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to White Theme" : "Switch to Dark Theme"}
            title={isDark ? "Switch to White Theme" : "Switch to Dark Theme"}
            className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 cursor-pointer ${
                isDark 
                    ? "bg-slate-800 text-yellow-400 hover:bg-slate-700 border border-slate-700 shadow-md shadow-black/20" 
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 shadow-sm"
            } ${className}`}
        >
            {isDark ? (
                <LuSun className="w-5 h-5 transition-transform duration-300 hover:rotate-45" />
            ) : (
                <LuMoon className="w-5 h-5 transition-transform duration-300 hover:-rotate-12" />
            )}
        </button>
    );
};

export default ThemeProvider;
