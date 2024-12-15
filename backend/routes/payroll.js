// backend/routes/payroll.js
import { Router } from 'express';
import Payroll from '../models/Payroll.js'; // Correctly import the Payroll model
const router = Router();

// Create Payroll Entry
router.post('/', async (req, res) => {
    const payroll = new Payroll(req.body);
    try {
        await payroll.save();
        res.status(201).json({ message: 'Payroll entry created successfully', payroll });
    } catch (error) {
        res.status(400).json({ message: 'Error creating payroll entry', error: error.message });
    }
});

// Get Payroll History
router.get('/', async (req, res) => {
    try {
        const payrolls = await Payroll.find().populate('nurseId'); // Use Payroll.find() here
        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payroll history', error: error.message });
    }
});

// Example for updating a payroll entry
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedPayroll = await Payroll.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPayroll) {
            return res.status(404).json({ message: 'Payroll entry not found' });
        }
        res.status(200).json({ message: 'Payroll entry updated successfully', updatedPayroll });
    } catch (error) {
        res.status(400).json({ message: 'Error updating payroll entry', error: error.message });
    }
});

// Example for deleting a payroll entry
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPayroll = await Payroll.findByIdAndDelete(id);
        if (!deletedPayroll) {
            return res.status(404).json({ message: 'Payroll entry not found' });
        }
        res.status(200).json({ message: 'Payroll entry deleted successfully', deletedPayroll });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payroll entry', error: error.message });
    }
});

export default router;