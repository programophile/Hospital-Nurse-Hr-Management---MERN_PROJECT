import jwt from 'jsonwebtoken';
import Payroll from '../models/Payroll.js';

const nursePayrollMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded; // Attach user data (id, role, etc.) to the request object

    const { role, id } = decoded;

    // Allow admins to proceed without restriction
    if (role === 'admin') {
      return next();
    }

    // For nurses, ensure access is limited to their payroll entries
    const payrollId = req.params.id; // Payroll ID from the request (if applicable)
    if (payrollId) {
      const payroll = await Payroll.findById(payrollId);

      if (!payroll) {
        return res.status(404).json({ message: 'Payroll entry not found' });
      }

      // Check if the logged-in nurse owns the payroll entry
      if (payroll.nurseId.toString() !== id) {
        return res.status(403).json({ message: 'Forbidden: Access to this payroll is not allowed' });
      }
    }

    next();
  } catch (error) {
    console.error('Payroll Middleware Error:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default nursePayrollMiddleware;
