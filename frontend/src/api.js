import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchNurses = () => axios.get(`${API_URL}/nurses`);
export const createNurse = (nurse) => axios.post(`${API_URL}/nurses`, nurse);
export const fetchShifts = () => axios.get(`${API_URL}/shifts`);
export const createShift = (shift) => axios.post(`${API_URL}/shifts`, shift);
export const fetchLeaves = () => axios.get(`${API_URL}/leaves`);
export const createLeave = (leave) => axios.post(`${API_URL}/leaves`, leave);
export const fetchPayrolls = () => axios.get(`${API_URL}/payrolls`);
export const createPayroll = (payroll) => axios.post(`${API_URL}/payrolls`, payroll);

export const fetchUserPayrolls = (userId) => 
    axios.get(`${API_URL}/payrolls/user/${userId}`); // Fetch payrolls for a specific user

// New functions for updating and deleting payrolls
export const updatePayroll = (payrollId, payroll) => 
    axios.put(`${API_URL}/payrolls/${payrollId}`, payroll);

export const deletePayroll = (payrollId) => 
    axios.delete(`${API_URL}/payrolls/${payrollId}`);

