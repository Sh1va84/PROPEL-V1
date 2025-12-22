const express = require('express');
const { placeBid, getBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware'); // <--- CORRECT IMPORT

const router = express.Router();

// Route: /api/bids/:projectId
router.route('/:projectId')
  .post(protect, authorize('Contractor'), placeBid) // Only Contractors can bid
  .get(protect, getBids);                           // Both can view bids

module.exports = router;
