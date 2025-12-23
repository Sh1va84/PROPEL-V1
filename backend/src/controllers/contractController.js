const Contract = require('../models/Contract');
const Project = require('../models/Project');
const Bid = require('../models/Bid');

// SAFE MODE: Email removed to prevent server freeze.
// Database updates instantly (0.2s response time).

const createContract = async (req, res) => {
  try {
    const { bidId } = req.body;
    const bid = await Bid.findById(bidId).populate('project');
    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    if (bid.project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const contract = await Contract.create({
      project: bid.project._id,
      client: req.user._id,
      contractor: bid.contractor,
      bid: bid._id,
      terms: { amount: bid.bidAmount, days: bid.daysToComplete }
    });

    await Project.findByIdAndUpdate(bid.project._id, { status: 'IN_PROGRESS' });
    await Bid.findByIdAndUpdate(bidId, { status: 'ACCEPTED' });

    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({ contractor: req.user._id })
      .populate('project')
      .populate('client', 'name email');
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deliverWork = async (req, res) => {
  try {
    const { projectId, workLink, notes } = req.body;
    const contract = await Contract.findOne({ 
      project: projectId, 
      contractor: req.user._id,
      status: 'ACTIVE'
    });

    if (!contract) return res.status(404).json({ message: 'No active contract found.' });

    contract.status = 'WORK_SUBMITTED'; 
    contract.workSubmission = { link: workLink, notes: notes };
    await contract.save();

    await Project.findByIdAndUpdate(projectId, { 
        status: 'WORK_SUBMITTED',
        workSubmissionLink: workLink 
    });

    res.json({ message: 'Work submitted! Waiting for client approval.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const releasePayment = async (req, res) => {
  try {
    // 1. OPTIMIZATION: Check Project ID first (since frontend sends that)
    let contract = await Contract.findOne({ project: req.params.id });

    // Fallback: If not found via project, check if it's a direct contract ID
    if (!contract) {
       contract = await Contract.findById(req.params.id);
    }

    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    // 2. Update DB
    contract.status = 'COMPLETED';
    contract.escrowStatus = 'RELEASED';
    await contract.save();
    
    await Project.findByIdAndUpdate(contract.project, { status: 'COMPLETED' });

    // 3. Return Success Instantly
    return res.status(200).json({ message: 'Payment released successfully!' });

  } catch (error) {
    console.error("Payment Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createContract, getMyContracts, deliverWork, releasePayment };
