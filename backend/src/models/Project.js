const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  
  // Who created it? (Agent)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Skills required (Tags)
  requiredSkills: [String],
  
  // Project Type
  visibility: {
    type: String,
    enum: ['Public', 'Invite-Only'],
    default: 'Public',
  },
  
  // Optional: Specific contractors invited
  invitedContractors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Status Workflow
  status: {
    type: String,
    enum: ['OPEN', 'BIDDING', 'ASSIGNED', 'COMPLETED', 'CANCELLED'],
    default: 'OPEN',
  },

  // Attachments (Project files)
  attachments: [String], 
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);