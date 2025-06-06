import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import '../styles/AnimePage.css';

export default function AnimePage() {
  const [animeList, setAnimeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [favoriteAnimeIds, setFavoriteAnimeIds] = useState([]);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const searchTimeout = useRef(null);

  const genreOptions = ['', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Sports'];
  const typeOptions = ['', 'TV', 'Movie', 'OVA', 'Special', 'ONA'];

  useEffect(() => {
    fetchTopAnime();
    fetchUserFavorites();
  }, []);

  const fetchTopAnime = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://api.jikan.moe/v4/top/anime?page=1');
      setAnimeList(res.data.data);
    } catch (err) {
      console.error("Error loading top anime:", err);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const res = await axiosInstance.get('/favorites/anime');
      const ids = res.data.map(fav => fav.animeId);
      setFavoriteAnimeIds(ids);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let query = `https://api.jikan.moe/v4/anime?q=${searchTerm}&limit=25`;
      if (selectedType) query += `&type=${selectedType.toLowerCase()}`;
      if (selectedGenre) query += `&genres=${mapGenreToId(selectedGenre)}`;
      const res = await axios.get(query);
      setAnimeList(res.data.data);
    } catch (err) {
      console.error("Search error:", err);
      setAnimeList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!searchTerm && !selectedGenre && !selectedType) {
      fetchTopAnime();
      return;
    }
    searchTimeout.current = setTimeout(() => {
      handleSearch();
    }, 600);
  }, [searchTerm, selectedGenre, selectedType]);

  const mapGenreToId = (genre) => {
    const genreMap = {
      Action: 1, Adventure: 2, Comedy: 4, Drama: 8,
      Fantasy: 10, Horror: 14, Romance: 22, "Sci-Fi": 24, Sports: 30,
    };
    return genreMap[genre] || '';
  };

  const handleAddToFavorites = async (anime) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to favorite.');
        return;
      }
      const payload = {
        animeId: String(anime.mal_id),
        title: anime.title,
        posterImage: anime.images.jpg.image_url,
        rating: anime.score || 'N/A'
      };
      await axiosInstance.post('/favorites/anime', payload);
      alert(`${anime.title} added to favorites!`);
      setFavoriteAnimeIds(prev => [...prev, payload.animeId]);
    } catch (err) {
      console.error('Error adding favorite:', err);
      alert('Failed to add to favorites.');
    }
  };

  // ✅ New function added (recent view function)
  const handleVisitWebsite = async (anime) => {
    try {
      const res = await axiosInstance.post('/recent/anime', {
        animeId: String(anime.mal_id),
        title: anime.title,
        url: anime.url
      });
      console.log("✅ Successfully saved recent anime:", res.data);
      window.open(anime.url, '_blank');
    } catch (err) {
      console.error("❌ Error saving recent anime:", err.response?.data || err.message);
      window.open(anime.url, '_blank');
    }
  };

  const isAlreadyFavorited = (mal_id) => favoriteAnimeIds.includes(String(mal_id));

  const handleCardClick = (anime) => setSelectedAnime(anime);
  const closeModal = () => setSelectedAnime(null);

  return (
    <>
      {selectedAnime && (
        <div className="anime-modal">
          <div className="anime-modal-content">
            <button className="close-btn" onClick={closeModal}>✖</button>
            <h2>{selectedAnime.title}</h2>
            <img src={selectedAnime.images.jpg.image_url} alt={selectedAnime.title} />
            <p><strong>Score:</strong> ⭐ {selectedAnime.score || 'N/A'}</p>
            <p><strong>Episodes:</strong> {selectedAnime.episodes || 'Unknown'}</p>
            <p className="anime-desc">{selectedAnime.synopsis}</p>
          </div>
        </div>
      )}

      <div className="anime-container">
        <div className="hero-section">
          {animeList.length > 0 && (
            <>
              <img src={animeList[0].images.jpg.large_image_url} alt="Backdrop" className="hero-blur-bg" />
              <div className="hero-foreground">
                <img src={animeList[0].images.jpg.image_url} alt="Poster" className="hero-poster" />
                <div className="hero-text">
                  <h2>#1 Trending</h2>
                  <h1>{animeList[0].title}</h1>
                  <p>{animeList[0].synopsis?.substring(0, 180)}...</p>
                  <div className="hero-buttons">
                    <button
                      className={`btn heart-toggle ${isAlreadyFavorited(animeList[0].mal_id) ? 'active' : ''}`}
                      onClick={() => handleAddToFavorites(animeList[0])}
                      disabled={isAlreadyFavorited(animeList[0].mal_id)}
                    >
                      ❤️ Favorite
                    </button>
                    <button 
                      className="btn details"
                      onClick={() => handleVisitWebsite(animeList[0])}
                    >
                      Visit Website
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <h2 style={{ color: 'white', marginBottom: '1rem' }}>Anime Collection</h2>

        <div className="filter-bar">
          <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
            {genreOptions.map(g => <option key={g} value={g}>{g || 'All Genres'}</option>)}
          </select>
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
            {typeOptions.map(t => <option key={t} value={t}>{t || 'All Types'}</option>)}
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : animeList.length === 0 ? (
          <p>No anime found.</p>
        ) : (
          <div className="anime-grid">
            {animeList.map((anime) => (
              <div key={anime.mal_id} className="anime-card" onClick={() => handleCardClick(anime)}>
                <img src={anime.images.jpg.image_url} alt={anime.title} className="anime-img" />
                <div className="anime-overlay">
                  <h3>{anime.title}</h3>
                  <p>⭐ {anime.score || 'N/A'}</p>
                  <div className="button-stack">
                    <button
                      className={`btn heart-toggle ${isAlreadyFavorited(anime.mal_id) ? 'active' : ''}`}
                      onClick={(e) => { e.stopPropagation(); handleAddToFavorites(anime); }}
                      disabled={isAlreadyFavorited(anime.mal_id)}
                    >
                      {isAlreadyFavorited(anime.mal_id) ? '❤️ Saved' : '🤍 Favorite'}
                    </button>
                    <button 
                      className="btn details" 
                      onClick={(e) => { e.stopPropagation(); handleVisitWebsite(anime); }}
                    >
                      Visit Website
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
