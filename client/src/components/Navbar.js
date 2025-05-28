import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>AniSport</Link>
      </div>
      <div style={styles.right}>
        <Link to="/dashboard" style={styles.link}>Home</Link>
        <Link to="/anime" style={styles.link}>Anime</Link>
        <Link to="/sports" style={styles.link}>Sports</Link>
        <Link to="/favorites" style={styles.link}>Favorites</Link>
        <Link to="/profile" style={styles.link}>Profile</Link>
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
    marginBottom: '2rem'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white'
  },
  right: {
    display: 'flex',
    gap: '1.5rem'
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontWeight: '500',
    fontSize: '1rem'
  },
  left: {
    display: 'flex',
    alignItems: 'center'
  }
};
