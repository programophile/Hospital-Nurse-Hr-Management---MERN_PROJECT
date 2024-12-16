// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { fetchNurses, createShift } from '../api'; // Import necessary API functions

const AdminDashboard = () => {
    const [nurses, setNurses] = useState([]);
    const [nurseId, setNurseId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const loadNurses = async () => {
        const response = await fetchNurses();
        setNurses(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createShift({ nurseId, date, startTime, endTime });
        // Optionally, you can reload the nurses or shifts here
        setNurseId('');
        setDate('');
        setStartTime('');
        setEndTime('');
    };

    useEffect(() => {
        loadNurses();
    }, []);

    return (
        <div>
            <h2>Admin Dashboard</h2>
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
        </div>
    );
};

export default AdminDashboard;