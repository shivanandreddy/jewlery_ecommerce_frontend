import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

// Available theme accent options
export const ACCENT_COLORS = {
  amber: { name: 'Jewelry Gold', class: 'amber', bg: 'bg-amber-600', text: 'text-amber-600', hover: 'hover:bg-amber-700', ring: 'focus:ring-amber-500' },
  emerald: { name: 'Emerald', class: 'emerald', bg: 'bg-emerald-600', text: 'text-emerald-600', hover: 'hover:bg-emerald-700', ring: 'focus:ring-emerald-500' },
  indigo: { name: 'Royal Blue', class: 'indigo', bg: 'bg-indigo-600', text: 'text-indigo-600', hover: 'hover:bg-indigo-700', ring: 'focus:ring-indigo-500' },
  rose: { name: 'Rose Gold', class: 'rose', bg: 'bg-rose-600', text: 'text-rose-600', hover: 'hover:bg-rose-700', ring: 'focus:ring-rose-500' },
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme_dark') === 'true' || localStorage.getItem('theme') === 'dark';
  });

  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('theme_accent') || localStorage.getItem('accent') || 'amber';
  });

  useEffect(() => {
    localStorage.setItem('theme_dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('theme_accent', accent);
    localStorage.setItem('accent', accent);
  }, [accent]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  // Compatibility helpers matching old toggleTheme structure
  const theme = darkMode ? 'dark' : 'light';
  const toggleTheme = toggleDarkMode;

  return (
    <ThemeContext.Provider 
      value={{ 
        darkMode, 
        toggleDarkMode, 
        theme, 
        toggleTheme, 
        accent, 
        setAccent, 
        accentColor: accent,       
        setAccentColor: setAccent,  
        themeConfig: ACCENT_COLORS[accent] 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);