import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';
import loginBackground from '../assets/login_arttt.jpeg';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      alert("Login successful");
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
      console.error(err);
    }
  };

  return (
    <div 
      className="container" 
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="login-box">
        <h2>SenpaiStats</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="options">
            <Link to="/forgot-password" className="link-button">
              Forgot Password?
            </Link>
            <a href="/signup">Sign Up</a>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="footer-text"></div>
      </div>
    </div>
  );
}
