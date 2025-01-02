import mongoose from 'mongoose';

const ShiftSchema = new mongoose.Schema({
  nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Nurse', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
}, { timestamps: true });
// Validate time format
ShiftSchema.path('startTime').validate((value) => {
    return /^\d{2}:\d{2}$/.test(value); // HH:mm format
}, 'Invalid start time format');

ShiftSchema.path('endTime').validate(function(value) {
    const start = this.startTime;
    return new Date(`1970-01-01T${value}:00Z`) > new Date(`1970-01-01T${start}:00Z`);
}, 'End time must be after start time');

// Ensure unique shifts for each nurse
ShiftSchema.index({ nurseId: 1, date: 1, startTime: 1, endTime: 1 }, { unique: true });

export default mongoose.model('Shift', ShiftSchema);