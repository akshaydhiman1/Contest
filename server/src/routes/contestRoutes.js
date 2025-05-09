const express = require('express');
const router = express.Router();
const {
  createContest,
  getContests,
  getContest,
  updateContest,
  deleteContest,
  getUserContests,
  getParticipatingContests,
} = require('../controllers/contestController');
const Contest = require('../models/Contest');
const User = require('../models/User');

// Middleware for authentication - same as in invitationRoutes
const authMiddleware = (req, res, next) => {
  // In a real application, this would verify a JWT token
  // For now, we'll use one of our seeded users (abhishek_photo)
  req.user = {
    id: '60f1a5c5e98f4a001c9b1234', // Seeded user ID - abhishek_photo
    username: 'abhishek_photo',
    email: 'abhishek@example.com',
    phone: '+919876543210',
  };
  next();
};

// Get all contests - this must come before /:id route
router.get('/all', async (req, res) => {
  try {
    const contests = await Contest.find()
      .populate('creator', 'username avatar')
      .populate('participants', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ message: 'Error fetching contests' });
  }
});

// Note: Route order matters! Specific routes should come before parameter routes
// User-specific routes
router.get('/user/created', authMiddleware, getUserContests);
router.get('/user/participating', authMiddleware, getParticipatingContests);

// Standard CRUD routes
router.post('/', authMiddleware, createContest);
router.get('/', authMiddleware, getContests);
router.get('/:id', authMiddleware, getContest);
router.put('/:id', authMiddleware, updateContest);
router.delete('/:id', authMiddleware, deleteContest);

// Create a new contest
router.post('/create', async (req, res) => {
  try {
    const {
      title,
      description,
      images,
      votingDuration,
      startDate,
      creatorId
    } = req.body;

    // Validate creator exists
    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    const contest = new Contest({
      title,
      description,
      images,
      votingDuration,
      startDate: new Date(startDate),
      creator: creatorId,
      status: 'active',
      participants: [creatorId] // Add creator as first participant
    });

    await contest.save();

    // Populate creator details before sending response
    await contest.populate('creator', 'username avatar');

    res.status(201).json(contest);
  } catch (error) {
    console.error('Error creating contest:', error);
    res.status(500).json({ message: 'Error creating contest', error: error.message });
  }
});

// Get all contests created by a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const contests = await Contest.find({ creator: req.params.userId })
      .populate('creator', 'username avatar')
      .populate('participants', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(contests);
  } catch (error) {
    console.error('Error fetching user contests:', error);
    res.status(500).json({ message: 'Error fetching contests', error: error.message });
  }
});

module.exports = router;
