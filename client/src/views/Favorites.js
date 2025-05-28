import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

export default function Favorites() {
  const [activeTab, setActiveTab] = useState('anime');
  const [animeFavorites, setAnimeFavorites] = useState([]);
  const [sportsFavorites, setSportsFavorites] = useState([]);

  useEffect(() => {
    fetchAnimeFavorites();
    fetchSportsFavorites();
  }, []);

  const fetchAnimeFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/anime');
      setAnimeFavorites(res.data);
    } catch (err) {
      console.error('Error loading anime favorites:', err);
    }
  };

  const fetchSportsFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/sports');
      setSportsFavorites(res.data);
    } catch (err) {
      console.error('Error loading sports favorites:', err);
    }
  };

  const handleRemoveAnime = async (animeId) => {
    const confirm = window.confirm("Are you sure you want to remove this anime from favorites?");
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/favorites/anime/${animeId}`);
      setAnimeFavorites(prev => prev.filter(item => item.animeId !== animeId));
    } catch (err) {
      console.error("Error removing anime:", err);
      alert('Failed to remove anime.');
    }
  };

  const handleRemoveTeam = async (teamId) => {
    const confirm = window.confirm("Are you sure you want to remove this team from favorites?");
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/favorites/sports/${teamId}`);
      setSportsFavorites(prev => prev.filter(item => item.teamId !== teamId));
    } catch (err) {
      console.error("Error removing team:", err);
      alert('Failed to remove team.');
    }
  };

  const renderAnimeCards = () => {
    if (animeFavorites.length === 0) return <p>No favorite anime found.</p>;

    return animeFavorites.map(anime => (
      <div key={anime.animeId} style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
        <img src={anime.posterImage} alt={anime.title} style={{ width: '150px', borderRadius: '8px', marginRight: '1rem' }} />
        <div style={{ flex: 1 }}>
          <h3>{anime.title}</h3>
          <p><strong>Rating:</strong> {anime.rating}</p>
          <button
            onClick={() => handleRemoveAnime(anime.animeId)}
            style={{
              padding: '0.4rem 1rem',
              backgroundColor: 'darkred',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginRight: '1rem',
              cursor: 'pointer'
            }}
          >
            Remove
          </button>
          <a
            href={`https://myanimelist.net/anime/${anime.animeId}`}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '0.4rem 1rem',
              backgroundColor: 'green',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Visit Website
          </a>
        </div>
      </div>
    ));
  };

  const renderSportsCards = () => {
    if (sportsFavorites.length === 0) return <p>No favorite sports teams found.</p>;

    return sportsFavorites.map(team => (
      <div key={team.teamId} style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
        <img src={team.teamBadge} alt={team.teamName} style={{ width: '100px', borderRadius: '8px', marginRight: '1rem' }} />
        <div style={{ flex: 1 }}>
          <h3>{team.teamName}</h3>
          <p><strong>League:</strong> {team.league}</p>
          <p><strong>Country:</strong> {team.country}</p>
          <button
            onClick={() => handleRemoveTeam(team.teamId)}
            style={{
              padding: '0.4rem 1rem',
              backgroundColor: 'darkred',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Remove
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Favourites</h2>
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setActiveTab('anime')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'anime' ? '#000' : '#ccc',
            color: activeTab === 'anime' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Anime
        </button>
        <button
          onClick={() => setActiveTab('sports')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: activeTab === 'sports' ? '#000' : '#ccc',
            color: activeTab === 'sports' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sports
        </button>
      </div>

      {activeTab === 'anime' ? renderAnimeCards() : renderSportsCards()}
    </div>
  );
}
