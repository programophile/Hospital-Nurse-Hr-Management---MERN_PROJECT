// frontend/src/components/ShiftScheduler.js
import React, { useState, useEffect } from 'react';
import { fetchShifts, createShift } from '../api';

const ShiftScheduler = () => {
    const [shifts, setShifts] = useState([]);
    const [nurseId, setNurseId] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

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

    useEffect(() => {
        loadShifts();
    }, []);

    return (
        <div>
            <h2>Shift Scheduler</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nurse ID" value={nurseId} onChange={(e) => setNurseId(e.target.value)} required />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                <button type="submit">Schedule Shift</button>
            </form>
            <ul>
                {shifts.map((shift) => (
                    <li key={shift._id}>Nurse ID: {shift.nurseId} - Date: {shift.date} - {shift.startTime} to {shift.endTime}</li>
                ))}
            </ul>
        </div>
    );
};

export default ShiftScheduler;