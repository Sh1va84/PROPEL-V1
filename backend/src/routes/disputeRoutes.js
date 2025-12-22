const express = require('express');
const router = express.Router();
const { createDispute, resolveDispute } = require('../controllers/disputeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Any authenticated user involved in a contract can raise a dispute
router.post('/', protect, createDispute);

// Only Admins can resolve disputes
router.put('/:id/resolve', protect, authorize('Admin'), resolveDispute);

module.exports = router;