import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('theme_primary_color') || '#5CE1E6');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme_is_dark_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [logo, setLogo] = useState(() => localStorage.getItem('theme_logo') || null);
  const [institutionName, setInstitutionName] = useState(() => localStorage.getItem('theme_institution_name') || 'QR Coach');

  const [directorName, setDirectorName] = useState(() => localStorage.getItem('theme_director_name') || 'Coach');
  const [directorPhoto, setDirectorPhoto] = useState(() => localStorage.getItem('theme_director_photo') || null);

  useEffect(() => {
    localStorage.setItem('theme_primary_color', primaryColor);
    localStorage.setItem('theme_is_dark_mode', JSON.stringify(isDarkMode));
    localStorage.setItem('theme_logo', logo || '');
    localStorage.setItem('theme_institution_name', institutionName);
    localStorage.setItem('theme_director_name', directorName);
    localStorage.setItem('theme_director_photo', directorPhoto || '');
  }, [primaryColor, isDarkMode, logo, institutionName, directorName, directorPhoto]);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    const rgb = hexToRgb(primaryColor);
    if (rgb) {
      document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  }, [primaryColor]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return (
    <ThemeContext.Provider value={{ 
      primaryColor, 
      setPrimaryColor, 
      isDarkMode, 
      setIsDarkMode, 
      logo, 
      setLogo,
      institutionName,
      setInstitutionName,
      directorName,
      setDirectorName,
      directorPhoto,
      setDirectorPhoto
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
