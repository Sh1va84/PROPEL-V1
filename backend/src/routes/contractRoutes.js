const express = require('express');
const { createContract, getMyContracts, deliverWork } = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createContract);
router.get('/my-contracts', protect, getMyContracts); // <--- New Route
router.post('/deliver', protect, deliverWork);

module.exports = router;
