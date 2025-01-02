import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NurseProfile.css';

const NurseProfile = () => {
  const [nurse, setNurse] = useState({});
  const [specialty, setSpecialty] = useState('');
  const [educationInstitution, setEducationInstitution] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchNurseProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/nurses/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNurse(response.data);
        setSpecialty(response.data.specialty || '');
        setEducationInstitution(response.data.educationInstitution || '');
      } catch (err) {
        setError('Error fetching profile.');
      }
      setLoading(false);
    };

    fetchNurseProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('specialty', specialty);
    formData.append('educationInstitution', educationInstitution);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/api/nurses/${nurse._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form data'
        }
      });
      console.log('Server Response:', response.data); // Log the response
      alert(response.data.message);
      const updatedNurse = response.data.nurse;
      updatedNurse.profilePicture = `http://localhost:5000/${updatedNurse.profilePicture}`; // Update the profile picture URL
      setNurse(updatedNurse);
      setIsEditing(false);
    } catch (err) {
      setError('Error updating profile.');
    }
  };
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleEditProfilePicture = () => {
    setIsEditing(true);
    document.getElementById('profile-picture-input').click();
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('profile-picture').src = reader.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-picture">
        <img
  id="profile-picture"
  src={nurse.profilePicture || ''} // Use the profilePicture URL as is
  alt="Profile"
/>
          <input
            type="file"
            id="profile-picture-input"
            onChange={handleProfilePictureChange}
            style={{ display: 'none' }}
          />
          <div className="edit-profile-picture" onClick={handleEditProfilePicture}>
            Edit Profile Picture
          </div>
        </div>
        <div className="profile-info">
          <h2>{nurse.firstName} {nurse.lastName}</h2>
          <p>{specialty} at {educationInstitution}</p>
        </div>
      </div>
      <div className="profile-bio">
        <h3>Bio</h3>
        <p>
          {specialty} at {educationInstitution}
        </p>
      </div>
      {isEditing && (
        <form onSubmit={handleSubmit}>
          <div className="profile-form">
            <label>Specialty:</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />
          </div>
          <div className="profile-form">
            <label>Education Institution:</label>
            <input
              type="text"
              value={educationInstitution}
              onChange={(e) => setEducationInstitution(e.target.value)}
            />
          </div>
          <button type="submit">Update Profile</button>
          <button type="button" onClick={handleCancelEdit}>
            Cancel
          </button>
        </form>
      )}
      {!isEditing && (
        <button type="button" onClick={handleEditProfile}>
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default NurseProfile;