import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './views/Login';
import Signup from './views/Signup';
import OTP from './views/OTP';
import Dashboard from './views/Dashboard';
import AnimePage from './views/AnimePage';
import SportsPage from './views/SportsPage';
import Favorites from './views/Favorites';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/anime" element={<AnimePage />} />
        <Route path="/sports" element={<SportsPage />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;
