import React, { useState, useEffect } from 'react';
import { fetchPayrolls, fetchNurses } from '../api';
import { useNavigate } from 'react-router-dom'; 
import Navbar from './Navbar';  
import './Payroll.css';

const Payroll = () => {
    const navigate = useNavigate(); 

    // Check if user is logged in
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login'); 
        }
    }, []);

    const [payrolls, setPayrolls] = useState([]);
    const [user, setUser] = useState(null); 
    const [nurses, setNurses] = useState([]); 

    // Fetch user info and list of nurses on component mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }

        if (storedUser && storedUser.role === 'admin') {
            fetchNurses().then((response) => {
                setNurses(response.data);
            }).catch((error) => {
                console.error('Error fetching nurses:', error);
            });
        }
    }, []);

    const loadPayrolls = async () => {
        try {
            const response = await fetchPayrolls();
            setPayrolls(response.data);
        } catch (error) {
            console.error('Error fetching payrolls:', error);
        }
    };

    useEffect(() => {
        loadPayrolls();
    }, [user]);

    const handleApprovePayroll = (payrollId) => {
        console.log('Approving payroll:', payrollId);
        fetch(`http://localhost:5000/api/payroll/approve/${payrollId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'Payment Completed' }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to approve payroll');
            }
            return response.json();
        })
        .then(data => {
            console.log('Payroll approved:', data);
            loadPayrolls(); // Refresh the payrolls after approval
        })
        .catch(error => {
            console.error('Error approving payroll:', error);
        });
    };

    return (
        <div className="payroll-container">
            <h2 className="title">Payroll Management</h2>

            {payrolls.length > 0 ? (
                <ul className="payroll-list">
                    {payrolls.map((payroll) => (
                        <li key={payroll._id} className="payroll-item">
                            <p><strong>Nurse Name:</strong> {payroll.nurseId ? `${payroll.nurseId.firstName} ${payroll.nurseId.lastName}` : 'N/A'}</p>
                            <p><strong>Month:</strong> {payroll.month} {payroll.year}</p>
                            <p><strong>Salary:</strong> ${payroll.salary}</p>
                            {payroll.overtime && <p><strong>Overtime:</strong> ${payroll.overtime}</p>}
                            {payroll.deductions && <p><strong>Deductions:</strong> ${payroll.deductions}</p>}
                            <p><strong>Status:</strong> {payroll.status}</p> {/* Display the status here */}

                            {/* Admin can approve payroll */}
                            {user && user.role === 'admin' && (
                                <button onClick={() => handleApprovePayroll(payroll._id)} className="approve-btn">Payment Completion</button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No payroll records found.</p>
            )}
        </div>
    );
};

export default Payroll;
