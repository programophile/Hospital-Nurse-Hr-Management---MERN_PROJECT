import { Router } from 'express';
import Nurse from '../models/Nurse.js';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

const router = Router();

// Registration Route
router.post('/register', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password,  
      department,
      contactNumber,
      role, // Include role in the registration data
      bloodGroup,
      birthday,
      maritalStatus,
      educationInstitution,
      specialty
    } = req.body;
    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let user;
    if (role === 'admin') {
      // Generate the next employee ID for admin
      const employeeId = await Admin.generateEmployeeId();
      user = new Admin({
        firstName,
        lastName,
        email,
        password,
        employeeId,
        department,
        contactNumber,
        role,
        bloodGroup,
        birthday,
        maritalStatus,
        educationInstitution,
        specialty
      });
    } else {
      // Generate the next employee ID for nurse
      const employeeId = await Nurse.generateEmployeeId();
      user = new Nurse({
        firstName,
        lastName,
        email,
        password,
        employeeId,
        department,
        contactNumber,
        role,
        bloodGroup,
        birthday,
        maritalStatus,
        educationInstitution,
        specialty
      });
    }

    // Save the user (admin or nurse)
    const savedUser  = await user.save();

    // Generate JWT
    const token = sign(
      { id: savedUser ._id, email: savedUser .email, role: savedUser .role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      user: {
        id: savedUser ._id,
        firstName: savedUser .firstName,
        lastName: savedUser .lastName,
        email: savedUser .email,
        role: savedUser .role,
        employeeId: savedUser .employeeId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt with email:', email); // Log the login attempt

    // Check if the user is a nurse
    let user = await Nurse.findOne({ email });
    if (!user) {
      // If not a nurse, check if the user is an admin
      user = await Admin.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = sign(
      { 
        id: user._id, 
        email: user.email,
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '1h' }
    );

    res.json({
      token,

      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId

      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

export default router;