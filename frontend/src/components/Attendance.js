import React, { useState, useEffect } from 'react';
import { markAttendance, fetchAttendanceHistory } from '../api'; // You'll need to create these API functions
import '../leave.css'; // Reusing the existing CSS file
//import { Link, useNavigate } from 'react-router-dom';
const Attendance = () => {
    const [user, setUser] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [totalAttendance, setTotalAttendance] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [hasMarkedToday, setHasMarkedToday] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            loadAttendanceHistory(storedUser.id);
            checkTodayAttendance(storedUser.id);
        }
    }, []);
console.log('heheheh',totalAttendance)
const loadAttendanceHistory = async (nurseId) => {
    try {
        const response = await fetchAttendanceHistory(nurseId);
        console.log('Attendance history response:', response); // Add this log
        setTotalAttendance(response.totalAttendance);
        setAttendanceHistory(response.attendanceHistory);
        
    } catch (error) {
        console.error('Error fetching attendance history:', error);
    }
};

    const checkTodayAttendance = (nurseId) => {
        const today = new Date().toDateString();
        const todayAttendance = attendanceHistory.find(
            record => new Date(record.date).toDateString() === today
        );
        setHasMarkedToday(!!todayAttendance);
    };

    const handleMarkAttendance = async () => {
        if (!user) {
            setErrorMessage('Please log in to mark attendance');
            return;
        }
    
        try {
            setLoading(true);
            console.log('User data being sent:', user); // Add this log
            const response = await markAttendance({ nurseId: user.id });
            console.log('Response from server:', response); // Add this log
            setSuccessMessage('Attendance marked successfully!');
            setHasMarkedToday(true);
            await loadAttendanceHistory(user.id);
        } catch (error) {
            console.error('Detailed error:', error.response?.data || error); // More detailed error logging
            setErrorMessage('Error marking attendance. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="attendance-container">
            <h2>Attendance System</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            {user ? (
                <div className="attendance-content">
                    <div className="attendance-info">
                        <p>Welcome, {user.firstName} {user.lastName}</p>
                        <p>Total Attendance: {totalAttendance} days</p>
                    </div>

                    <div className="attendance-action">
                        <button 
                            onClick={handleMarkAttendance}
                            disabled={hasMarkedToday}
                            className={hasMarkedToday ? 'disabled' : ''}
                        >
                            {hasMarkedToday ? 'Attendance Already Marked' : 'Mark Today\'s Attendance'}
                        </button>
                    </div>

                    <div className="attendance-history">
                        <h3>Attendance History</h3>
                        <ul>
                            {attendanceHistory.map((record) => (
                                <li key={record._id} className="attendance-record">
                                    <span>{new Date(record.date).toLocaleDateString()}</span>
                                    <span className="status present">Present</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <p>Please log in to access the attendance system.</p>
            )}
        </div>
    );
};

export default Attendance;