

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Payroll from './components/Payroll';
import Navbar from './components/Navbar';
// Placeholder components - create these later
const NurseDashboard = () => <div>Nurse Dashboard</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;

const App = () => {
  return (
    <Router>
       <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/payrolls" element={<Payroll />} />
      </Routes>
    </Router>
  );
};

export default App;