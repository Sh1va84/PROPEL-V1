const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contractor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid', required: true },
  terms: {
    amount: { type: Number, required: true },
    days: { type: Number, required: true }
  },
  // We allow storing the link directly here now
  workSubmission: {
    link: String,
    notes: String,
    submittedAt: Date
  },
  status: {
    type: String,
    // ADDED 'WORK_SUBMITTED' to the allowed list
    enum: ['ACTIVE', 'WORK_SUBMITTED', 'COMPLETED', 'DISPUTED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  escrowStatus: {
    type: String,
    enum: ['HELD', 'RELEASED', 'REFUNDED'],
    default: 'HELD'
  }
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);
