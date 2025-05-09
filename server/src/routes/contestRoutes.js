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

// Get all contests
router.get('/all', async (req, res) => {
  try {
    const contests = await Contest.find()
      .populate('creator', 'username avatar')
      .populate('participants', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: contests
    });
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Get contest by ID
router.get('/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('creator', 'username avatar')
      .populate('participants', 'username avatar')
      .populate('votes.user', 'username avatar')
      .populate('comments.user', 'username avatar')
      .populate('likes', 'username avatar');

    if (!contest) {
      return res.status(404).json({
        success: false,
        error: 'Contest not found'
      });
    }

    res.json({
      success: true,
      data: contest
    });
  } catch (error) {
    console.error('Error fetching contest:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Create new contest
router.post('/', async (req, res) => {
  try {
    const { title, description, images, votingDuration, creator } = req.body;

    const contest = await Contest.create({
      title,
      description,
      images,
      votingDuration,
      creator
    });

    res.status(201).json({
      success: true,
      data: contest
    });
  } catch (error) {
    console.error('Error creating contest:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Update contest
router.put('/:id', async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!contest) {
      return res.status(404).json({
        success: false,
        error: 'Contest not found'
      });
    }

    res.json({
      success: true,
      data: contest
    });
  } catch (error) {
    console.error('Error updating contest:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Delete contest
router.delete('/:id', async (req, res) => {
  try {
    const contest = await Contest.findByIdAndDelete(req.params.id);

    if (!contest) {
      return res.status(404).json({
        success: false,
        error: 'Contest not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting contest:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Vote for an image in a contest
router.post('/:id/vote', async (req, res) => {
  try {
    const { userId, imageIndex } = req.body;
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({
        success: false,
        error: 'Contest not found'
      });
    }

    // Check if contest is still active
    if (contest.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Contest is no longer active'
      });
    }

    // Check if user has already voted
    const existingVote = contest.votes.find(vote => vote.user.toString() === userId);
    if (existingVote) {
      return res.status(400).json({
        success: false,
        error: 'You have already voted in this contest'
      });
    }

    // Add vote
    contest.votes.push({
      user: userId,
      imageIndex
    });

    await contest.save();

    res.json({
      success: true,
      data: contest
    });
  } catch (error) {
    console.error('Error voting in contest:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Like a contest
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({
        success: false,
        error: 'Contest not found'
      });
    }

    // Check if user has already liked
    if (contest.likes.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: 'You have already liked this contest'
      });
    }

    contest.likes.push(userId);
    await contest.save();

    res.json({
      success: true,
      data: contest
    });
  } catch (error) {
    console.error('Error liking contest:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

// Add comment to contest
router.post('/:id/comment', async (req, res) => {
  try {
    const { userId, text } = req.body;
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({
        success: false,
        error: 'Contest not found'
      });
    }

    contest.comments.push({
      user: userId,
      text
    });

    await contest.save();

    res.json({
      success: true,
      data: contest
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;
