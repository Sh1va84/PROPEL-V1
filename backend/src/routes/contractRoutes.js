const express = require('express');
const { createContract, getMyContracts, deliverWork, releasePayment } = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createContract);
router.get('/my-contracts', protect, getMyContracts);
router.post('/deliver', protect, deliverWork);
router.put('/:id/pay', protect, releasePayment);

module.exports = router;
