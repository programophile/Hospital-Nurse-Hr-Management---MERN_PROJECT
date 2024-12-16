import { Router } from 'express';
import Nurse from '../models/Nurse.js';
import jwt from 'jsonwebtoken';
const { sign } = jwt;

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      employeeId, 
      department,
      contactNumber,
      role // Include role in the registration data
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !employeeId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new nurse/admin
    const nurse = new Nurse({
      firstName,
      lastName,
      email,
      password,
      employeeId,
      department,
      contactNumber,
      role // Set the role
    });

    // Save the nurse/admin
    const savedNurse = await nurse.save();

    // Generate JWT
    const token = sign(
      { id: savedNurse._id, email: savedNurse.email, role: savedNurse.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      nurse: {
        id: savedNurse._id,
        firstName: savedNurse.firstName,
        lastName: savedNurse.lastName,
        email: savedNurse.email,
        role: savedNurse.role
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