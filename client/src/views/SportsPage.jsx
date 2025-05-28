import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SportsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League')
      .then(response => {
        setTeams(response.data.teams || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching sports data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Sports Page - English Premier League Teams</h2>
      {loading ? (
        <p>Loading teams...</p>
      ) : (
        <ul>
          {teams.map((team) => (
            <li key={team.idTeam}>{team.strTeam}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
