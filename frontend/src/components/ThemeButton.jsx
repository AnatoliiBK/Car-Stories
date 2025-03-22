import React from 'react';
import { useTheme } from './ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    // <button onClick={toggleTheme}>
    //   Toggle to {theme === "light" ? "Dark" : "Light"} Mode
      // </button>
      <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
      {theme === "light" ? (
        <FontAwesomeIcon icon={faMoon} style={{color: "yellow"}}/>
      ) : (
        <FontAwesomeIcon icon={faSun} style={{color: "yellow"}}/>
      )}
    </button>
  );
};

export default ThemeButton;
