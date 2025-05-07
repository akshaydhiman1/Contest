const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema(
  {
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest',
      required: [true, 'Contest ID is required for invitation'],
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender information is required'],
    },
    to: {
      // This could be a user ID or an external identifier like phone number or email
      type: String,
      required: [true, 'Recipient information is required'],
    },
    method: {
      type: String,
      enum: ['app', 'whatsapp', 'sms', 'email', 'other'],
      required: [true, 'Invitation method is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
    },
    responseDate: {
      type: Date,
      default: null,
    },
    expiryDate: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days
      },
    },
    metadata: {
      // For storing additional information like phone numbers, message details, etc.
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes for faster querying
InvitationSchema.index({contestId: 1});
InvitationSchema.index({from: 1});
InvitationSchema.index({to: 1});
InvitationSchema.index({status: 1});

module.exports = mongoose.model('Invitation', InvitationSchema);
