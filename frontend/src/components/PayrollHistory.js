import React, { useState, useEffect } from 'react';
import { fetchUserPayrolls } from '../api';
import { useNavigate } from 'react-router-dom';
import './PayrollHistory.css';

const PayrollHistory = () => {
    const navigate = useNavigate();
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(storedUser);

        if (storedUser && storedUser.id) {
            loadPayrolls();
        }
    }, [navigate]);

    const loadPayrolls = async () => {
        const currentUser = user || JSON.parse(localStorage.getItem('user'));
        if (!currentUser || !currentUser.id) {
            setError('User information is not available');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetchUserPayrolls(currentUser.id);
            setPayrolls(response.data);
        } catch (error) {
            console.error('Error fetching payroll history:', error);
            setError('Failed to load payroll history. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPayrolls = payrolls.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="payroll-container">
            <h2 className="title">Payroll History</h2>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <table className="payroll-table">
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Base Salary</th>
                                <th>Overtime</th>
                                <th>Deductions</th>
                                <th>Net Pay</th>
                                <th>Status</th> {/* Added Status Column */}
                            </tr>
                        </thead>
                        <tbody>
                            {payrolls.length > 0 ? (
                                payrolls.map((payroll) => (
                                    <tr key={payroll._id}>
                                        <td>{payroll.month} {payroll.year}</td>
                                        <td>${payroll.salary.toLocaleString()}</td>
                                        <td>${payroll.overtime.toLocaleString()}</td>
                                        <td>${payroll.deductions.toLocaleString()}</td>
                                        <td>${(payroll.salary + payroll.overtime - payroll.deductions).toFixed(2)}</td>
                                        <td>{payroll.status || 'Pending'}</td> {/* Display Status */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-records">
                                        No payroll records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default PayrollHistory;
