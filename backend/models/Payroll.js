import mongoose from 'mongoose';
import Nurse from './Nurse.js'; // Ensure the path is correct

const PayrollSchema = new mongoose.Schema({
    nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nurse', required: true },
    month: {
        type: String,
        required: true,
        enum: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    },
    year: { type: Number, required: true },
    salary: { type: Number, required: true },
    overtime: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
}, { timestamps: true }); // Enable timestamps

// Ensure unique payroll records for each nurse per month and year
PayrollSchema.index({ nurseId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('Payroll', PayrollSchema);
