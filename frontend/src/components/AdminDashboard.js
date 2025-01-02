// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { fetchNurses, fetchShifts, createShift, deleteShift } from '../api';

const AdminDashboard = () => {
  const [nurses, setNurses] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [nurseId, setNurseId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const loadNurses = async () => {
    const response = await fetchNurses();
    setNurses(response.data);
  };

  const loadShifts = async () => {
    const response = await fetchShifts();
    setShifts(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createShift({ nurseId, date, startTime, endTime });
    loadShifts();
    setNurseId('');
    setDate('');
    setStartTime('');
    setEndTime('');
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      await deleteShift(shiftId);
      loadShifts();
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  useEffect(() => {
    loadNurses();
    loadShifts();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard </h2>
      <form onSubmit={handleSubmit}>
        <select value={nurseId} onChange={(e) => setNurseId(e.target.value)} required>
          <option value="">Select Nurse</option>
          {nurses.map((nurse) => (
            <option key={nurse._id} value={nurse._id}>
              {nurse.firstName} {nurse.lastName}
            </option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        <button type="submit">Assign Shift</button>
      </form>

      <h3>All Nurses' Shifts</h3>
      {shifts.length === 0 ? (
        <p>No nurses scheduled</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nurse Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift._id}>
                <td>
                  {shift.nurseId
                    ? `${shift.nurseId.firstName} ${shift.nurseId.lastName}`
                    : 'Nurse not found'}
                </td>
                <td>{new Date(shift.date).toLocaleDateString()}</td>
                <td>{shift.startTime}</td>
                <td>{shift.endTime}</td>
                <td>{shift.status}</td>
                <td>
                  <button onClick={() => handleDeleteShift(shift._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;