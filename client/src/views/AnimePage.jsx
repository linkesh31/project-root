// client/src/views/AnimePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AnimePage() {
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    axios.get('https://kitsu.io/api/edge/anime?page[limit]=10')
      .then(res => {
        setAnimeList(res.data.data);
      })
      .catch(err => {
        console.error('Failed to fetch anime:', err);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Anime List</h2>
      <ul>
        {animeList.map(anime => (
          <li key={anime.id}>
            <strong>{anime.attributes.titles.en_jp}</strong> — {anime.attributes.synopsis.substring(0, 100)}...
          </li>
        ))}
      </ul>
    </div>
  );
}
