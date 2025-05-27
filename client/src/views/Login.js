import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Later: validate login, then move to OTP
    navigate('/otp');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" required /><br /><br />
        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
}
