import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login } = useAuth(); // Use the `login` function from AuthContext
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      console.log('Response Data:', response.data.user.id);

      // Save token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('nurseId', response.data.user.id);
      console.log('Nurse ID stored in local storage:', localStorage.getItem('nurseId'));

      localStorage.setItem('user', JSON.stringify(response.data.user)); // Use 'user' instead of 'nurse'

      // Update the user state in AuthContext
      login(response.data.user); // Pass the user data to the `login` function
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  // Redirect based on role after the user state is updated
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/nurse-dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;