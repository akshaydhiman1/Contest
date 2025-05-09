const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the contest'],
      trim: true,
      maxlength: [100, 'Contest title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for the contest'],
      trim: true,
      maxlength: [
        1000,
        'Contest description cannot be more than 1000 characters',
      ],
    },
    images: {
      type: [String],
      default: [],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a creator for the contest'],
    },
    votingDuration: {
      type: String,
      enum: ['12h', '24h', '48h', '72h', '7d'],
      default: '24h',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: function () {
        // Calculate end date based on voting duration
        const duration = this.votingDuration;
        const start = this.startDate || new Date();

        if (duration === '12h')
          return new Date(start.getTime() + 12 * 60 * 60 * 1000);
        if (duration === '24h')
          return new Date(start.getTime() + 24 * 60 * 60 * 1000);
        if (duration === '48h')
          return new Date(start.getTime() + 48 * 60 * 60 * 1000);
        if (duration === '72h')
          return new Date(start.getTime() + 72 * 60 * 60 * 1000);
        if (duration === '7d')
          return new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

        return new Date(start.getTime() + 24 * 60 * 60 * 1000); // Default 24 hours
      },
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'cancelled'],
      default: 'active',
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    invitations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invitation',
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Contest', ContestSchema);
