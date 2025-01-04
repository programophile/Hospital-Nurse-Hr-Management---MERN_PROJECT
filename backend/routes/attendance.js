// attendance.js
import { Router } from 'express';
import Attendance from '../models/Attendance.js';
import Nurse from '../models/Nurse.js';
import mongoose from 'mongoose';
console.log('Attendance router exported');
const router = Router();

// attendance.js
router.get('/:nurseId', async (req, res) => {
    console.log("Router get for attendance")
    console.log('req.url:', req.url);
    console.log('req.params:', req.params);
    try {
        const nurseId = req.params.nurseId;
        console.log(nurseId)
        const attendanceHistory = await Attendance.find({ nurseId: nurseId });
        const totalAttendance = await Attendance.countDocuments({ nurseId: nurseId });
        res.json({ attendanceHistory, totalAttendance });
    } catch (error) {
        console.error('Error fetching attendance history:', error);
        res.status(500).json({ message: 'Failed to load attendance history' });
    }
});


export default router;