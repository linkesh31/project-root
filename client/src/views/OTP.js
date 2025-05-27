import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OTP() {
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    // Later: verify OTP
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>OTP Verification</h2>
      <form onSubmit={handleVerify}>
        <input type="text" placeholder="Enter OTP" required /><br /><br />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}
