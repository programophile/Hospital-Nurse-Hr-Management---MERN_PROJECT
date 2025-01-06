import React, { useState, useEffect } from 'react';
import { fetchLeaves, updateLeaveStatus } from '../api';
import { useNavigate } from 'react-router-dom';
import '../leave.css';

const AdminLeaveHandle = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
      const data = await fetchLeaves(); // Now this will be the array directly
      console.log('Loaded leaves:', data);
      setLeaves(data || []); // Set the data directly, fallback to empty array if null/undefined
    } catch (error) {
      setErrorMessage('Error fetching leave requests');
      console.error('Error:', error);
      setLeaves([]);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const filteredLeaves = leaves.filter((leave) => {
    if (!leave?.nurseId) return false;
    
    const nurseName = `${leave.nurseId.firstName || ''} ${leave.nurseId.lastName || ''}`.trim();
    const reason = leave.reason || '';
    const searchTerm = searchQuery.toLowerCase();

    return (
      nurseName.toLowerCase().includes(searchTerm) ||
      reason.toLowerCase().includes(searchTerm)
    );
  });

  // Handle status update
  const handleStatusUpdate = async (leaveId, newStatus) => {
    try {
      await updateLeaveStatus(leaveId, newStatus);
      setSuccessMessage(`Leave request ${newStatus.toLowerCase()} successfully`);
      loadLeaves();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Error updating leave status');
      console.error('Error:', error);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="admin-leave-handle-container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <h2>Leave Requests</h2>
      <div className='search-container'>
        <input
          type="text"
          placeholder="Search by name or reason"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <ul className="admin-leave-handle-list">
        {filteredLeaves.length > 0 ? (
          filteredLeaves.map((leave) => (
            <li key={leave._id} className={`admin-leave-handle-item ${(leave.status || '').toLowerCase()}`}>
              <div>
                <h3 className="admin-leave-handle-name">
                  {leave.nurseId?.firstName} {leave.nurseId?.lastName}
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
          ))
        ) : (
          <li className="no-leaves-message">No leave requests found</li>
        )}
      </ul>
    </div>
  );
};

export default AdminLeaveHandle;