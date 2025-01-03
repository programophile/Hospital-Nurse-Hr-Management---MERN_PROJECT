import React, { useState, useEffect } from 'react';
import { fetchLeaves, updateLeaveStatus } from '../api';
import { useNavigate } from 'react-router-dom';

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
console.log(leaves);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Leave Request Management</h2>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      <div className="grid gap-4">
        {leaves.map((leave) => (
          <div key={leave._id} className="shadow-md p-4">
            <h3 className="font-semibold">
              {leave.id}
            </h3>
            <p className="text-sm text-gray-600">
              {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm"><strong>Reason:</strong> {leave.reason}</p>
            <p className="text-sm">
              <strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {leave.status}
              </span>
            </p>
            
            {leave.status === 'Pending' && (
              <div className="space-x-2">
                <button
                  onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminLeaveHandle;