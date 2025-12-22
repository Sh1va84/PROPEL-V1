const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['BID_RECEIVED', 'BID_ACCEPTED', 'CONTRACT_STARTED', 'PAYMENT_RELEASED', 'DISPUTE_OPENED', 'NEW_MESSAGE'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  // Optional: Link to the specific resource (e.g., clicking notification goes to this Project)
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    // Can refer to Project, Bid, or Contract depending on context
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Notification', notificationSchema);