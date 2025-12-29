const express = require('express');
const { createContract, getMyContracts, deliverWork, releasePayment } = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createContract);
router.get('/my-contracts', protect, getMyContracts);
router.post('/deliver', protect, deliverWork);
router.put('/:id/pay', protect, releasePayment);

module.exports = router;

// NEW: Get contract for a specific project
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const contract = await Contract.findOne({ project: req.params.projectId })
      .populate('project')
      .populate('client', 'name email')
      .populate('contractor', 'name email');
    
    if (!contract) {
      return res.status(404).json({ message: 'No contract found for this project' });
    }
    
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download invoice
router.get('/invoice/:contractId', protect, async (req, res) => {
  try {
    const Contract = require('../models/Contract');
    const { generateInvoice } = require('../utils/invoiceGenerator');
    
    const contract = await Contract.findById(req.params.contractId)
      .populate('project').populate('client').populate('contractor');
    
    if (!contract) return res.status(404).json({ message: 'Not found' });
    
    const pdfBase64 = await generateInvoice(contract, contract.contractor, contract.client);
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice_${contract._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download invoice
router.get('/invoice/:contractId', protect, async (req, res) => {
  try {
    const Contract = require('../models/Contract');
    const { generateInvoice } = require('../utils/invoiceGenerator');
    
    const contract = await Contract.findById(req.params.contractId)
      .populate('project').populate('client').populate('contractor');
    
    if (!contract) return res.status(404).json({ message: 'Not found' });
    
    const pdfBase64 = await generateInvoice(contract, contract.contractor, contract.client);
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice_${contract._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download invoice
router.get('/invoice/:contractId', protect, async (req, res) => {
  try {
    const Contract = require('../models/Contract');
    const { generateInvoice } = require('../utils/invoiceGenerator');
    
    const contract = await Contract.findById(req.params.contractId)
      .populate('project').populate('client').populate('contractor');
    
    if (!contract) return res.status(404).json({ message: 'Not found' });
    
    const pdfBase64 = await generateInvoice(contract, contract.contractor, contract.client);
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice_${contract._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download invoice
router.get('/invoice/:contractId', protect, async (req, res) => {
  try {
    const Contract = require('../models/Contract');
    const { generateInvoice } = require('../utils/invoiceGenerator');
    
    const contract = await Contract.findById(req.params.contractId)
      .populate('project').populate('client').populate('contractor');
    
    if (!contract) return res.status(404).json({ message: 'Not found' });
    
    const pdfBase64 = await generateInvoice(contract, contract.contractor, contract.client);
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice_${contract._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
