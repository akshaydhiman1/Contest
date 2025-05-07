/**
 * Seed Script for the Contest App
 *
 * This script populates the database with initial test data
 * Usage: node src/data/seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {users, contests, invitations} = require('./seedData');
const User = require('../models/User');
const Contest = require('../models/Contest');
const Invitation = require('../models/Invitation');

// Load environment variables
dotenv.config({path: require('path').resolve(__dirname, '../config/.env')});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGO_URI}/contest-app` ||
        'mongodb://localhost:27017/contest-app',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Clear all existing data
const clearData = async () => {
  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Contest.deleteMany({});
  await Invitation.deleteMany({});
  console.log('✅ Data cleared successfully');
};

// Import fresh data
const importData = async () => {
  try {
    console.log('Importing users...');
    await User.insertMany(users);
    console.log('✅ Users imported successfully');

    console.log('Importing contests...');
    await Contest.insertMany(contests);
    console.log('✅ Contests imported successfully');

    console.log('Importing invitations...');
    await Invitation.insertMany(invitations);
    console.log('✅ Invitations imported successfully');

    console.log('🎉 All data imported successfully');
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
};

// Setup password hashes for users
const setupPasswords = async () => {
  try {
    console.log('Setting up user passwords...');

    // Get all users
    const dbUsers = await User.find({});

    // Set passwords for each user
    for (const user of dbUsers) {
      // Set a default password - in a real app, each user would have a different password
      user.setPassword('password123');
      await user.save();
    }

    console.log('✅ User passwords set successfully');
  } catch (error) {
    console.error(`Error setting passwords: ${error.message}`);
    process.exit(1);
  }
};

// Main function
const seedDatabase = async () => {
  const conn = await connectDB();

  await clearData();
  await importData();
  await setupPasswords();

  console.log('Database seeded successfully! 🌱');
  console.log('You can now run the server with: npm run dev');

  // Close connection
  mongoose.disconnect();
};

// Run the seed function
seedDatabase().catch(err => {
  console.error(`Error seeding database: ${err.message}`);
  process.exit(1);
});
