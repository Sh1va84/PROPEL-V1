const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  requiredSkills: [String],
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  status: { 
    type: String, 
    enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], 
    default: 'OPEN' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // NEW: Checklist System
  checklist: [{
    text: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
