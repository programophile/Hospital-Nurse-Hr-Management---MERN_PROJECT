// frontend/src/api.js
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
  export const fetchShifts = async (nurseId) => {
    try {
      const response = await axios.get(`${API_URL}/shifts?nurseId=${nurseId}`);
      const shifts = response.data;
      const nursePromises = shifts.map((shift) => {
        console.log('nurseIdCHECK:', shift.nurseId._id);
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
export const createShift = (shift) => axios.post(`${API_URL}/shifts`, shift);
export const fetchLeaves = () => axios.get(`${API_URL}/leaves`);
export const createLeave = (leave) => axios.post(`${API_URL}/leaves`, leave);
export const fetchPayrolls = () => axios.get(`${API_URL}/payrolls`);
export const createPayroll = (payroll) => axios.post(`${API_URL}/payrolls`, payroll);
export const deleteShift = (shiftId) => axios.delete(`${API_URL}/shifts/${shiftId}`);