// Script to create a test user in the MongoDB database
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthtrack', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Define User Schema (copy from server.js)
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

// Create model
const User = mongoose.model('User', UserSchema);

// Test user data
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User'
};

// Create test user
async function createTestUser() {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username: testUser.username }, { email: testUser.email }]
        });

        if (existingUser) {
            console.log('Test user already exists:');
            console.log(`Username: ${testUser.username}`);
            console.log(`Password: ${testUser.password} (unhashed for testing purposes)`);
            mongoose.connection.close();
            return;
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

        console.log('Test user created successfully:');
        console.log(`Username: ${testUser.username}`);
        console.log(`Password: ${testUser.password} (unhashed for testing purposes)`);
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Execute the function
createTestUser(); 