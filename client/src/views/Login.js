import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';  // ✅ Use your axiosInstance with token support
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', formData);
      alert("Login successful");

      // ✅ Save token
      localStorage.setItem('token', response.data.token);

      // ✅ Save user info (optional but useful)
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // ✅ Navigate to dashboard after login
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          style={{ padding: '10px', marginBottom: '10px', width: '300px' }}
        /><br />

        <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
      </form>

      <div style={{ marginTop: '20px' }}>
        <Link to="/signup">Don't have an account? Signup</Link> <br />
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
}
