// attendance.js
import { Router } from 'express';
import Attendance from '../models/Attendance.js';
import Nurse from '../models/Nurse.js';
import mongoose from 'mongoose';

const router = Router();

// attendance.js
router.get('/:nurseId', async (req, res) => {
    try {
        const nurseId = req.params.nurseId;
        const attendanceHistory = await Attendance.find({ nurseId: nurseId });
        const totalAttendance = await Attendance.countDocuments({ nurseId: nurseId });
        res.json({ attendanceHistory, totalAttendance });
    } catch (error) {
        console.error('Error fetching attendance history:', error);
        res.status(500).json({ message: 'Failed to load attendance history' });
    }
});
// Mark attendance
router.post('/', async (req, res) => {
    const { nurseId } = req.body;
    
    console.log('Received request body:', req.body); // Debug log

    // Validate nurseId
    if (!nurseId) {
        return res.status(400).json({ message: 'Nurse ID is required' });
    }

    // Validate if nurseId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(nurseId)) {
        return res.status(400).json({ message: 'Invalid Nurse ID format' });
    }

    try {
        // Validate nurse exists
        const nurse = await Nurse.findById(nurseId);
        console.log('Found nurse:', nurse); // Debug log

        if (!nurse) {
            return res.status(404).json({ message: 'Nurse not found' });
        }

        // Check for existing attendance
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingAttendance = await Attendance.findOne({
            nurseId,
            date: {
                $gte: today,
                $lt: tomorrow
            }
        });

        console.log('Existing attendance:', existingAttendance); // Debug log

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        // Create new attendance record
        const attendance = new Attendance({
            nurseId,
            date: new Date(),
            status: 'Present'
        });

        await attendance.save();
        console.log('New attendance saved:', attendance); // Debug log

        // Get total attendance count
        const totalAttendance = await Attendance.countDocuments({ nurseId });

        res.status(201).json({
            message: 'Attendance marked successfully',
            attendance,
            totalAttendance
        });

    } catch (error) {
        console.error('Detailed error:', error); // Debug log
        res.status(500).json({ 
            message: 'Error marking attendance', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router;