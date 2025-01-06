import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false); // State for mobile menu
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to track route changes

  // Update dynamically on route change or user state change
  useEffect(() => {
    console.log('Route changed:', location.pathname);
  }, [location, user]); // Dependency array includes `location` and `user`

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      logout(); // Log the user out
      navigate('/login'); // Redirect to login page
    }
  };

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
  };

  return (
    <nav>
      <div className="navbar">
        <Link to={user && user.role === 'admin' ? "/admin-dashboard" : "/nurse-dashboard"}>Home</Link>
        {user && user.role === 'admin' && <Link to="/payrolls">Payroll</Link>}
        {user && user.role === 'admin' && <Link to="/admin-payroll">Confirm Payroll</Link>}

        {user && user.role === 'nurse' && <Link to="/payroll-history">Payroll History</Link>}
    
        
        {user && user.role === 'nurse' && <Link to="/attendance">Attendance</Link>}
        {user && user.role === 'nurse' && <Link to="/payslip-download">Download Payslip</Link>}
        {/* <Link to="/payroll-history">Payroll History</Link> */}
        {/* <Link to="/payslip-download">Download Payslip</Link> */}
        {user && user.role === 'nurse' && <Link to="/leave-request">Leave Request</Link>} 
        {user && user.role === 'admin' && <Link to="/admin-leave-handle">Handle Leave Request</Link>}
        
        

        {user ? (
          <>
            <span><h1>Welcome, {user.firstName} {user.lastName}</h1></span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
      <button className="hamburger" onClick={toggleMobileMenu}>
        ☰
      </button>
      {isMobile && (
        <div className="mobile-menu">
          <Link to={user && user.role === 'admin' ? "/admin-dashboard" : "/nurse-dashboard"}>Home</Link>
          {user && user.role !== 'nurse' && <Link to="/payrolls">Payroll</Link>}
          <Link to="/payslip-download">Download Payslip</Link>
          {!user && <Link to="/login">Login</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;