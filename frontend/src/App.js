

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';

import NurseDashboard from './components/NurseDashboard';
import AdminPayroll from './components/AdminPayroll'; // Import AdminPayroll component
import AdminDashboard from './components/AdminDashboard';

import Payroll from './components/Payroll';
import PayslipDownload from './components/PayslipDownload';
import PayrollHistory from './components/PayrollHistory';
import Navbar from './components/Navbar';
import LeaveRequest from './components/LeaveRequest'; 
import Attendance from './components/Attendance'; // Add this line
// Placeholder components - create these later
// const NurseDashboard = () => <div>Nurse Dashboard</div>;
// const AdminDashboard = () => <div>Admin Dashboard</div>;


const App = () => {
  return (
    <Router>
       <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Add Admin Dashboard route */}
        <Route path="/" element={<Login />} />

       
        <Route path="/payslip-download" element={<PayslipDownload />} />
        <Route path="/payroll-history" element={<PayrollHistory />} />
        <Route path="/payrolls" element={<Payroll />} />
        <Route path="/admin-payroll" element={<AdminPayroll />} /> {/* Add Admin Payroll route */}
        <Route path="/leave-request" element={<LeaveRequest />} />
        <Route path="/attendance" element={<Attendance />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
};

export default App;