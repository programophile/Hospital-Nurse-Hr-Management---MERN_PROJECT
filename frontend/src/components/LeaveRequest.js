// frontend/src/components/LeaveRequest.js
import React, { useState, useEffect } from 'react';
import { fetchLeaves, createLeave } from '../api';

const LeaveRequest = () => {
    const [leaves, setLeaves] = useState([]);
    const [nurseId, setNurseId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const loadLeaves = async () => {
        const response = await fetchLeaves();
        setLeaves(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createLeave({ nurseId, startDate, endDate, reason });
        loadLeaves();
        setNurseId('');
        setStartDate('');
        setEndDate('');
        setReason('');
    };

    useEffect(() => {
        loadLeaves();
    }, []);

    return (
        <div>
            <h2>Leave Requests</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nurse ID" value={nurseId} onChange={(e) => setNurseId(e.target.value)} required />
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} required />
                <button type="submit">Request Leave</button>
 </form>
            <ul>
                {leaves.map((leave) => (
                    <li key={leave._id}>Nurse ID: {leave.nurseId} - From: {leave.startDate} to {leave.endDate} - Reason: {leave.reason}</li>
                ))}
            </ul>
        </div>
    );
};

export default LeaveRequest;