import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';

export default function AnimePage() {
  const [animeList, setAnimeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);
  const [favoriteAnimeIds, setFavoriteAnimeIds] = useState([]);

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

  const handleClear = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedType('');
    fetchTopAnime();
  };

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


  const isAlreadyFavorited = (mal_id) => {
    return favoriteAnimeIds.includes(String(mal_id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Anime Page</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Keyword"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '200px' }}
        />
        <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)} style={{ padding: '0.5rem' }}>
          {genreOptions.map(g => <option key={g} value={g}>{g || 'All Genres'}</option>)}
        </select>
        <select value={selectedType} onChange={e => setSelectedType(e.target.value)} style={{ padding: '0.5rem' }}>
          {typeOptions.map(t => <option key={t} value={t}>{t || 'All Types'}</option>)}
        </select>
        <button onClick={handleSearch} style={{ padding: '0.5rem 1rem', backgroundColor: '#cba76b' }}>Search</button>
        <button onClick={handleClear} style={{ padding: '0.5rem 1rem', backgroundColor: '#592d39', color: 'white' }}>Clear</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : animeList.length === 0 ? (
        <p>No anime found.</p>
      ) : (
        animeList.map(anime => (
          <div key={anime.mal_id} style={{ display: 'flex', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #ddd' }}>
            <img src={anime.images.jpg.image_url} alt={anime.title} style={{ width: '150px', borderRadius: '8px', objectFit: 'cover', marginRight: '1.5rem' }} />
            <div style={{ flex: 1 }}>
              <h3>{anime.title}</h3>
              <p style={{ fontSize: '0.9rem' }}>{anime.synopsis ? anime.synopsis.slice(0, 300) + '...' : 'No description available.'}</p>
              <p><strong>Type:</strong> {anime.type}</p>
              <p><strong>Episodes:</strong> {anime.episodes || 'Unknown'}</p>
              <p><strong>Score:</strong> {anime.score || 'N/A'}</p>

              {isAlreadyFavorited(anime.mal_id) ? (
                <button disabled style={{ padding: '0.4rem 1rem', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '4px', marginRight: '1rem', cursor: 'not-allowed' }}>Saved</button>
              ) : (
                <button onClick={() => handleAddToFavorites(anime)} style={{ padding: '0.4rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', marginRight: '1rem', cursor: 'pointer' }}>Add to Favorites</button>
              )}

              <button onClick={() => handleVisitWebsite(anime)} style={{ padding: '0.4rem 1rem', backgroundColor: 'green', color: 'white', borderRadius: '4px' }}>Visit Website</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
