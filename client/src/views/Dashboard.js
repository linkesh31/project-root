import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      <button onClick={() => navigate('/anime')}>Anime Page</button><br /><br />
      <button onClick={() => navigate('/sports')}>Sports Page</button><br /><br />
      <button onClick={() => navigate('/favorites')}>Favorites</button>
    </div>
  );
}
