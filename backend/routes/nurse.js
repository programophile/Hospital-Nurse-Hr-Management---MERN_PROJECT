import { Router } from 'express';
import Nurse from '../models/Nurse.js';
const router = Router();

// Create Nurse
router.post('/', async (req, res) => {
    const nurse = new Nurse(req.body);
    try {
        await nurse.save();
        res.status(201).send(nurse);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get All Nurses
router.get('/', async (req, res) => {
    try {
        const nurses = await Nurse.find();
        res.status(200).send(nurses);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Add more routes for updating, deleting, searching, etc.

export default router;