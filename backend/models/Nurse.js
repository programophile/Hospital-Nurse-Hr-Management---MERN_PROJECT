// backend/models/Nurse.js
// const mongoose = require('mongoose');

// const NurseSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     qualifications: { type: String },
//     certifications: [{ type: String }],
//     department: { type: String },
//     skills: [{ type: String }],
//     certificationExpiry: { type: Date },
// });

// module.exports = mongoose.model('Nurse', NurseSchema);

import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // Make sure to import bcrypt correctly

const nurseSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true
  },
  department: {
    type: String
  },
  contactNumber: {
    type: String
  },
  role: {
    type: String,
    enum: ['nurse', 'admin'],
    default: 'nurse'
  }
}, { timestamps: true });

// Password hashing middleware
nurseSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash the password directly using bcrypt
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare passwords
nurseSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Nurse = mongoose.model('Nurse', nurseSchema);

export default Nurse;