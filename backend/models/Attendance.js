import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    nurseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nurse',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        default: 'Present'
    }
}, {
    timestamps: true
});

// Index for faster queries
//attendanceSchema.index({ nurseId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;