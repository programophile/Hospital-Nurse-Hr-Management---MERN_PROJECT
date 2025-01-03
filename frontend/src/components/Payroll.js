
import React, { useState, useEffect } from 'react';
import { fetchPayrolls, createPayroll, updatePayroll, deletePayroll, fetchNurses } from '../api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Navbar from './Navbar';  // Import the Navbar component
import './Payroll.css';

const Payroll = () => {
    const navigate = useNavigate(); // Add useNavigate for redirection

    // Check if user is logged in
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login'); // Redirect to login if user is not logged in
        }
    }, []);
    const [payrolls, setPayrolls] = useState([]);
    const [nurseId, setNurseId] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [salary, setSalary] = useState('');
    const [overtime, setOvertime] = useState('');
    const [deductions, setDeductions] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null); // Added state for user info
    const [nurses, setNurses] = useState([]); // State to hold list of nurses
    const [filteredPayrolls, setFilteredPayrolls] = useState([]); // State to hold filtered payrolls

    // Fetch user info and list of nurses on component mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            setNurseId(storedUser._id); // Set the Nurse ID from the user info
        }

        // Set the default month and year to the current values
        const currentDate = new Date();
        setMonth(currentDate.getMonth() + 1); // Months are 0-indexed, so adding 1
        setYear(currentDate.getFullYear()); // Current year

        // Fetch list of nurses for admin
        if (storedUser && storedUser.role === 'admin') {
            fetchNurses().then((response) => {
                setNurses(response.data);
            }).catch((error) => {
                console.error('Error fetching nurses:', error);
            });
        }
    }, []);

    const loadPayrolls = async () => {
        setLoading(true);
        try {
            const response = await fetchPayrolls();
            setPayrolls(response.data);

            // If the user is not an admin, filter payrolls to show only their own records
            if (user && user.role !== 'admin') {
                const filtered = response.data.filter((payroll) => payroll.nurseId.toString() === nurseId.toString());
                setFilteredPayrolls(filtered);
            } else {
                setFilteredPayrolls(response.data); // Admin can see all payrolls
            }
        } catch (error) {
            console.error('Error fetching payrolls:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const monthName = monthNames[parseInt(month, 10) - 1]; // Convert month number to month name

        try {
            const response = await createPayroll({
                nurseId,
                month: monthName, // Use month name instead of number
                year: parseInt(year, 10),
                salary: parseFloat(salary),
                overtime: parseFloat(overtime),
                deductions: parseFloat(deductions),
            });
            loadPayrolls();
            // Reset form fields
            setMonth('');
            setYear('');
            setSalary('');
            setOvertime('');
            setDeductions('');
        } catch (error) {
            console.error('Error creating payroll:', error);
        }
    };

    const handleUpdatePayroll = async (payrollId) => {
        try {
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const monthName = monthNames[parseInt(month, 10) - 1]; // Convert month number to month name

            const response = await updatePayroll(payrollId, {
                nurseId,
                month: monthName,
                year: parseInt(year, 10),
                salary: parseFloat(salary),
                overtime: parseFloat(overtime),
                deductions: parseFloat(deductions),
            });

            loadPayrolls(); // Refresh payrolls after update
        } catch (error) {
            console.error('Error updating payroll:', error);
        }
    };

    const handleDeletePayroll = async (payrollId) => {
        try {
            await deletePayroll(payrollId);
            loadPayrolls(); // Refresh payrolls after delete
        } catch (error) {
            console.error('Error deleting payroll:', error);
        }
    };

    useEffect(() => {
        loadPayrolls();
    }, [user]); // Re-fetch payrolls whenever the user data changes

    const handleFilterChange = () => {
        // Filter payroll records by selected month and year for non-admin users
        if (user && user.role !== 'admin') {
            const filtered = payrolls.filter((payroll) => 
                payroll.nurseId.toString() === nurseId.toString() &&
                payroll.month === month &&
                payroll.year === parseInt(year, 10)
            );
            setFilteredPayrolls(filtered);
        }
    };

    return (
        <div className="payroll-container">
            <h2 className="title">Payroll Management</h2>
            <form onSubmit={handleSubmit} className="payroll-form">
                {/* Display user info */}
                <input
                    type="text"
                    placeholder="User"
                    value={user ? `${user.firstName} ${user.lastName}` : 'Loading...'} // Display user name or loading message
                    disabled
                    className="input-field"
                />

                {/* Admin can select a nurse */}
                {user && user.role === 'admin' && (
                    <select
                        value={nurseId}
                        onChange={(e) => setNurseId(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Nurse</option>
                        {nurses.map((nurse) => (
                            <option key={nurse._id} value={nurse._id}>
                                {nurse.firstName} {nurse.lastName}
                            </option>
                        ))}
                    </select>
                )}

                <input
                    type="number"
                    placeholder="Month"
                    value={month}
                    onChange={(e) => {
                        setMonth(e.target.value);
                        handleFilterChange();
                    }}
                    required
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                        handleFilterChange();
                    }}
                    required
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    required
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Overtime"
                    value={overtime}
                    onChange={(e) => setOvertime(e.target.value)}
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Deductions"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="input-field"
                />
                <button type="submit" className="submit-btn">Add Payroll</button>
            </form>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <ul className="payroll-list">
                    {filteredPayrolls.length > 0 ? (
                        filteredPayrolls.map((payroll) => (
                            <li key={payroll._id} className="payroll-item">
                                <p><strong>Nurse Name:</strong> {payroll.nurseId ? `${payroll.nurseId.firstName} ${payroll.nurseId.lastName}` : 'N/A'}</p>
                                <p><strong>Month:</strong> {payroll.month} {payroll.year}</p>
                                <p><strong>Salary:</strong> ${payroll.salary}</p>
                                {payroll.overtime && <p><strong>Overtime:</strong> ${payroll.overtime}</p>}
                                {payroll.deductions && <p><strong>Deductions:</strong> ${payroll.deductions}</p>}

                                {/* Admin can update or delete payroll */}
                                {user && user.role === 'admin' && (
                                    <>
                                        <button onClick={() => handleUpdatePayroll(payroll._id)} className="update-btn">Update</button>
                                        <button onClick={() => handleDeletePayroll(payroll._id)} className="delete-btn">Delete</button>
                                    </>
                                )}
                            </li>
                        ))
                    ) : (
                        <li>No payroll records found.</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Payroll;