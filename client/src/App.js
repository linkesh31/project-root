import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Login from './views/Login';
import Signup from './views/Signup';
import OTP from './views/OTP';
import Dashboard from './views/Dashboard';
import AnimePage from './views/AnimePage';
import SportsPage from './views/SportsPage';
import Favorites from './views/Favorites';
import Navbar from './components/Navbar';

// This wrapper ensures Navbar is hidden on auth pages
const MainLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = ['/', '/signup', '/otp'].includes(location.pathname);
  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/sports" element={<SportsPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<div style={{ padding: '2rem' }}><h2>Profile Page (coming soon)</h2></div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
