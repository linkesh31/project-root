import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();

  // Test connection to your backend
  useEffect(() => {
    axios.get('/api/test')
      .then(res => {
        console.log('✅ Backend says:', res.data);
      })
      .catch(err => {
        console.error('❌ Error connecting to backend:', err.message);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      <button onClick={() => navigate('/anime')}>Anime Page</button><br /><br />
      <button onClick={() => navigate('/sports')}>Sports Page</button><br /><br />
      <button onClick={() => navigate('/favorites')}>Favorites</button>
    </div>
  );
}
