import React, { useEffect, useState } from 'react';
import { fetchShifts } from '../api'; // Assuming you have an API function to fetch shifts

const NurseDashboard = () => {
    const [shifts, setShifts] = useState([]);

    const loadShifts = async () => {
        try {
            const response = await fetchShifts(); // Fetch shifts from your API
            setShifts(response.data);
        } catch (error) {
            console.error('Error fetching shifts:', error);
        }
    };

    useEffect(() => {
        loadShifts();
    }, []);

    return (
        <div>
            <h2>Nurse Dashboard</h2>
            <h3>Your Shifts</h3>
            <ul>
                {shifts.map((shift) => (
                    <li key={shift._id}>
                        Date: {shift.date} - {shift.startTime} to {shift.endTime}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NurseDashboard;