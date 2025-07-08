import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('citypulse-theme');
    return saved ? JSON.parse(saved) : false;
  });
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('citypulse-themeColor') || 'blue';
  });

  useEffect(() => {
    localStorage.setItem('citypulse-theme', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('citypulse-themeColor', themeColor);
    document.documentElement.setAttribute('data-theme-color', themeColor);
  }, [themeColor]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const value = {
    isDark,
    toggleTheme,
    themeColor,
    setThemeColor
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 