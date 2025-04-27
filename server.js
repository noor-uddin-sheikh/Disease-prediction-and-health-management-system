// server.js - Backend for HealthTrack Disease Prediction System
// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'health-track-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthtrack', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: String,
    age: String,
    gender: {
        type: String,
        default: 'male',
    },
    height: String,
    weight: String,
    medicalHistory: String,
    allergies: String,
    joinDate: {
        type: Date,
        default: Date.now,
    },
});

// Define Health Record Schema
const HealthRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    recordType: {
        type: String,
        required: true,
        enum: ['routine', 'monthly'],
    },
    bloodPressure: String,
    heartRate: String,
    temperature: String,
    weight: String,
    symptoms: String,
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create models
const User = mongoose.model('User', UserSchema);
const HealthRecord = mongoose.model('HealthRecord', HealthRecordSchema);

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication required' });
    }
};

// API Routes

// Register a new user
app.post('/api/users/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();

        // Generate JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                joinDate: user.joinDate,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log(`Login attempt for user: ${username}`);

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            console.log(`User not found: ${username}`);
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Password match result for ${username}: ${isMatch}`);

        if (!isMatch) {
            // For debugging - log password length and first character only (for security)
            console.log(`Password check failed. Length: ${password.length}, First char: ${password.charAt(0)}`);
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

        console.log(`User ${username} logged in successfully`);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                age: user.age,
                gender: user.gender,
                height: user.height,
                weight: user.weight,
                medicalHistory: user.medicalHistory,
                allergies: user.allergies,
                joinDate: user.joinDate,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current user profile
app.get('/api/users/profile', auth, async (req, res) => {
    try {
        res.json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            fullName: req.user.fullName,
            age: req.user.age,
            gender: req.user.gender,
            height: req.user.height,
            weight: req.user.weight,
            medicalHistory: req.user.medicalHistory,
            allergies: req.user.allergies,
            joinDate: req.user.joinDate,
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
app.put('/api/users/profile', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'fullName',
            'age',
            'gender',
            'height',
            'weight',
            'medicalHistory',
            'allergies',
        ];

        // Check if updates are valid
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        // Apply updates
        updates.forEach(update => (req.user[update] = req.body[update]));
        await req.user.save();

        res.json({
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            fullName: req.user.fullName,
            age: req.user.age,
            gender: req.user.gender,
            height: req.user.height,
            weight: req.user.weight,
            medicalHistory: req.user.medicalHistory,
            allergies: req.user.allergies,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Change password
app.post('/api/users/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, req.user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        req.user.password = hashedPassword;
        await req.user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete account
app.delete('/api/users', auth, async (req, res) => {
    try {
        const { password } = req.body;

        // Verify password
        const isMatch = await bcrypt.compare(password, req.user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        // Delete all user's health records
        await HealthRecord.deleteMany({ userId: req.user._id });

        // Delete user
        await req.user.remove();

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Health Records Routes

// Get all health records for current user
app.get('/api/health-records', auth, async (req, res) => {
    try {
        const records = await HealthRecord.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(records);
    } catch (error) {
        console.error('Get health records error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new health record
app.post('/api/health-records', auth, async (req, res) => {
    try {
        const record = new HealthRecord({
            ...req.body,
            userId: req.user._id,
        });

        await record.save();
        res.status(201).json(record);
    } catch (error) {
        console.error('Add health record error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update health record
app.put('/api/health-records/:id', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = [
            'date',
            'recordType',
            'bloodPressure',
            'heartRate',
            'temperature',
            'weight',
            'symptoms',
            'notes',
        ];

        // Check if updates are valid
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        // Find record and check ownership
        const record = await HealthRecord.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Apply updates
        updates.forEach(update => (record[update] = req.body[update]));
        await record.save();

        res.json(record);
    } catch (error) {
        console.error('Update health record error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete health record
app.delete('/api/health-records/:id', auth, async (req, res) => {
    try {
        const record = await HealthRecord.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Delete health record error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create test user (only for development)
if (process.env.NODE_ENV !== 'production') {
    app.get('/api/users/create-test-user', async (req, res) => {
        try {
            const testUser = {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                fullName: 'Test User'
            };

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ username: testUser.username }, { email: testUser.email }]
            });

            if (existingUser) {
                return res.json({
                    message: 'Test user already exists',
                    username: testUser.username,
                    password: testUser.password,
                    note: 'Use these credentials to login'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(testUser.password, salt);

            // Create new user
            const user = new User({
                username: testUser.username,
                email: testUser.email,
                password: hashedPassword,
                fullName: testUser.fullName
            });

            await user.save();

            res.json({
                message: 'Test user created successfully',
                username: testUser.username,
                password: testUser.password,
                note: 'Use these credentials to login'
            });
        } catch (error) {
            console.error('Error creating test user:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Emergency login for testing (only for development)
    app.get('/api/users/emergency-login', async (req, res) => {
        try {
            // Find test user
            const user = await User.findOne({ username: 'testuser' });

            if (!user) {
                return res.status(404).json({ message: 'Test user not found. Create it first with /api/users/create-test-user' });
            }

            // Generate JWT
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

            res.json({
                message: 'Emergency login successful',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    age: user.age,
                    gender: user.gender,
                    height: user.height,
                    weight: user.weight,
                    medicalHistory: user.medicalHistory,
                    allergies: user.allergies,
                    joinDate: user.joinDate,
                },
            });
        } catch (error) {
            console.error('Emergency login error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    });
}

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('public'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/healthtrack'}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (err) => {
    console.error('Server error:', err);
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Try a different port in .env file.`);
    }
}); 