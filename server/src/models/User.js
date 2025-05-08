const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      maxlength: [50, 'Username cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password in queries by default
    },
    salt: {
      type: String,
      select: false,
    },
    bio: {
      type: String,
      maxlength: [250, 'Bio cannot be more than 250 characters'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    contests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
      },
    ],
    participatingContests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
      },
    ],
    invitations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invitation',
      },
    ],
    sentInvitations: [
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

// Method to set password and generate salt
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

// Method to check password validity
UserSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
  return this.password === hash;
};

// Create indexes for faster querying
UserSchema.index({username: 1});
UserSchema.index({email: 1});

module.exports = mongoose.model('User', UserSchema);
