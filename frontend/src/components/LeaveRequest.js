
import React, { useState, useEffect } from 'react';
import { fetchLeaves, createLeave } from '../api'; // Ensure these functions are correctly imported
import '../leave.css'; 
const LeaveRequest = () => {
  const [user, setUser ] = useState(null); // Store user object
  const [nurseId, setNurseId] = useState('');
  //const [firstName, setFirstName] = useState('');
  //const [lastName, setLastName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [leaves, setLeaves] = useState([]);
  //const [nurses, setNurses] = useState([]); 
  //const [status,setStatus]=useState(['Pending']);   // State to hold list of nurses
  //const [status, setStatus] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
      setUser(storedUser);
      setNurseId(storedUser.id);
      //setFirstName(storedUser.firstName)
      //setLastName(storedUser.lastName)
      setSearchQuery(`${storedUser.firstName} ${storedUser.lastName}`);
      console.log('gogogo',storedUser) // Set the Nurse ID from the user info
      console.log('gogogo',storedUser.id) // Set the Nurse ID from the user info
  }
}, []);

        const filteredLeaves = leaves.filter((leave) => {
          const nurseName = `${leave.nurseId.firstName} ${leave.nurseId.lastName}`;
          return (
            nurseName.toLowerCase().includes(searchQuery.toLowerCase())
      
          );
        });

  // Load existing leaves
  const loadLeaves = async () => {
    try {
      const data = await fetchLeaves();
      console.log('Fetched leaves data:', data); // Add this log
      setLeaves(data); // Remove .data as fetchLeaves already returns the data
    } catch (error) {
      console.error('Load leaves error details:', error);
      setErrorMessage('Failed to load leave requests');
    }
  };
//changed

  // Handle leave request submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting leave request:', { nurseId, startDate, endDate, reason }); 
  const leaveData = {
    nurseId,
    //firstName,
    //lastName,               // Ensure this is the correct ID
    startDate,
    endDate,
    reason,
    status: 'Pending',
   //Set status to 'Pending' by default
};

console.log('Submitting leave request:', leaveData); // Log the leave data // Use user ID from user object
    try {
      const response = await createLeave(leaveData);
      console.log('Leave request created:', response.data);
      setSuccessMessage('Leave request created successfully!');
      // Reset form fields
      loadLeaves();
      setEndDate('');
      setStartDate('');
      setReason('');
      //setStatus('Pending');
      //setStatus('Pending'); // Reload leaves after successful submission
    } catch (error) {
      console.error('Error creating leave request:', error);
      setErrorMessage('Error creating leave request. Please try again.');
    }
  };
    useEffect(() => {
        loadLeaves();
    }, [nurseId]); 
  // Fetch user information on component mount
  // Load leaves on component mount
console.log('leaves er vitor',leaves)
  return (
    <div className="leave-container"> {/* Add class for styling */}
      <h2>Leave Request Form</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}
      {user ? (
        <form onSubmit={handleSubmit} className="leave-form"> {/* Add class for styling */}
          {/* <input
            type="text"
            placeholder="User "
            value={user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
            disabled
            className="input-field"
          /> */}
          
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
      <h4>Please submit your leave request in a timely manner to ensure that the allocated slot is not vacant for an entire day.</h4> 
      <input
        type="text"
        placeholder="Search by name or reason"
        value={searchQuery}
        disabled
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <ul>
        {filteredLeaves.map((leave) => (
          leave.status ? ( // Check if status is defined
            <li key={leave._id} className={`leave-item ${leave.status.toLowerCase()}`}>
              <span>Name:{leave.nurseId.firstName} {leave.nurseId.lastName}</span>
              <span>{leave.reason}</span>
              <span>{new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</span>
              <span className={`status ${leave.status.toLowerCase()}`}>
                {leave.status}
              </span>
            </li>
          ) : null
        ))}
      </ul>
    </div>
  );
};

export default LeaveRequest;

