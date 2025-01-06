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
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String },
  contactNumber: { type: String },
  role: { type: String, default: 'nurse' },
  profilePicture: { type: String, default: '' }, // URL to the profile picture
  specialty: { type: String, default: '' },
  bloodGroup: { type: String,  default: '' },
  birthday: { type: Date, default: '' },
  maritalStatus: { type: String, default: '' }, 
  educationInstitution: { type: String, default: '' } // Education institution name
}, { timestamps: true });


// Method to generate the next employee ID
nurseSchema.statics.generateEmployeeId = async () => {
  let employeeId;
  let isUnique = false;

  while (!isUnique) {
    employeeId = `N${Math.floor(Math.random() * 1000)}`;
    const existingNurse = await Nurse.findOne({ employeeId });
    if (!existingNurse) {
      isUnique = true;
    }
  }

  return employeeId;
};

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