// backend/models/Leave.js
import mongoose from 'mongoose';
const LeaveSchema = new mongoose.Schema({
    user: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, enum: ['Sick Leave', 'Vacation', 'Personal Leave', 'Other'], required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true });
// Custom validation to ensure startDate is before endDate
LeaveSchema.pre('validate', function(next) {
    if (this.startDate >= this.endDate) {
        return next(new Error('Start date must be before end date'));
    }
    next();
});
export default mongoose.model('Leave', LeaveSchema);