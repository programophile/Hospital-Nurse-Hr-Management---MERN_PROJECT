// backend/models/Leave.js
import mongoose from 'mongoose';
import Nurse from './Nurse.js'; //
const LeaveSchema = new mongoose.Schema({
    nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nurse', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, enum: ['Sick Leave', 'Vacation', 'Personal Leave', 'Other'], required: true },
    //status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true });
// Custom validation to ensure startDate is before endDate
export default mongoose.model('Leave', LeaveSchema);