// backend/models/Payroll.js
import mongoose from 'mongoose';

const PayrollSchema = new mongoose.Schema({
    nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nurse', required: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    salary: { type: Number, required: true },
    overtime: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
}, { timestamps: true }); // Enable timestamps

// Validate month
const validMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
PayrollSchema.path('month').validate((value) => {
    return validMonths.includes(value);
}, 'Invalid month');

// Ensure unique payroll records for each nurse per month and year
PayrollSchema.index({ nurseId: 1, month: 1, year: 1 }, { unique: true });
export default mongoose.model('Payroll', PayrollSchema);