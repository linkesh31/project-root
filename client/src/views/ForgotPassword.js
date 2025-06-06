import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axiosInstance.post('/auth/request-reset', { email });
      alert('OTP sent successfully.');
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axiosInstance.post('/auth/verify-reset-otp', { email, otp });
      alert('OTP matched. Proceeding to reset your password.');
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Password Reset</h2>
        <label>Email Address</label>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Enter your email"
        />
        <button onClick={handleSendOtp}>Send OTP</button>

        {otpSent && (
          <>
            <p>OTP sent successfully.</p>
            <label>Enter OTP</label>
            <input 
              type="text" 
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
              placeholder="Enter OTP"
            />
            <button onClick={handleVerifyOtp}>Submit OTP</button>
          </>
        )}

        {/* ✅ Add link to go back to login */}
        <div style={{ marginTop: '20px' }}>
          <Link to="/">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
