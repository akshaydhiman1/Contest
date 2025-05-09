const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  votingDuration: {
    type: String,
    enum: ['12h', '24h', '48h', '72h', '7d'],
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'ended', 'cancelled'],
    default: 'active'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  votes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    imageIndex: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Calculate end time based on voting duration
contestSchema.pre('save', function(next) {
  if (this.isModified('votingDuration')) {
    const duration = this.votingDuration;
    const hours = {
      '12h': 12,
      '24h': 24,
      '48h': 48,
      '72h': 72,
      '7d': 168
    }[duration];
    
    this.endTime = new Date(this.startTime.getTime() + (hours * 60 * 60 * 1000));
  }
  next();
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
