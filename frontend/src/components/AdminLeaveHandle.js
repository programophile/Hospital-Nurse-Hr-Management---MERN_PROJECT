import React, { useState, useEffect } from 'react';
import { fetchLeaves, updateLeaveStatus } from '../api';
import { useNavigate } from 'react-router-dom';
import '../leave.css';
const AdminLeaveHandle = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check if user is admin
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch all leave requests
  const loadLeaves = async () => {
    try {
      const response = await fetchLeaves();
      setLeaves(response.data);
      console.log('load ja ja hocche', response.data);
    } catch (error) {
      setErrorMessage('Error fetching leave requests');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (leaveId, newStatus) => {
    try {
      await updateLeaveStatus(leaveId, newStatus);
      setSuccessMessage(`Leave request ${newStatus.toLowerCase()} successfully`);
      loadLeaves(); // Reload the list
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      setErrorMessage('Error updating leave status');
      console.error('Error:', error);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
console.log('html e ja dhuktese',leaves);
return (
    <div className="admin-leave-handle-container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <h2>Leave Requests</h2>
      <ul className="admin-leave-handle-list">
        {leaves.map((leave) => (
          <li key={leave._id} className={`admin-leave-handle-item ${leave.status.toLowerCase()}`}>
            <div>
              <h3 className="admin-leave-handle-name">
                {leave.nurseId.firstName} {leave.nurseId.lastName}
              </h3>
              <p className="admin-leave-handle-dates">
                {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
              </p>
              <p className="admin-leave-handle-reason"><strong>Reason:</strong> {leave.reason}</p>
              <p className="admin-leave-handle-status">{leave.status}</p>
            </div>
            {leave.status === 'Pending' && (
              <div className="admin-leave-handle-actions">
                <button onClick={() => handleStatusUpdate(leave._id, 'Approved')}>Approve</button>
                <button onClick={() => handleStatusUpdate(leave._id, 'Rejected')}>Reject</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminLeaveHandle;