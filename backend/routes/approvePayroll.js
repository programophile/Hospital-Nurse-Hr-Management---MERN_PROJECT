import { Router } from 'express';
import Payroll from '../models/Payroll.js';
const router = Router();

// Approve Payroll Entry
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log('Approving payroll entry:', id);
        const updatedPayroll = await Payroll.findByIdAndUpdate(id, { status: 'Payment Completed' }, { new: true });
        if (!updatedPayroll) {
            return res.status(404).json({ message: 'Payroll entry not found' });
        }
        res.status(200).json({ message: 'Payroll entry approved successfully', updatedPayroll });
    } catch (error) {
        res.status(400).json({ message: 'Error approving payroll entry', error: error.message });
    }
});

export default router;
