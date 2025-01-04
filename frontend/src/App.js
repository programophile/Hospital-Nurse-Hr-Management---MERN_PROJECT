
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import NurseDashboard from './components/NurseDashboard';
import AdminDashboard from './components/AdminDashboard'; // Import the new component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/nurse-dashboard" element={<NurseDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Add Admin Dashboard route */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;