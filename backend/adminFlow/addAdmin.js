require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import your User model

// Connect to the database
const connectDB = async () => {
    try {
        // Use MongoDB URI from environment or default to Docker connection
        const mongoUri = process.env.MONGODB_URI || 'mongodb://root:password@localhost:27017/cashify?authSource=admin';
        await mongoose.connect(mongoUri);
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1);
    }
};

const grantAdminAccess = async (email, password = null) => {
    try {
        // Check if user with the email exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        
        if (existingUser) {
            // User exists - promote to admin
            if (existingUser.role === 'admin') {
                console.log(`User with email ${email} is already an admin.`);
                return;
            }
            
            existingUser.role = 'admin';
            await existingUser.save();
            console.log(`✅ Successfully promoted user ${email} to admin!`);
            return;
        }

        // User doesn't exist - create new admin
        if (!password) {
            console.error('❌ Error: User does not exist. Please provide a password to create a new admin user.');
            console.log('Usage: node addAdmin.js <email> <password>');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new User({
            name: email.split('@')[0], // Use email prefix as name
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log(`✅ Admin user created successfully for ${email}!`);
    } catch (error) {
        console.error('❌ Error granting admin access:', error.message);
    }
};

// Main function to execute the process
const run = async () => {
    await connectDB();
    
    // Get email and password from command line arguments
    const email = 'dipakgiree41@gmail.com';
    const password = 'adminPassword123';
    
    if (!email) {
        console.error('❌ Error: Email is required!');
        console.log('Usage: node addAdmin.js <email> [password]');
        console.log('  - If user exists: password is optional (will promote existing user)');
        console.log('  - If user doesn\'t exist: password is required (will create new admin)');
        process.exit(1);
    }
    
    await grantAdminAccess(email, password);
    await mongoose.connection.close();
    process.exit();
};

run();
    