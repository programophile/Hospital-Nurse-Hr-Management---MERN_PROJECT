import { Router } from 'express';
import Leave from '../models/Leave.js'; // Correctly import the Leave model
import Nurse from '../models/Nurse.js'; // Correctly import the Nurse model
const router = Router();

// Create Leave Request
router.post ('/', async (req, res) => {
    const { nurseId, startDate, endDate, reason } = req.body;
    console.log('Request Body:', req.body);
    //if (!nurseId || !startDate || !endDate) {
        //return res.status(400).json({ message: 'Nurse ID, start date, and end date are required.' });
    try {
        if (!nurseId) {
            return res.status(400).json({ message: 'Nurse ID is required.' });
        }
        console.log('Received nurseId:', nurseId);
        // Check if nurseId exists in the database
        const nurse = await Nurse.findById(nurseId);
        //const firstName =await Nurse.firstName;
        //const lastName =await Nurse.lastName;
        if (!nurse) {
            return res.status(404).json({ message: 'Nurse not found'});
        }
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required.' });
        }
        if (!reason) {
            return res.status(400).json({ message: 'Reason is required.' });
        }
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }
        if (parsedStartDate >= parsedEndDate) {
            console.log('Start date must be before end date');
            return res.status(400).json({ message: 'Start date must be before end date' });
        }

   // const leave = new Leave(req.body);
    const leave = new Leave({
        nurseId,
        firstName,
        lastName,
        startDate,
        endDate,
        reason,
        status: 'Pending',
    });
        await leave.save();
        res.status(201).json({ message: 'Leave request created successfully', leave });
    } catch (error) {
         res.status(400).json({ message: 'Error creating leave request', error: error.message });
    }
});
// Get All Leave Requests
router.get('/', async (req, res) => {
    try {
    console.log('Leaves array hiih', leaves);
      const leaves = await Leave.find().populate({
        path: 'nurseId',
        model: Nurse,
        select: 'firstName'
      });
      console.log('Leaves array', leaves);
       // Populate nurseId with firstName and lastName
      res.status(200).json(leaves);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching leave requests', error: error.message });
    }
  });

// Add more routes for updating, deleting, etc.
// Example for updating a leave request
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         const updatedLeave = await Leave.findByIdAndUpdate(id, req.body, { new: true });
//         if (!updatedLeave) {
//             return res.status(404).json({ message: 'Leave request not found' });
//         }
//         res.status(200).json({ message: 'Leave request updated successfully', updatedLeave });
//     } catch (error) {
//         res.status(400).json({ message: 'Error updating leave request', error: error.message });
//     }
// });

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
// Add this route to your existing Leave.js file

// Add this route to your existing Leave.js file

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const updatedLeave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
      if (!updatedLeave) {
        return res.status(404).json({ message: 'Leave request not found' });
      }
      res.status(200).json(updatedLeave);
    } catch (error) {
      console.error('Error updating leave status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
export default router;
