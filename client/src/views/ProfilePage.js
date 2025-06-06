import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [animeCount, setAnimeCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axiosInstance.get('/profile');
      setProfile(res.data.user);
      setAnimeCount(res.data.favorites.anime);
      setGameCount(res.data.favorites.games);
      setUsername(res.data.user.username);
      setBio(res.data.user.bio);
    } catch (err) {
      Swal.fire('Error', 'Failed to load profile', 'error');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axiosInstance.put('/profile/update', { username, bio });
      Swal.fire('Success', 'Profile updated', 'success');
      setEditMode(false);
      loadProfile();
    } catch (err) {
      Swal.fire('Error', 'Update failed', 'error');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      Swal.fire('Error', 'Please enter both current and new password.', 'error');
      return;
    }
    try {
      await axiosInstance.put('/profile/change-password', { currentPassword, newPassword });
      Swal.fire('Success', 'Password changed', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Password change failed', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete('/profile/delete');
        Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      } catch (err) {
        Swal.fire('Error', 'Delete failed', 'error');
      }
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Logout'
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>👤 My Profile</h2>

      <div style={sectionStyle}>
        {!editMode ? (
          <>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Username:</b> {profile.username}</p>
            <p><b>Bio:</b> {profile.bio || '-'}</p>
            <p><b>Account Created:</b> {new Date(profile.createdAt).toLocaleString()}</p>
            <p><b>Anime Favorites:</b> {animeCount}</p>
            <p><b>Game Favorites:</b> {gameCount}</p>

            <button style={editBtn} onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        ) : (
          <>
            <label>Username:</label><br />
            <input value={username} onChange={e => setUsername(e.target.value)} style={inputStyle} /><br />
            <label>Bio:</label><br />
            <textarea value={bio} onChange={e => setBio(e.target.value)} style={inputStyle} /><br />
            <button style={saveBtn} onClick={handleUpdateProfile}>Save Changes</button>
            <button style={cancelBtn} onClick={() => setEditMode(false)}>Cancel</button>
          </>
        )}
      </div>

      <div style={sectionStyle}>
        <h3>🔐 Change Password</h3>
        <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={inputStyle} /><br />
        <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} /><br />
        <button style={saveBtn} onClick={handleChangePassword}>Change Password</button>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button style={deleteBtn} onClick={handleDeleteAccount}>Delete Account</button>
        <button style={logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

// ✅ Styling Section
const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '2rem',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
};

const sectionStyle = {
  marginBottom: '2rem',
  padding: '1rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#fff',
};

const inputStyle = {
  padding: '0.5rem',
  width: '100%',
  marginBottom: '1rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const editBtn = {
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  marginTop: '1rem',
};

const saveBtn = {
  padding: '0.5rem 1rem',
  backgroundColor: 'green',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  marginRight: '1rem',
};

const cancelBtn = {
  padding: '0.5rem 1rem',
  backgroundColor: '#888',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};

const deleteBtn = {
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  marginRight: '1rem',
};

const logoutBtn = {
  padding: '0.5rem 1rem',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
};
