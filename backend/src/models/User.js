const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Agent', 'Contractor', 'Admin'],
    required: true,
  },
  // Profile Completion Flags
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  // Contractor Specific Profile
  profile: {
    skills: [String],
    portfolio: [String], // Array of URLs
    hourlyRate: Number,
    bio: String,
    availability: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Unavailable'],
      default: 'Part-time',
    },
    completedProjects: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  // Agent Specific Data
  companyName: String,
  
  // Wallet System (For Escrow simulation)
  walletBalance: {
    type: Number,
    default: 0, 
  },
}, {
  timestamps: true,
});

// Password Hash Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password Match Method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);