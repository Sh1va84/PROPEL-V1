const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true },
  raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  defendant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  reason: {
    type: String,
    enum: ['Missed Deadline', 'Poor Quality', 'Payment Issue', 'Scope Creep', 'Other'],
    required: true,
  },
  description: { type: String, required: true },
  
  // Evidence (Screenshots, PDFs)
  evidenceFiles: [String],
  
  status: {
    type: String,
    enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED_REFUND', 'RESOLVED_PAYOUT'],
    default: 'OPEN',
  },
  
  // Admin Decision
  resolutionSummary: String,
  resolvedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);