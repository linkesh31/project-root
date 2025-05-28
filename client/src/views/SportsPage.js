import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SportsPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League');
        setTeams(response.data.teams || []);
      } catch (error) {
        console.error("Error fetching sports teams:", error);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Sports Page</h2>
      <ul>
        {teams.map(team => (
          <li key={team.idTeam}>
            <strong>{team.strTeam}</strong> – {team.strStadium}
          </li>
        ))}
      </ul>
    </div>
  );
}
