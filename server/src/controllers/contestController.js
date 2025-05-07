const Contest = require('../models/Contest');
const User = require('../models/User');
const Invitation = require('../models/Invitation');

// @desc    Create a new contest
// @route   POST /api/contests
// @access  Private
exports.createContest = async (req, res) => {
  try {
    const {title, description, images, votingDuration, invitees} = req.body;

    // Create contest
    const contest = new Contest({
      title,
      description,
      images: images || [],
      creator: req.user.id,
      votingDuration: votingDuration || '24h',
    });

    await contest.save();

    // Add contest to user's contests
    await User.findByIdAndUpdate(req.user.id, {
      $push: {contests: contest._id},
    });

    // Process invitations if any
    if (
      invitees &&
      (invitees.appUsers?.length > 0 || invitees.phoneNumbers?.length > 0)
    ) {
      const invitations = [];

      // Process app users
      if (invitees.appUsers && invitees.appUsers.length > 0) {
        for (const user of invitees.appUsers) {
          const invitation = new Invitation({
            contestId: contest._id,
            from: req.user.id,
            to: user.username,
            method: 'app',
            metadata: {userId: user.id},
          });

          await invitation.save();
          invitations.push(invitation);

          // Update contest with invitation
          contest.invitations.push(invitation._id);

          // Update recipient
          await User.findOneAndUpdate(
            {username: user.username},
            {$push: {invitations: invitation._id}},
          );
        }
      }

      // Process phone numbers
      if (invitees.phoneNumbers && invitees.phoneNumbers.length > 0) {
        for (const phone of invitees.phoneNumbers) {
          // Determine method based on metadata or pattern
          const method = phone.includes('whatsapp')
            ? 'whatsapp'
            : phone.startsWith('+')
            ? 'sms'
            : 'other';

          const invitation = new Invitation({
            contestId: contest._id,
            from: req.user.id,
            to: phone,
            method,
            metadata: {phone},
          });

          await invitation.save();
          invitations.push(invitation);

          // Update contest with invitation
          contest.invitations.push(invitation._id);
        }
      }

      // Save contest with all invitations
      await contest.save();

      // Update user's sent invitations
      await User.findByIdAndUpdate(req.user.id, {
        $push: {sentInvitations: {$each: invitations.map(inv => inv._id)}},
      });
    }

    res.status(201).json({
      success: true,
      data: contest,
    });
  } catch (error) {
    console.error('Error creating contest:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all contests
// @route   GET /api/contests
// @access  Private
exports.getContests = async (req, res) => {
  try {
    const contests = await Contest.find()
      .sort({createdAt: -1})
      .populate('creator', 'username')
      .populate('participants', 'username');

    res.status(200).json({
      success: true,
      count: contests.length,
      data: contests,
    });
  } catch (error) {
    console.error('Error getting contests:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get a single contest
// @route   GET /api/contests/:id
// @access  Private
exports.getContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('creator', 'username')
      .populate('participants', 'username')
      .populate({
        path: 'invitations',
        select: 'to method status',
      });

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: 'Contest not found',
      });
    }

    res.status(200).json({
      success: true,
      data: contest,
    });
  } catch (error) {
    console.error('Error getting contest:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update a contest
// @route   PUT /api/contests/:id
// @access  Private
exports.updateContest = async (req, res) => {
  try {
    let contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: 'Contest not found',
      });
    }

    // Check if user is the creator
    if (contest.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this contest',
      });
    }

    // Update contest fields
    contest = await Contest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: contest,
    });
  } catch (error) {
    console.error('Error updating contest:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete a contest
// @route   DELETE /api/contests/:id
// @access  Private
exports.deleteContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({
        success: false,
        message: 'Contest not found',
      });
    }

    // Check if user is the creator
    if (contest.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this contest',
      });
    }

    // Delete all associated invitations
    await Invitation.deleteMany({contestId: contest._id});

    // Remove contest from creator's contests
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {contests: contest._id},
    });

    // Remove contest from participants' participating contests
    for (const participantId of contest.participants) {
      await User.findByIdAndUpdate(participantId, {
        $pull: {participatingContests: contest._id},
      });
    }

    // Delete the contest
    await contest.remove();

    res.status(200).json({
      success: true,
      message: 'Contest deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contest:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get contests created by logged in user
// @route   GET /api/contests/user/created
// @access  Private
exports.getUserContests = async (req, res) => {
  try {
    const contests = await Contest.find({creator: req.user.id}).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: contests.length,
      data: contests,
    });
  } catch (error) {
    console.error('Error getting user contests:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get contests in which logged in user is participating
// @route   GET /api/contests/user/participating
// @access  Private
exports.getParticipatingContests = async (req, res) => {
  try {
    const contests = await Contest.find({participants: req.user.id}).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: contests.length,
      data: contests,
    });
  } catch (error) {
    console.error('Error getting participating contests:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
