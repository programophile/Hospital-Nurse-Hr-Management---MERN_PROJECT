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
    logout(); // Use the logout function from context
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
  };

  return (
    <nav>
      <div className="navbar">
        <Link to="/">Home</Link>
        <Link to="/payrolls">Payroll</Link>
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
          {!user && <Link to="/login">Login</Link>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
