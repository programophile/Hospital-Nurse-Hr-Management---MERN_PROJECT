import React, { useState, useEffect } from 'react';
import { fetchNurses, fetchShifts, createShift, deleteShift, fetchDepartments, updateShift } from '../api';
import Modal from 'react-modal';
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
  const [notification, setNotification] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const loadNurses = async () => {
    const response = await fetchNurses();
    console.log('load Nurse',response)
    setNurses(response);
  };
  const handleUpdateShift = (shift) => {
    setSelectedShift(shift);
    setIsOpen(true);
  };

  const handleAfterOpenModal = () => {
    // after modal is opened, you can add some logic here if needed
  }
  const handleAfterCloseModal = () => {
    setIsOpen(false);
    setSelectedShift(null);
  };

  const handleUpdateShiftSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedShift = await updateShift(selectedShift._id, {
        nurseId: selectedShift.nurseId,
        date: selectedShift.date,
        startTime: selectedShift.startTime,
        endTime: selectedShift.endTime,
      });
      console.log('Updated Shift:', updatedShift);
      loadShifts();
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  };

  const checkTomorrowSchedule = async () => {
    console.log("Checking tomorrow's schedule...");
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0));
      const tomorrowEnd = new Date(tomorrow.setHours(23, 59, 59));
  
      const response = await fetchShifts();
      const shifts = response;
  
      const tomorrowShifts = shifts.filter((shift) => {
        const shiftDate = new Date(shift.date);
        const shiftStart = new Date(shiftDate.setHours(shift.startTime.split(":")[0], shift.startTime.split(":")[1]));
        const shiftEnd = new Date(shiftDate.setHours(shift.endTime.split(":")[0], shift.endTime.split(":")[1]));
        return shiftStart >= tomorrowStart && shiftEnd <= tomorrowEnd;
      });
  
      const tomorrowHours = [];
      for (let i = 0; i < 24; i++) {
        tomorrowHours.push(new Date(tomorrow.setHours(i, 0, 0)));
      }
  
      const coveredHours = [];
      tomorrowShifts.forEach((shift) => {
        const shiftDate = new Date(shift.date);
        const shiftStart = new Date(shiftDate.setHours(shift.startTime.split(":")[0], shift.startTime.split(":")[1]));
        const shiftEnd = new Date(shiftDate.setHours(shift.endTime.split(":")[0], shift.endTime.split(":")[1]));
        for (let i = 0; i < tomorrowHours.length; i++) {
          if (tomorrowHours[i] >= shiftStart && tomorrowHours[i] < shiftEnd) {
            coveredHours.push(tomorrowHours[i]);
          }
        }
      });
  
      const uncoveredHours = tomorrowHours.filter((hour) => !coveredHours.includes(hour));
  
      if (uncoveredHours.length > 0) {
        setNotification({
          type: "error",
          message: "Tomorrow's schedule is not fully covered. Please review and assign nurses to the following hours:",
          hours: uncoveredHours,
        });
      } else {
        setNotification(null);
      }
    } catch (error) {
      console.error("Error checking tomorrow's schedule:", error);
    }
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
    const filteredNurses = nurses.filter((nurse) => {
      const existingShifts = shifts.filter((shift) => shift.nurseId === nurse._id);
      return !existingShifts.some((shift) => shift.date === e.target.value);
    });
    setFilteredNurses(filteredNurses);
  };

  const handleStartTimeChange = (e) => {
    setSelectedStartTime(e.target.value);
    const filteredNurses = nurses.filter((nurse) => {
      const existingShifts = shifts.filter((shift) => shift.nurseId === nurse._id);
      return !existingShifts.some((shift) => shift.startTime === e.target.value && shift.endTime === selectedEndTime);
    });
    setFilteredNurses(filteredNurses);
  };
  const handleCloseNotification = () => {
    setNotification(null);
  };
  const handleEndTimeChange = (e) => {
    setSelectedEndTime(e.target.value);
    const filteredNurses = nurses.filter((nurse) => {
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
  // useEffect(() => {
  //   checkTomorrowSchedule();
  // }, []);
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={checkTomorrowSchedule}>Check Tomorrow's Schedule</button>
      {notification && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "red",
          color: "white",
          padding: "10px",
          textAlign: "center",
        }}
      >
        {notification.message}
        <ul>
          {notification.hours.map((hour, index) => (
            <li key={index}>{hour.toLocaleTimeString()}</li>
          ))}
        </ul>
        <button onClick={handleCloseNotification}>Close</button>
      </div>
    )}
   
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
                  <button onClick={() => handleUpdateShift(shift)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {selectedShift && (
        <form onSubmit={handleUpdateShiftSubmit}>
          <h2>Update Shift</h2>
    
          <p>
            {selectedShift.nurseId.firstName} {selectedShift.nurseId.lastName}
          
          <input
            type="date"
            value={selectedShift.date}
            onChange={(e) => setSelectedShift({ ...selectedShift, date: e.target.value })}
          />
          <input
            type="time"
            value={selectedShift.startTime}
            onChange={(e) => setSelectedShift({ ...selectedShift, startTime: e.target.value })}
          />
          <input
            type="time"
            value={selectedShift.endTime}
            onChange={(e) => setSelectedShift({ ...selectedShift, endTime: e.target.value })}
          />
          <button type="submit">Update Shift</button>
          </p>
        </form>
        
)}
    </div>
  );
};

export default AdminDashboard;