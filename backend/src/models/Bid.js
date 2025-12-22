const mongoose = require('mongoose');

const bidSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bidAmount: {
    type: Number,
    required: [true, 'Bid amount is required'], // Expects "bidAmount"
  },
  daysToComplete: {
    type: Number,
    required: [true, 'Days to complete is required'], // Expects "daysToComplete"
  },
  proposal: {
    type: String,
    required: [true, 'Proposal cover letter is required'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bid', bidSchema);
