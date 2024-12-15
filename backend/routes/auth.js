import { Router } from 'express';
import Nurse from '../models/Nurse.js';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

const router = Router();

router.post('/register', async (req, res) => {
  try {
    console.log('Received Registration Data:', req.body);
    
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      employeeId, 
      department,
      contactNumber 
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !employeeId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Additional detailed logging
    console.log('Attempting to create nurse with email:', email);

    // Create new nurse
    const nurse = new Nurse({
      firstName,
      lastName,
      email,
      password,
      employeeId,
      department,
      contactNumber
    });

    // Save the nurse
    const savedNurse = await nurse.save();

    console.log('Nurse saved successfully:', savedNurse);

    res.status(201).json({ 
      message: 'Nurse registered successfully',
      nurseId: savedNurse._id 
    });
  } catch (error) {
    console.error('Full Registration Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      // Log any additional error properties
      code: error.code,
      errors: error.errors
    });

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate key error',
        duplicateField: Object.keys(error.keyValue)[0]
      });
    }

    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
});
// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find nurse
    const nurse = await Nurse.findOne({ email });
    if (!nurse) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await nurse.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = sign(
      { 
        id: nurse._id, 
        email: nurse.email,
        role: nurse.role 
      }, 
      process.env.JWT_SECRET || 'your_jwt_secret', 
      { expiresIn: '1h' }
    );

    res.json({
      token,
      nurse: {
        id: nurse._id,
        firstName: nurse.firstName,
        lastName: nurse.lastName,
        email: nurse.email,
        role: nurse.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

export default router;