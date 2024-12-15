// frontend/src/components/Payroll.js
import React, { useState, useEffect } from 'react';
import { fetchPayrolls, createPayroll } from '../api';

const Payroll = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [nurseId, setNurseId] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [salary, setSalary] = useState('');
    const [overtime, setOvertime] = useState('');
    const [deductions, setDeductions] = useState('');

    const loadPayrolls = async () => {
        const response = await fetchPayrolls();
        setPayrolls(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createPayroll({ nurseId, month, year, salary, overtime, deductions });
        loadPayrolls();
        setNurseId('');
        setMonth('');
        setYear('');
        setSalary('');
        setOvertime('');
        setDeductions('');
    };

    useEffect(() => {
        loadPayrolls();
    }, []);

    return (
        <div>
            <h2>Payroll Management</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nurse ID" value={nurseId} onChange={(e) => setNurseId(e.target.value)} required />
                <input type="text" placeholder="Month" value={month} onChange={(e) => setMonth(e.target.value)} required />
                <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
                <input type="number" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} required />
                <input type="number" placeholder="Overtime" value={overtime} onChange={(e) => setOvertime(e.target.value)} />
                <input type="number" placeholder="Deductions" value={deductions} onChange={(e) => setDeductions(e.target.value)} />
                <button type="submit">Add Payroll</button>
            </form>
            <ul>
                {payrolls.map((payroll) => (
                    <li key={payroll._id}>Nurse ID: {payroll.nurseId} - Month: {payroll.month} {payroll.year} - Salary: {payroll.salary}</li>
                ))}
            </ul>
        </div>
    );
};

export default Payroll;