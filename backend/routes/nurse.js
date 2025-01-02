import { Router } from 'express';
import Nurse from '../models/Nurse.js';
import multer from 'multer';
import authMiddleware from '../routes/authMiddleware.js'; // Import the middleware
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer to preserve the file extension
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname); // Get the file extension
    cb(null, Date.now() + fileExtension); // Save with a unique name and original extension
  }
});

const upload = multer({ storage: storage });

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

// Update Nurse Profile
router.put('/:id', upload.single('profilePicture'), async (req, res) => {
  const { id } = req.params;
  const { specialty, educationInstitution } = req.body;
  const profilePicture = req.file ? req.file.path.replace(/\\/g, '/') : null; // Normalize path

  try {
    const nurse = await Nurse.findById(id);
    if (!nurse) {
      return res.status(404).json({ message: 'Nurse not found' });
    }

    // Delete the previous profile picture if it exists
    if (nurse.profilePicture) {
      const previousImagePath = path.join(__dirname, '..', nurse.profilePicture);
      if (fs.existsSync(previousImagePath)) {
        fs.unlinkSync(previousImagePath); // Delete the file
      }
    }

    // Update the nurse's profile
    nurse.specialty = specialty;
    nurse.educationInstitution = educationInstitution;
    if (profilePicture) {
      nurse.profilePicture = profilePicture;
    }

    await nurse.save();

    res.json({
      message: 'Profile updated successfully',
      nurse: {
        ...nurse.toObject(),
        profilePicture: `http://localhost:5000/${profilePicture}` // Return the full URL
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get Nurse Profile
router.get('/me', authMiddleware, async (req, res) => {
    try {
      const nurse = req.user; // Use the user object from the middleware
      res.status(200).json(nurse);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
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

// Update Nurse Profile (alternative route)
router.put('/:id', upload.single('profilePicture'), async (req, res) => {
    const { id } = req.params;
    const { specialty, educationInstitution } = req.body;
    const profilePicture = req.file ? req.file.path : null; // Get the uploaded file path
  
    try {
      const updateData = { specialty, educationInstitution };
      if (profilePicture) {
        updateData.profilePicture = profilePicture; // Add profile picture URL if uploaded
      }
  
      const updatedNurse = await Nurse.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedNurse) {
        return res.status(404).json({ message: 'Nurse not found' });
      }
      res.status(200).json({ message: 'Profile updated successfully', nurse: updatedNurse });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
});

// Add more routes for updating, deleting, searching, etc.

export default router;