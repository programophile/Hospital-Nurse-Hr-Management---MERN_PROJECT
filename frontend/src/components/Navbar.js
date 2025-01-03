import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import CSS for styling

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false); // Keep this line for mobile menu state
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      // This function can be used to update the user state if needed
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?"); 
    if (confirmLogout) {
        logout(); // Use the logout function from context
        navigate('/login');
    }
    // Redundant navigation removed
  };

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
  };

  return (
    <nav>
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/payrolls">Payroll</Link>

        <Link to="/payroll-history">Payroll History</Link>
        <Link to="/payslip-download">Download Payslip</Link>

        <Link to="/leave-request">Leave Request</Link> {/* Add this line */}

        <Link to="/attendance">Attendance</Link> {/* Add this line */}

        {user && (
          <>
            <span>Welcome, {user.firstName} {user.lastName}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {!user && <Link to="/login">Login</Link>}
      </div>
      <button className="hamburger" onClick={toggleMobileMenu}>
        ☰
      </button>
      {isMobile && (
        <div className="mobile-menu">
          <Link to="/">Home</Link>
          <Link to="/payrolls">Payroll</Link>
          <Link to="/payslip-download">Download Payslip</Link>
          {!user && <Link to="/login">Login</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
