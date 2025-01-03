import React, { useState, useEffect } from 'react';
import { fetchNurses, fetchShifts, createShift, deleteShift, fetchDepartments } from '../api';

const AdminDashboard = () => {
  const [nurses, setNurses] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [nurseId, setNurseId] = useState('');
  const [filteredNurses, setFilteredNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const loadNurses = async () => {
    const response = await fetchNurses();
    console.log('load Nurse',response)
    setNurses(response);
  };

  const loadShifts = async () => {
    try {
      const response = await fetchShifts();
      const allShifts = response;
      console.log("all shifts",response)
      const filteredShifts = allShifts.filter((shift) => {
        if (searchQuery) {
          return (
            shift.nurseId.employeeId.toString().includes(searchQuery) ||
            shift.nurseId.department.includes(searchQuery) ||
            shift.nurseId.firstName.includes(searchQuery) ||
            shift.nurseId.lastName.includes(searchQuery)
          );
        }
        return true;
      });
      setShifts(filteredShifts);
    } catch (error) {
      console.error('Error loading shifts:', error);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await fetchDepartments();
      setDepartments(response || []);
    } catch (error) {
      console.error('Error loading departments:', error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating shift with payload:', { nurseId, selectedDate, selectedStartTime, selectedEndTime });
      const response = await createShift({
        nurseId,
        date: selectedDate,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
      });
      console.log('Response from server:', response);
      loadShifts();
      setNurseId('');
      setSelectedDate('');
      setSelectedStartTime('');
      setSelectedEndTime('');
    } catch (error) {
      console.error('Error creating shift:', error);
      alert('Error creating shift. Please try again.');
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      await deleteShift(shiftId);
      loadShifts();
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    console.log("handledepartmentchange",nurses)
    const filteredNurses = nurses.filter((nurse) => nurse.department === e.target.value);
    setFilteredNurses(filteredNurses);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    const filteredNurses = filteredNurses.filter((nurse) => {
      const existingShifts = shifts.filter((shift) => shift.nurseId === nurse._id);
      return !existingShifts.some((shift) => shift.date === e.target.value);
    });
    setFilteredNurses(filteredNurses);
  };

  const handleStartTimeChange = (e) => {
    setSelectedStartTime(e.target.value);
    const filteredNurses = filteredNurses.filter((nurse) => {
      const existingShifts = shifts.filter((shift) => shift.nurseId === nurse._id);
      return !existingShifts.some((shift) => shift.startTime === e.target.value && shift.endTime === selectedEndTime);
    });
    setFilteredNurses(filteredNurses);
  };

  const handleEndTimeChange = (e) => {
    setSelectedEndTime(e.target.value);
    const filteredNurses = filteredNurses.filter((nurse) => {
      const existingShifts = shifts.filter((shift) => shift.nurseId === nurse._id);
      return !existingShifts.some((shift) => shift.startTime === selectedStartTime && shift.endTime === e.target.value);
    });
    setFilteredNurses(filteredNurses);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredNurses = nurses.filter((nurse) => {
      if (searchQuery) {
        return (
          nurse.firstName.includes(searchQuery) ||
          nurse.lastName.includes(searchQuery) ||
          nurse.department.includes(searchQuery)
        );
      }
      return true;
    });
    setFilteredNurses(filteredNurses);
  };

  useEffect(() => {loadNurses();
    loadShifts();
    loadDepartments();
  }, []);

  useEffect(() => {
    loadShifts();
  }, [searchQuery]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <select value={selectedDepartment} onChange={handleDepartmentChange} required>
          <option value="">Select Department</option>
          {departments.map((department, index) => (
            <option key={index} value={department}>
              {department}
            </option>
          ))}
        </select>
        <input type="date" value={selectedDate} onChange={handleDateChange} required />
        <input type="time" value={selectedStartTime} onChange={handleStartTimeChange} required />
        <input type="time" value={selectedEndTime} onChange={handleEndTimeChange} required />
        <select value={nurseId} onChange={(e) => setNurseId(e.target.value)} required>
          <option value="">Select Nurse</option>
          {filteredNurses.map((nurse) => (
            <option key={nurse._id} value={nurse._id}>
              {nurse.firstName} {nurse.lastName}
            </option>
          ))}
        </select>
        <button type="submit">Assign Shift</button>
      </form>

      <h3>All Nurses' Shifts</h3>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search for shifts by employee ID or department"
      />
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