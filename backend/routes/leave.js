import { Router } from 'express';
import Leave from '../models/Leave.js'; // Correctly import the Leave model
const router = Router();

// Create Leave Request
router.post('/', async (req, res) => {
    // Validate request body
    const { nurseId, startDate, endDate, reason } = req.body;
    if (!nurseId || !startDate || !endDate) {
        return res.status(400).json({ message: 'Nurse ID, start date, and end date are required.' });
    }

    const leave = new Leave(req.body);
    try {
        await leave.save();
        res.status(201).json({ message: 'Leave request created successfully', leave });
    } catch (error) {
        res.status(400).json({ message: 'Error creating leave request', error: error.message });
    }
});

// Get All Leave Requests
router.get('/', async (req, res) => {
    try {
        const leaves = await Leave.find().populate('nurseId'); // Use Leave.find() here
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
    }
});

// Add more routes for updating, deleting, etc.
// Example for updating a leave request
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedLeave = await Leave.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedLeave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.status(200).json({ message: 'Leave request updated successfully', updatedLeave });
    } catch (error) {
        res.status(400).json({ message: 'Error updating leave request', error: error.message });
    }
});

// Example for deleting a leave request
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLeave = await Leave.findByIdAndDelete(id);
        if (!deletedLeave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.status(200).json({ message: 'Leave request deleted successfully', deletedLeave });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting leave request', error: error.message });
    }
});

export default router;