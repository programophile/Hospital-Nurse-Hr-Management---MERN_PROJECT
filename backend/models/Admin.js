// backend/models/Admin.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name is required'] },
  lastName: { type: String, required: [true, 'Last name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Password is required'] },
  employeeId: { type: String, unique: true },
  department: { type: String },
  contactNumber: { type: String },
  role: { type: String, default: 'admin' }
}, { timestamps: true });

// Method to generate the next employee ID
adminSchema.statics.generateEmployeeId = async function() {
  const lastAdmin = await this.findOne().sort({ employeeId: -1 });
  if (!lastAdmin) {
    return 'A0001'; // Start with A0001 for admins
  }
  const lastId = parseInt(lastAdmin.employeeId.slice(1), 10);
  const nextId = (lastId + 1).toString().padStart(4, '0');
  return `A${nextId}`;
};

// Password hashing middleware
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;