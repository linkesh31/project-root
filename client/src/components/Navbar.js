import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';  // ✅ correct relative path

export default function Navbar() {
  const location = useLocation();
  const { toggleTheme, theme } = useContext(ThemeContext);

  const hideNavbarPaths = ['/', '/signup', '/OTP'];

  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  const hideAnimeLink = location.pathname === '/anime';

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>SenpaiStats</Link>
      </div>
      <div style={styles.right}>
        <Link to="/dashboard" style={styles.link}>Home</Link>
        {!hideAnimeLink && <Link to="/anime" style={styles.link}>Anime</Link>}
        <Link to="/games" style={styles.link}>Games</Link>
        <Link to="/favorites" style={styles.link}>Favorites</Link>
        <Link to="/profile" style={styles.link}>Profile</Link>

        <label className="switch">
          <input type="checkbox" onChange={toggleTheme} checked={theme === 'light'} />
          <span className="slider"></span>
        </label>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#111',
    color: 'white',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 999,
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontWeight: '500',
    fontSize: '1rem'
  }
};
