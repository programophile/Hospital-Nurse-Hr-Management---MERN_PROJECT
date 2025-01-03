import jwt from 'jsonwebtoken';
import Nurse from '../models/Nurse.js';
import Admin from '../models/Admin.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    let user;

    // Check if the user is a nurse or admin
    user = await Nurse.findById(decoded.id) || await Admin.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

export default authMiddleware;