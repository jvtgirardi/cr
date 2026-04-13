import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState('#5CE1E6');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [logo, setLogo] = useState(null);
  const [institutionName, setInstitutionName] = useState('CoachBoard');

  const [directorName, setDirectorName] = useState('Coach');
  const [directorPhoto, setDirectorPhoto] = useState(null);

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
