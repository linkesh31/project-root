import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [animeCount, setAnimeCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [username, setUsername] = useState('');

  const [recentAnime, setRecentAnime] = useState([]);
  const [recentGames, setRecentGames] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username);
    }
  }, []);

  useEffect(() => {
    fetchAnimeFavorites();
    fetchGameFavorites();
    loadRecentAnime();
    loadRecentGames();
  }, []);

  const fetchAnimeFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/anime');
      setAnimeCount(res.data.length);
    } catch (err) {
      console.error('Error fetching anime favorites:', err);
    }
  };

  const fetchGameFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/games');
      setGameCount(res.data.length);
    } catch (err) {
      console.error('Error fetching game favorites:', err);
    }
  };

  const loadRecentAnime = async () => {
    try {
      const res = await axiosInstance.get('/recent/anime');
      setRecentAnime(res.data);
    } catch (err) {
      console.error('Error loading recent anime:', err);
    }
  };

  const loadRecentGames = async () => {
    try {
      const res = await axiosInstance.get('/recent/game');
      setRecentGames(res.data);
    } catch (err) {
      console.error('Error loading recent games:', err);
    }
  };

  const handleVisitAnime = (url) => {
    window.open(url, '_blank');
  };

  const handleVisitGame = (slug) => {
    window.open(`https://rawg.io/games/${slug}`, '_blank');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome back, {username ? username : '👋'}</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '2rem 0' }}>
        <div style={cardStyle}>
          <h3>Anime Followed</h3>
          <p>{animeCount}</p>
        </div>
        <div style={cardStyle}>
          <h3>Games Followed</h3>
          <p>{gameCount}</p>
        </div>
        <div style={cardStyle}>
          <h3>3rd API (Coming Soon)</h3>
          <p>-</p>
        </div>
      </div>

      <h2>Recently Viewed</h2>

      <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <h4>Anime:</h4>
        {recentAnime.length === 0 ? <p>No recent anime.</p> : (
          recentAnime.map(item => (
            <button key={item._id}
              style={recentBtn}
              onClick={() => handleVisitAnime(item.url)}
            >
              {item.title}
            </button>
          ))
        )}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h4>Games:</h4>
        {recentGames.length === 0 ? <p>No recent games.</p> : (
          recentGames.map(item => (
            <button key={item._id}
              style={recentBtn}
              onClick={() => handleVisitGame(item.slug)}
            >
              {item.title}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#f1f1f1',
  padding: '1.5rem',
  borderRadius: '10px',
  width: '200px',
  boxShadow: '0 0 5px rgba(0,0,0,0.1)'
};

const recentBtn = {
  margin: '0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  backgroundColor: '#eee',
  cursor: 'pointer'
};
