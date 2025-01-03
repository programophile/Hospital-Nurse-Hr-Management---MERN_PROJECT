import { Router } from 'express';
import Payroll from '../models/Payroll.js'; // Correctly import the Payroll model
import Nurse from '../models/Nurse.js'; // Correctly import the Nurse model
const router = Router();

// Create Payroll Entry
router.post('/', async (req, res) => {
    const { nurseId, month, year, salary, overtime, deductions } = req.body;
    console.log('Request Body:', req.body);


    try {
        console.log('Received nurseId:', nurseId);
        // Check if nurseId exists in the database
        const nurse = await Nurse.findById(nurseId);
        if (!nurse) {
            return res.status(404).json({ message: 'Nurse not found'});
        }

        // Create new payroll entry
        const payroll = new Payroll({
            nurseId,
            month,
            year,
            salary,
            overtime,
            deductions,
        });

        // Save payroll entry
        await payroll.save();
        res.status(201).json({ message: 'Payroll entry created successfully', payroll });
    } catch (error) {
        res.status(400).json({ message: 'Error creating payroll entry', error: error.message });
    }
});

// Get Payroll History
router.get('/', async (req, res) => {
    console.log('Fetching payroll history');
    try {
        // Fetch payroll entries and populate nurseId to get the user's full name
        const payrolls = await Payroll.find().populate('nurseId', 'firstName lastName');
        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payroll history', error: error.message });
    }
});

// Get Payrolls by User ID
router.get('/user/:userId', async (req, res) => {
    console.log('Fetching payrolls for user');
    try {
        const { userId } = req.params;
        const payrolls = await Payroll.find({ nurseId: userId });
        res.status(200).json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user payrolls', error: error.message });
    }
});

// Update Payroll Entry
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

// Delete Payroll Entry
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

// Import pdfGenerator
import { generatePayslipPDF } from '../utils/pdfGenerator.js';

// Payslip Download Endpoint
router.get('/payslip/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { month, year } = req.query;

        // Find the payroll record
        const payroll = await Payroll.findOne({ 
            nurseId: userId,
            month,
            year
        }).populate('nurseId', 'firstName lastName');

        if (!payroll) {
            return res.status(404).json({ message: 'Payroll record not found' });
        }

        // Generate PDF
        const pdfBuffer = await generatePayslipPDF(payroll);

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=payslip_${month}_${year}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating payslip:', error);
        res.status(500).json({ message: 'Error generating payslip', error: error.message });
    }
});

export default router;
