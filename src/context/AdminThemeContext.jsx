import React, { createContext, useContext, useState, useEffect } from 'react';

export const ADMIN_THEMES = [
  {
    id: 'gold',
    name: 'Royal Gold',
    label: 'Signature Luxury',
    colorKey: 'amber',
    hex: '#d97706',
    previewGradient: 'from-amber-400 via-amber-500 to-amber-600',
    primaryBg: 'bg-amber-500',
    primaryHover: 'hover:bg-amber-600',
    primaryLight: 'bg-amber-50',
    primaryText: 'text-amber-700',
    primaryBorder: 'border-amber-200',
    activeNav: 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs font-semibold',
    accentBtn: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20',
    accentIcon: 'text-amber-600',
    badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
    kpiGlow: 'bg-amber-500/10',
    accentDot: 'bg-amber-500',
    focusRing: 'focus:border-amber-500 focus:ring-amber-500/20',
  },
  {
    id: 'sapphire',
    name: 'Sapphire Blue',
    label: 'Executive Modern',
    icon: '💎',
    colorKey: 'blue',
    hex: '#2563eb',
    previewGradient: 'from-blue-500 via-blue-600 to-indigo-600',
    primaryBg: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    primaryLight: 'bg-blue-50',
    primaryText: 'text-blue-700',
    primaryBorder: 'border-blue-200',
    activeNav: 'bg-blue-50 text-blue-900 border-blue-300 shadow-xs font-semibold',
    accentBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20',
    accentIcon: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-800 border-blue-200/80',
    kpiGlow: 'bg-blue-500/10',
    accentDot: 'bg-blue-600',
    focusRing: 'focus:border-blue-600 focus:ring-blue-500/20',
  },
  {
    id: 'emerald',
    name: 'Emerald Prestige',
    label: 'British Racing Green',
    icon: '🌿',
    colorKey: 'emerald',
    hex: '#059669',
    previewGradient: 'from-emerald-500 via-emerald-600 to-teal-700',
    primaryBg: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    primaryLight: 'bg-emerald-50',
    primaryText: 'text-emerald-700',
    primaryBorder: 'border-emerald-200',
    activeNav: 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-xs font-semibold',
    accentBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20',
    accentIcon: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    kpiGlow: 'bg-emerald-500/10',
    accentDot: 'bg-emerald-600',
    focusRing: 'focus:border-emerald-600 focus:ring-emerald-500/20',
  },
  {
    id: 'ruby',
    name: 'Ruby Crimson',
    label: 'Sport & Performance',
    icon: '🍷',
    colorKey: 'rose',
    hex: '#e11d48',
    previewGradient: 'from-rose-500 via-rose-600 to-red-700',
    primaryBg: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-700',
    primaryLight: 'bg-rose-50',
    primaryText: 'text-rose-700',
    primaryBorder: 'border-rose-200',
    activeNav: 'bg-rose-50 text-rose-900 border-rose-300 shadow-xs font-semibold',
    accentBtn: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-md shadow-rose-500/20',
    accentIcon: 'text-rose-600',
    badge: 'bg-rose-50 text-rose-800 border-rose-200/80',
    kpiGlow: 'bg-rose-500/10',
    accentDot: 'bg-rose-600',
    focusRing: 'focus:border-rose-600 focus:ring-rose-500/20',
  },
  {
    id: 'amethyst',
    name: 'Amethyst Violet',
    label: 'Imperial Majesty',
    icon: '🔮',
    colorKey: 'purple',
    hex: '#7c3aed',
    previewGradient: 'from-purple-500 via-purple-600 to-violet-700',
    primaryBg: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    primaryLight: 'bg-purple-50',
    primaryText: 'text-purple-700',
    primaryBorder: 'border-purple-200',
    activeNav: 'bg-purple-50 text-purple-900 border-purple-300 shadow-xs font-semibold',
    accentBtn: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-md shadow-purple-500/20',
    accentIcon: 'text-purple-600',
    badge: 'bg-purple-50 text-purple-800 border-purple-200/80',
    kpiGlow: 'bg-purple-500/10',
    accentDot: 'bg-purple-600',
    focusRing: 'focus:border-purple-600 focus:ring-purple-500/20',
  },
  {
    id: 'obsidian',
    name: 'Titanium Slate',
    label: 'Minimalist Architecture',
    icon: '🖤',
    colorKey: 'slate',
    hex: '#0f172a',
    previewGradient: 'from-slate-700 via-slate-800 to-zinc-900',
    primaryBg: 'bg-slate-900',
    primaryHover: 'hover:bg-slate-800',
    primaryLight: 'bg-slate-100',
    primaryText: 'text-slate-900',
    primaryBorder: 'border-slate-300',
    activeNav: 'bg-slate-100 text-slate-950 border-slate-400 shadow-xs font-semibold',
    accentBtn: 'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20',
    accentIcon: 'text-slate-900',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    kpiGlow: 'bg-slate-500/10',
    accentDot: 'bg-slate-900',
    focusRing: 'focus:border-slate-900 focus:ring-slate-500/20',
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    label: 'Exquisite Glamour',
    icon: '🌸',
    colorKey: 'pink',
    hex: '#db2777',
    previewGradient: 'from-pink-500 via-rose-500 to-red-500',
    primaryBg: 'bg-pink-600',
    primaryHover: 'hover:bg-pink-700',
    primaryLight: 'bg-pink-50',
    primaryText: 'text-pink-700',
    primaryBorder: 'border-pink-200',
    activeNav: 'bg-pink-50 text-pink-900 border-pink-300 shadow-xs font-semibold',
    accentBtn: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-md shadow-pink-500/20',
    accentIcon: 'text-pink-600',
    badge: 'bg-pink-50 text-pink-800 border-pink-200/80',
    kpiGlow: 'bg-pink-500/10',
    accentDot: 'bg-pink-600',
    focusRing: 'focus:border-pink-600 focus:ring-pink-500/20',
  },
];

const AdminThemeContext = createContext({
  themeId: 'gold',
  theme: ADMIN_THEMES[0],
  setThemeId: () => {},
});

export const AdminThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('rd_admin_theme') || 'gold';
  });

  const theme = ADMIN_THEMES.find((t) => t.id === themeId) || ADMIN_THEMES[0];

  useEffect(() => {
    localStorage.setItem('rd_admin_theme', themeId);
    document.documentElement.style.setProperty('--admin-primary-hex', theme.hex);
  }, [themeId, theme]);

  return (
    <AdminThemeContext.Provider value={{ themeId, theme, setThemeId, themes: ADMIN_THEMES }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => useContext(AdminThemeContext);
