const Invitation = require('../models/Invitation');
const Contest = require('../models/Contest');
const User = require('../models/User');

// @desc    Create a new invitation
// @route   POST /api/invitations
// @access  Private
exports.createInvitation = async (req, res) => {
  try {
    const {contestId, to, method, metadata} = req.body;

    // Check if the contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res
        .status(404)
        .json({success: false, message: 'Contest not found'});
    }

    // Check if user is the creator of the contest
    if (contest.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the contest creator can send invitations',
      });
    }

    // Create the new invitation
    const invitation = new Invitation({
      contestId,
      from: req.user.id,
      to,
      method,
      metadata: metadata || {},
    });

    await invitation.save();

    // Update the contest with the new invitation
    contest.invitations.push(invitation._id);
    await contest.save();

    // If invitation is to an app user, update their invitations too
    if (method === 'app') {
      const toUser = await User.findOne({username: to});
      if (toUser) {
        toUser.invitations.push(invitation._id);
        await toUser.save();
      }
    }

    // Update the sender's sent invitations
    const fromUser = await User.findById(req.user.id);
    fromUser.sentInvitations.push(invitation._id);
    await fromUser.save();

    res.status(201).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all invitations for a contest
// @route   GET /api/invitations/contest/:contestId
// @access  Private
exports.getContestInvitations = async (req, res) => {
  try {
    const {contestId} = req.params;

    // Check if the contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res
        .status(404)
        .json({success: false, message: 'Contest not found'});
    }

    // Check if user is authorized to view invitations
    if (contest.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view these invitations',
      });
    }

    // Get invitations for the contest
    const invitations = await Invitation.find({contestId}).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: invitations.length,
      data: invitations,
    });
  } catch (error) {
    console.error('Error getting contest invitations:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all received invitations for logged in user
// @route   GET /api/invitations/received
// @access  Private
exports.getReceivedInvitations = async (req, res) => {
  try {
    // Find app user invitations
    const appInvitations = await Invitation.find({
      to: req.user.username,
      method: 'app',
    })
      .sort({createdAt: -1})
      .populate('contestId', 'title');

    // Find phone invitations if user has a phone
    let phoneInvitations = [];
    if (req.user.phone) {
      phoneInvitations = await Invitation.find({
        to: req.user.phone,
        method: {$in: ['sms', 'whatsapp']},
      })
        .sort({createdAt: -1})
        .populate('contestId', 'title');
    }

    // Combine all invitations
    const invitations = [...appInvitations, ...phoneInvitations];

    res.status(200).json({
      success: true,
      count: invitations.length,
      data: invitations,
    });
  } catch (error) {
    console.error('Error getting received invitations:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all sent invitations for logged in user
// @route   GET /api/invitations/sent
// @access  Private
exports.getSentInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({from: req.user.id})
      .sort({createdAt: -1})
      .populate('contestId', 'title');

    res.status(200).json({
      success: true,
      count: invitations.length,
      data: invitations,
    });
  } catch (error) {
    console.error('Error getting sent invitations:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Respond to an invitation
// @route   PUT /api/invitations/:id/respond
// @access  Private
exports.respondToInvitation = async (req, res) => {
  try {
    const {id} = req.params;
    const {status} = req.body; // 'accepted' or 'declined'

    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either accepted or declined',
      });
    }

    // Find the invitation
    const invitation = await Invitation.findById(id);
    if (!invitation) {
      return res
        .status(404)
        .json({success: false, message: 'Invitation not found'});
    }

    // Check if the invitation is for this user
    const isValidRecipient =
      (invitation.method === 'app' && invitation.to === req.user.username) ||
      (['sms', 'whatsapp'].includes(invitation.method) &&
        invitation.to === req.user.phone);

    if (!isValidRecipient) {
      return res.status(403).json({
        success: false,
        message: 'This invitation is not for you',
      });
    }

    // Update the invitation
    invitation.status = status;
    invitation.responseDate = Date.now();
    await invitation.save();

    // If accepted, add user to contest participants
    if (status === 'accepted') {
      const contest = await Contest.findById(invitation.contestId);
      if (!contest.participants.includes(req.user.id)) {
        contest.participants.push(req.user.id);
        await contest.save();

        // Add contest to user's participating contests
        const user = await User.findById(req.user.id);
        if (!user.participatingContests.includes(contest._id)) {
          user.participatingContests.push(contest._id);
          await user.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error('Error responding to invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Cancel an invitation (for sender)
// @route   DELETE /api/invitations/:id
// @access  Private
exports.cancelInvitation = async (req, res) => {
  try {
    const {id} = req.params;

    // Find the invitation
    const invitation = await Invitation.findById(id);
    if (!invitation) {
      return res
        .status(404)
        .json({success: false, message: 'Invitation not found'});
    }

    // Check if user is the sender of the invitation
    if (invitation.from.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the sender can cancel an invitation',
      });
    }

    // Check if the invitation is already accepted
    if (invitation.status === 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an accepted invitation',
      });
    }

    // Remove invitation from contest
    await Contest.findByIdAndUpdate(invitation.contestId, {
      $pull: {invitations: invitation._id},
    });

    // Remove invitation from sender
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {sentInvitations: invitation._id},
    });

    // Remove invitation from recipient if it's an app user
    if (invitation.method === 'app') {
      const toUser = await User.findOne({username: invitation.to});
      if (toUser) {
        await User.findByIdAndUpdate(toUser._id, {
          $pull: {invitations: invitation._id},
        });
      }
    }

    // Delete the invitation
    await invitation.remove();

    res.status(200).json({
      success: true,
      message: 'Invitation cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Send bulk invitations
// @route   POST /api/invitations/bulk
// @access  Private
exports.sendBulkInvitations = async (req, res) => {
  try {
    const {contestId, invitees} = req.body;

    // Check if contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res
        .status(404)
        .json({success: false, message: 'Contest not found'});
    }

    // Check if user is the creator of the contest
    if (contest.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the contest creator can send invitations',
      });
    }

    // Validate invitees structure
    if (!invitees || !Array.isArray(invitees) || invitees.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid invitees data. Must be a non-empty array.',
      });
    }

    const savedInvitations = [];
    const errors = [];

    // Process each invitation
    for (const invitee of invitees) {
      try {
        if (!invitee.to || !invitee.method) {
          errors.push(
            `Missing required fields for invitee: ${JSON.stringify(invitee)}`,
          );
          continue;
        }

        // Create the invitation
        const invitation = new Invitation({
          contestId,
          from: req.user.id,
          to: invitee.to,
          method: invitee.method,
          metadata: invitee.metadata || {},
        });

        await invitation.save();
        savedInvitations.push(invitation);

        // Update contest with new invitation
        contest.invitations.push(invitation._id);

        // If app user, update their invitations too
        if (invitee.method === 'app') {
          const toUser = await User.findOne({username: invitee.to});
          if (toUser) {
            toUser.invitations.push(invitation._id);
            await toUser.save();
          }
        }

        // Update sender's sent invitations
        await User.findByIdAndUpdate(req.user.id, {
          $push: {sentInvitations: invitation._id},
        });
      } catch (invitationError) {
        errors.push(
          `Error for invitee ${invitee.to}: ${invitationError.message}`,
        );
      }
    }

    // Save contest once with all new invitations
    await contest.save();

    res.status(201).json({
      success: true,
      data: {
        sent: savedInvitations.length,
        errors: errors.length > 0 ? errors : null,
        invitations: savedInvitations,
      },
    });
  } catch (error) {
    console.error('Error sending bulk invitations:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
