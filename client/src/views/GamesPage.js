import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import '../styles/GamesPage.css';

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '4dd12c5f73e64b5b836b71b4a334cd5c';

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
        setGenres(res.data.results);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const res = await axios.get(`https://api.rawg.io/api/platforms?key=${API_KEY}`);
        setPlatforms(res.data.results);
      } catch (error) {
        console.error('Error fetching platforms:', error);
      }
    };
    fetchPlatforms();
  }, []);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      let url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=20`;

      if (searchTerm) url += `&search=${searchTerm}`;
      if (selectedGenre) url += `&genres=${selectedGenre}`;
      if (selectedPlatform) url += `&platforms=${selectedPlatform}`;
      if (selectedYear) url += `&dates=${selectedYear}-01-01,${selectedYear}-12-31`;

      const response = await axios.get(url);
      setGames(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching games:', error);
      setLoading(false);
    }
  }, [searchTerm, selectedGenre, selectedPlatform, selectedYear]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchGames();
    }, 500);
    return () => clearTimeout(debounceFetch);
  }, [searchTerm, selectedGenre, selectedPlatform, selectedYear, fetchGames]);

  const fetchFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/games');
      setFavorites(res.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavorite = async (game) => {
    try {
      await axiosInstance.post('/favorites/games', {
        gameId: String(game.id),
        title: game.name,
        posterImage: game.background_image,
        rating: game.rating
      });
      fetchFavorites();
    } catch (error) {
      console.error('Error saving favorite:', error.response?.data || error.message);
    }
  };

  const handleVisitWebsite = async (game) => {
  try {
    const res = await axiosInstance.post('/recent/game', {
      gameId: String(game.id),
      title: game.name,
      slug: game.slug
    });
    console.log("✅ Successfully saved recent game:", res.data);
    window.open(`https://rawg.io/games/${game.slug}`, '_blank');
  } catch (err) {
    console.error("❌ Error saving recent game:", err.response?.data || err.message);
    window.open(`https://rawg.io/games/${game.slug}`, '_blank');
  }
};


  const isFavorited = (gameId) => {
    return favorites.some((fav) => fav.gameId === String(gameId));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedPlatform('');
    setSelectedYear('');
  };

  return (
    <div className="games-page">
      <h1>🎮 Explore Games</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.slug}>{genre.name}</option>
          ))}
        </select>

        <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
          <option value="">All Platforms</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>{platform.name}</option>
          ))}
        </select>

        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">All Years</option>
          {Array.from({ length: 24 }, (_, i) => 2023 - i).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <button className="clear-btn" onClick={handleClearFilters}>Clear</button>
      </div>

      {loading ? (
        <div className="loading">Loading games...</div>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card">
              <div className="game-card-content">
                <img src={game.background_image} alt={game.name} className="game-poster" />
                <div className="game-details">
                  <h3>{game.name}</h3>
                  <p>Released: {game.released}</p>
                  <p>⭐ {game.rating}</p>
                  <div className="game-buttons">
                    <button
                      onClick={() => handleVisitWebsite(game)}
                      className="visit-button"
                    >
                      Visit Website
                    </button>
                    {isFavorited(game.id) ? (
                      <button disabled style={{ backgroundColor: '#888', color: '#fff' }}>Saved</button>
                    ) : (
                      <button onClick={() => handleFavorite(game)}>Add to Favorites</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
