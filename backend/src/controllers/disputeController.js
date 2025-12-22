const Dispute = require('../models/Dispute');
const Contract = require('../models/Contract');

// @desc    Open a dispute
// @route   POST /api/disputes
const createDispute = async (req, res, next) => {
  try {
    const { contractId, reason, description } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      res.status(404);
      throw new Error('Contract not found');
    }

    // Determine defendant (the person NOT raising the dispute)
    const defendantId = contract.agentId.toString() === req.user.id 
      ? contract.contractorId 
      : contract.agentId;

    const dispute = await Dispute.create({
      contractId,
      raisedBy: req.user.id,
      defendant: defendantId,
      reason,
      description,
      status: 'OPEN'
    });

    // Freeze the contract
    contract.status = 'DISPUTED';
    await contract.save();

    res.status(201).json(dispute);
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve a dispute (Admin only)
// @route   PUT /api/disputes/:id/resolve
const resolveDispute = async (req, res, next) => {
  try {
    const { resolutionSummary, action } = req.body; // action: 'REFUND_AGENT' or 'PAY_CONTRACTOR'
    const dispute = await Dispute.findById(req.params.id).populate('contractId');

    if (!dispute) {
      res.status(404);
      throw new Error('Dispute not found');
    }

    dispute.resolutionSummary = resolutionSummary;
    dispute.status = action === 'REFUND_AGENT' ? 'RESOLVED_REFUND' : 'RESOLVED_PAYOUT';
    dispute.resolvedAt = Date.now();
    await dispute.save();

    // Update Contract and Money logic based on decision
    const contract = dispute.contractId;
    contract.status = 'TERMINATED';
    contract.escrowStatus = action === 'REFUND_AGENT' ? 'REFUNDED' : 'RELEASED';
    await contract.save();

    res.json(dispute);
  } catch (error) {
    next(error);
  }
};

module.exports = { createDispute, resolveDispute };