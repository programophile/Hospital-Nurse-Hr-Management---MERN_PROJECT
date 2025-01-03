import axios from 'axios';
const API_URL = 'http://localhost:5000/api';
export const fetchNurses = async () => {
    try {
      const response = await axios.get(`${API_URL}/nurses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nurses:', error);
      throw error;
    }
  };
export const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_URL}/nurses/departments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  };
  export const fetchShifts = async () => {
    try {
      const response = await axios.get(`${API_URL}/shifts`);
      const shifts = response.data;
      const nursePromises = shifts.map((shift) => {
        console.log('nurseId:', shift.nurseId._id);
        return axios.get(`${API_URL}/nurses/${shift.nurseId._id}`);
      });
      console.log('nursePromises:', nursePromises);
      
      const nurses = await Promise.all(nursePromises);
      console.log('nurses:', nurses);
      
      const formattedShifts = shifts.map((shift, index) => {
        console.log('shift:', shift);
        console.log('nurses[index].data:', nurses[index].data);
        return {
          ...shift,
          department: nurses[index].data.department,
          date: new Date(shift.date).toLocaleDateString(),
        };
      });
      console.log('formattedShifts:', formattedShifts);
      return formattedShifts;
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw error;
    }
  };


  // frontend/src/api.js
export const updateShift = async (shiftId, shiftData) => {
  try {
    const response = await axios.put(`${API_URL}/shifts/${shiftId}`, shiftData);
    return response.data;
  } catch (error) {
    console.error('Error updating shift:', error);
    throw error;
  }
};

export const fetchNurses = () => axios.get(`${API_URL}/nurses`);
export const createNurse = (nurse) => axios.post(`${API_URL}/nurses`, nurse);
export const fetchShifts = () => axios.get(`${API_URL}/shifts`);

export const createShift = (shift) => axios.post(`${API_URL}/shifts`, shift);
export const fetchLeaves = () => axios.get(`${API_URL}/leaves`);
//export const createLeave = (leave) => axios.post(`${API_URL}/leaves`, leave);
export const fetchPayrolls = () => axios.get(`${API_URL}/payrolls`);
export const createPayroll = (payroll) => axios.post(`${API_URL}/payrolls`, payroll);

export const deleteShift = (shiftId) => axios.delete(`${API_URL}/shifts/${shiftId}`);

export const fetchNurseByUserId = (userId) => {
    return axios.get(`${API_URL}/nurses/user/${userId}`);  };
export const createLeave = (leave) => {
    return axios.post(`${API_URL}/leaves`, leave); // Ensure this matches your backend route
};


export const fetchUserPayrolls = (userId) => 
    axios.get(`${API_URL}/payrolls/user/${userId}`); // Fetch payrolls for a specific user

// Payslip download function
export const downloadPayslip = (userId, month, year) =>
    axios.get(`${API_URL}/payrolls/payslip/${userId}`, {
        params: { month, year },
        responseType: 'blob'
    });

// New functions for updating and deleting payrolls
export const updatePayroll = (payrollId, payroll) => 
    axios.put(`${API_URL}/payrolls/${payrollId}`, payroll);

export const deletePayroll = (payrollId) => 
    axios.delete(`${API_URL}/payrolls/${payrollId}`);

// Add these functions to your existing api/index.js file

export const markAttendance = (data) => {
    try {
        const response = axios.post(`${API_URL}/attendance`, data);
        return response;
    } catch (error) {
        throw error;
    }
};

// api.js
export const fetchAttendanceHistory = async (nurseId) => {
    try {
        const response = await axios.get(`${API_URL}/attendance/${nurseId}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Failed to load attendance history. Status code: ${response.status}`);
        }
    } catch (error) {
        if (error.response) {
            throw new Error(`Failed to load attendance history. Error: ${error.response.data.message}`);
        } else {
            throw new Error(`Failed to load attendance history. Error: ${error.message}`);
        }
    }
};

export const fetchAllAttendance = async () => {
    try {
        const response = await axios.get(`${API_URL}/attendance`);
        return response;
    } catch (error) {
        throw error;
    }
};

