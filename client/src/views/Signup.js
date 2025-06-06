import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import signupBackground from '../assets/login_arttt.jpeg';  // using same background to keep consistency

export default function Signup() {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert(response.data.message);
      navigate('/otp', { state: { email: formData.email } });
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div 
      className="signup-container" 
      style={{ backgroundImage: `url(${signupBackground})` }}
    >
      <div className="signup-box">
        <h2>SenpaiStats Signup</h2>
        <form onSubmit={handleSignup}>
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
            type="text"
            name="username"
            placeholder="Username"
            className="input-field"
            value={formData.username}
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
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <div className="footer-text">
          <p>Already have an account? <a href="/">Login</a></p>
        </div>
      </div>
    </div>
  );
}
