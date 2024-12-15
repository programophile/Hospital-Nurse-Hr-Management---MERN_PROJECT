// backend/routes/shift.js
import { Router } from 'express';
import Shift from '../models/Shift.js'; // Correctly import the Shift model
const router = Router();

// Create Shift
router.post('/', async (req, res) => {
    const shift = new Shift(req.body);
    try {
        await shift.save();
        res.status(201).json({ message: 'Shift created successfully', shift });
    } catch (error) {
        res.status(400).json({ message: 'Error creating shift', error: error.message });
    }
});

// Get All Shifts
router.get('/', async (req, res) => {
    try {
        const shifts = await Shift.find().populate('nurseId'); // Use Shift.find() here
        res.status(200).json(shifts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shifts', error: error.message });
    }
});

// Example for updating a shift
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedShift = await Shift.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedShift) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        res.status(200).json({ message: 'Shift updated successfully', updatedShift });
    } catch (error) {
        res.status(400).json({ message: 'Error updating shift', error: error.message });
    }
});

// Example for deleting a shift
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedShift = await Shift.findByIdAndDelete(id);
        if (!deletedShift) {
            return res.status(404).json({ message: 'Shift not found' });
        }
        res.status(200).json({ message: 'Shift deleted successfully', deletedShift });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting shift', error: error.message });
    }
});

export default router;