import React, { useState, useEffect } from 'react';
import { fetchLeaves, createLeave } from '../api'; // Ensure these functions are correctly imported

const LeaveRequest = () => {
  const [user, setUser ] = useState(null); // Store user object
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [leaves, setLeaves] = useState([]);

  // Load existing leaves
  const loadLeaves = async () => {
    try {
      const response = await fetchLeaves();
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };
//changed

  // Handle leave request submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage('User  not logged in.'); // Check if user is available
      return;
    }
    
    const leaveData = { userId: user._id, startDate, endDate, reason }; // Use user ID from user object
    try {
      const response = await createLeave(leaveData);
      console.log('Leave request created:', response.data);
      setSuccessMessage('Leave request created successfully!');
      // Reset form fields
      setStartDate('');
      setEndDate('');
      setReason('');
      setErrorMessage('');
      loadLeaves(); // Reload leaves after successful submission
    } catch (error) {
      console.error('Error creating leave request:', error);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        setErrorMessage(error.response.data.message || 'An error occurred while creating the leave request.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  // Fetch user information on component mount
  useEffect(() => {
    const storedUser  = localStorage.getItem('user'); // Get user object from localStorage
    console.log('Stored User:', storedUser ); // Debugging line
    if (storedUser ) {
      setUser (JSON.parse(storedUser )); // Parse and set user object
    } else {
      setErrorMessage('User  not logged in or user information not found.');
    }
  }, []); // Run only once on mount

  // Load leaves on component mount
  useEffect(() => {
    loadLeaves(); // Load existing leaves when component mounts
  }, []);

  return (
    <div>
      <h2>Leave Request</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}
      {user ? ( // Check for user object
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          >
            <option value="">Select Reason</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Vacation">Vacation</option>
            <option value="Personal Leave">Personal Leave</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit">Submit Leave Request</button>
        </form>
      ) : (
        <p>Please log in to submit a leave request.</p>
      )}
      <h3>Existing Leave Requests</h3>
      <ul>
        {leaves.map((leave) => (
          <li key={leave._id}>
            {leave.startDate} to {leave.endDate} - {leave .reason}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveRequest;