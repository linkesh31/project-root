import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

export default function Favorites() {
  const [activeTab, setActiveTab] = useState('anime');
  const [animeFavorites, setAnimeFavorites] = useState([]);
  const [gamesFavorites, setGamesFavorites] = useState([]);

  useEffect(() => {
    fetchAnimeFavorites();
    fetchGamesFavorites();
  }, []);

  const fetchAnimeFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/anime');
      setAnimeFavorites(res.data);
    } catch (err) {
      console.error('Error loading anime favorites:', err);
    }
  };

  const fetchGamesFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/games');
      setGamesFavorites(res.data);
    } catch (err) {
      console.error('Error loading games favorites:', err);
    }
  };

  const handleRemoveAnime = async (animeId) => {
    const confirm = window.confirm("Are you sure you want to remove this anime?");
    if (!confirm) return;
    try {
      await axiosInstance.delete(`/favorites/anime/${animeId}`);
      setAnimeFavorites(prev => prev.filter(item => item.animeId !== animeId));
    } catch (err) {
      console.error("Error removing anime:", err);
      alert('Failed to remove anime.');
    }
  };

  const handleRemoveGame = async (gameId) => {
    const confirm = window.confirm("Are you sure you want to remove this game?");
    if (!confirm) return;
    try {
      await axiosInstance.delete(`/favorites/games/${gameId}`);
      setGamesFavorites(prev => prev.filter(item => item.gameId !== gameId));
    } catch (err) {
      console.error("Error removing game:", err);
      alert('Failed to remove game.');
    }
  };

  const renderAnimeCards = () => {
    if (animeFavorites.length === 0) return <p>No favorite anime found.</p>;

    return animeFavorites.map(anime => (
      <div key={anime.animeId} style={cardContainer}>
        <img src={anime.posterImage} alt={anime.title} style={posterStyle} />
        <div style={{ flex: 1 }}>
          <h3>{anime.title}</h3>
          <p><strong>Rating:</strong> {anime.rating}</p>
          <button onClick={() => handleRemoveAnime(anime.animeId)} style={buttonStyle('darkred')}>Remove</button>
          <a href={`https://myanimelist.net/anime/${anime.animeId}`} target="_blank" rel="noreferrer" style={buttonStyle('green')}>Visit Website</a>
        </div>
      </div>
    ));
  };

  const renderGamesCards = () => {
    if (gamesFavorites.length === 0) return <p>No favorite games found.</p>;

    return gamesFavorites.map(game => (
      <div key={game.gameId} style={cardContainer}>
        <img src={game.posterImage} alt={game.title} style={posterStyle} />
        <div style={{ flex: 1 }}>
          <h3>{game.title}</h3>
          <p><strong>Rating:</strong> {game.rating}</p>
          <button onClick={() => handleRemoveGame(game.gameId)} style={buttonStyle('darkred')}>Remove</button>
          <a href={`https://rawg.io/games/${game.title.replaceAll(' ', '-').toLowerCase()}`} target="_blank" rel="noreferrer" style={buttonStyle('green')}>Visit Website</a>
        </div>
      </div>
    ));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Favorites</h2>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => setActiveTab('anime')} style={tabButtonStyle(activeTab === 'anime')}>Anime</button>
        <button onClick={() => setActiveTab('games')} style={tabButtonStyle(activeTab === 'games')}>Games</button>
      </div>

      {activeTab === 'anime' && renderAnimeCards()}
      {activeTab === 'games' && renderGamesCards()}
    </div>
  );
}

const cardContainer = {
  display: 'flex',
  marginBottom: '2rem',
  borderBottom: '1px solid #ddd',
  paddingBottom: '1rem'
};

const posterStyle = {
  width: '150px',
  borderRadius: '8px',
  marginRight: '1rem'
};

const buttonStyle = (color) => ({
  padding: '0.4rem 1rem',
  backgroundColor: color,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  marginRight: '1rem',
  cursor: 'pointer',
  textDecoration: 'none'
});

const tabButtonStyle = (isActive) => ({
  padding: '0.5rem 1rem',
  backgroundColor: isActive ? '#000' : '#ccc',
  color: isActive ? '#fff' : '#000',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
});
