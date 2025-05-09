const mongoose = require('mongoose');
const {contests} = require('../data/seedData');
const Contest = require('../models/Contest');
const User = require('../models/User');

const seedContests = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/contest-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing contests
    await Contest.deleteMany({});
    console.log('Cleared existing contests');

    // Get all users to use as creators and participants
    const users = await User.find();
    if (users.length === 0) {
      console.log('No users found. Please seed users first.');
      return;
    }

    // Create a map of usernames to user IDs
    const userMap = {};
    users.forEach(user => {
      userMap[user.username] = user._id;
    });

    // Map the seed data to use actual user IDs
    const contestsWithUsers = contests.map(contest => {
      // Find the creator's ID from the username
      const creatorId = userMap[contest.creator] || users[0]._id;
      
      // Map participant usernames to their IDs
      const participantIds = contest.participants.map(username => 
        userMap[username] || users[0]._id
      );

      return {
        ...contest,
        creator: creatorId,
        participants: participantIds
      };
    });

    // Insert contests
    await Contest.insertMany(contestsWithUsers);
    console.log('Added contests:', contestsWithUsers);

    console.log('Contests seeded successfully');
  } catch (error) {
    console.error('Error seeding contests:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed function
seedContests(); 