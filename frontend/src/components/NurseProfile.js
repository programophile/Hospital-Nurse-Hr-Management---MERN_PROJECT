import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NurseProfile.css';

const NurseProfile = () => {
  const [nurse, setNurse] = useState({});
  const [bloodGroup, setBloodGroup] = useState('');
  const [birthday, setBirthday] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [educationInstitution, setEducationalInstitution] = useState('');
  const [specialty, setSpecialty] = useState('');
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
        console.log('Fetched Nurse Data:', response.data); // Log the fetched data
        setNurse(response.data);
        setBloodGroup(response.data.bloodGroup || '');
        setBirthday(response.data.birthday || '');
        setMaritalStatus(response.data.maritalStatus || '');
        setEducationalInstitution(response.data.educationInstitution || '');
        setSpecialty(response.data.specialty || '');
      } catch (err) {
        setError('Error fetching profile.');
        console.error('Fetch Error:', err.response?.data || err.message); // Log the error
      }
      setLoading(false);
    };

    fetchNurseProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
  
    // Append text fields
 
    formData.append('bloodGroup', bloodGroup);
    formData.append('birthday', birthday); // Ensure this is a valid date string
    formData.append('maritalStatus', maritalStatus);
    formData.append('educationInstitution', educationInstitution);
    formData.append('specialty', specialty);
  
    // Append the profile picture if it exists
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }
  
    try {
      console.log('Nurse ID:', nurse._id); // Log the nurse ID
      const response = await axios.put(`http://localhost:5000/api/nurses/${nurse._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Correct content type for file uploads
        },
      });
  
      console.log('Server Response:', response.data); // Log the response
      alert(response.data.message);
  
      // Update the nurse's state with the new data
      const updatedNurse = response.data.nurse;
      updatedNurse.profilePicture = `http://localhost:5000/${updatedNurse.profilePicture}`; // Update the profile picture URL
      setNurse(updatedNurse);
      setIsEditing(false);
    } catch (err) {
      setError('Error updating profile.');
      console.error('Update Error:', err.response?.data || err.message); // Log the error
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleEditProfilePicture = () => {
    document.getElementById('profile-picture-input').click();
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);

      // Preview the new profile picture
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById('profile-picture').src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };
  const getProfilePictureUrl = (profilePicture) => {
    if (!profilePicture) return ''; // Fallback for missing profile picture
    if (profilePicture.startsWith('http')) {
      return profilePicture; // Already a full URL
    }
    return `http://localhost:5000/${profilePicture}`; // Prepend base URL for relative paths
  };
  if (loading) return <div>Loading...</div>;
  console.log('Profile Picture:', nurse.profilePicture);
  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-picture">
          <img
            id="profile-picture"
            src={getProfilePictureUrl(nurse.profilePicture)}
            alt="Profile"
          />
          <input
            type="file"
            id="profile-picture-input"
            onChange={handleProfilePictureChange}
            style={{ display: 'none' }}
          />
          {isEditing && (
            <div className="edit-profile-picture" onClick={handleEditProfilePicture}>
              Edit Profile Picture
            </div>
          )}
        </div>
        <div className="profile-info">
          <h2>{nurse.firstName} {nurse.lastName}</h2>
          <p>{specialty} at {educationInstitution}</p>
          <p>Blood Group: {bloodGroup}</p>
          <p>Birthday: {birthday}</p>
          <p>Marital Status: {maritalStatus}</p>
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
            <label>Blood Group:</label>
            <input
              type="text"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            />

            <label>Birthday:</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />

            <label>Marital Status:</label>
            <input
              type="text"
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
            />

            <label>Specialty:</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            />

            <label>Educational Institution:</label>
            <input
              type="text"
              value={educationInstitution}
              onChange={(e) => setEducationalInstitution(e.target.value)}
            />

            <button type="submit">Save Changes</button>
            <button type="button" onClick={handleCancelEdit}>Cancel</button>
          </div>
        </form>
      )}
      {!isEditing && (
        <button onClick={handleEditProfile}>Edit Profile</button>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default NurseProfile;