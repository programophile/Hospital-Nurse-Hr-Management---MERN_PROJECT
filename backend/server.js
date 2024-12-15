
import cors from 'cors';
import express, { json } from 'express';
import { connect } from 'mongoose';
import morgan from 'morgan';
import helmet from 'helmet';

import authRoutes from './routes/auth.js';
import nurseRoutes from './routes/nurse.js';
import shiftRoutes from './routes/shift.js';
import leaveRoutes from './routes/leave.js';
import payrollRoutes from './routes/payroll.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined')); // Logging
app.use(json()); // Middleware to parse JSON requests

// Use the authRoutes.
app.use('/api/auth', authRoutes);

// Routes
app.use('/api/nurses', nurseRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payrolls', payrollRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000; // Set your desired port

// Connect to MongoDB
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
}

connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Graceful shutdown
        const shutdown = () => {
            console.log('Shutting down gracefully...');
            server.close(() => {
                console.log('Closed out remaining connections.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });