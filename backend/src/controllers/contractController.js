const Contract = require('../models/Contract');
const Project = require('../models/Project');
const Bid = require('../models/Bid');
const User = require('../models/User'); 
const { generateInvoice } = require('../utils/invoiceGenerator');
const sendEmail = require('../utils/emailService'); 

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
    
    console.log('\n========================================');
    console.log('🚀 WORK SUBMISSION STARTED');
    console.log('========================================');
    console.log('Project ID:', projectId);
    console.log('Contractor:', req.user.name);
    console.log('Work Link:', workLink);
    console.log('========================================\n');
    
    // 1. Find the Contract
    const contract = await Contract.findOne({ 
      project: projectId, 
      contractor: req.user._id,
      status: 'ACTIVE'
    }).populate('client').populate('contractor');

    if (!contract) {
      console.log('❌ No active contract found');
      return res.status(404).json({ message: 'No active contract found.' });
    }

    console.log('✅ Contract found:', contract._id);
    console.log('   Client:', contract.client.name, '(' + contract.client.email + ')');
    console.log('   Amount: $' + contract.terms.amount);

    // 2. Save Work Details
    contract.status = 'COMPLETED'; 
    contract.escrowStatus = 'RELEASED'; 
    contract.submission = { workLink, notes, submittedAt: new Date() };
    await contract.save();
    console.log('✅ Contract updated to COMPLETED');

    // 3. Update Project Status
    await Project.findByIdAndUpdate(projectId, { status: 'COMPLETED' });
    console.log('✅ Project marked as COMPLETED');

    // 4. TRANSFER FUNDS (Wallet Simulation)
    await User.findByIdAndUpdate(contract.client._id, { 
        $inc: { walletBalance: -contract.terms.amount } 
    });
    await User.findByIdAndUpdate(contract.contractor._id, { 
        $inc: { walletBalance: contract.terms.amount } 
    });
    console.log('✅ Payment transferred: $' + contract.terms.amount);
    console.log('   From:', contract.client.name);
    console.log('   To:', contract.contractor.name);

    // 5. GENERATE INVOICE HTML
    console.log('\n📄 Generating Invoice...');
    const invoiceData = {
        _id: contract._id,
        agreedAmount: contract.terms.amount
    };
    
    const htmlInvoice = await generateInvoice(invoiceData, contract.contractor, contract.client);
    console.log('✅ Invoice HTML generated (' + (htmlInvoice.length / 1024).toFixed(2) + ' KB)');

    // 6. EMAIL THE INVOICE
    console.log('\n📧 Sending Email with Invoice...');
    await sendEmail({
      email: contract.client.email,
      subject: `Work Delivered - Invoice #${contract._id.toString().slice(-8).toUpperCase()}`,
      message: `Hello ${contract.client.name},

The contractor ${contract.contractor.name} has successfully completed and submitted the work for your project.

Work Submission Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📎 Work Link: ${workLink}
📝 Notes: ${notes}
💵 Amount Paid: $${contract.terms.amount}
📅 Submitted: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please find the invoice attached to this email.

Thank you for using PROPEL!

Best regards,
PROPEL Team`,
      attachments: [{
        filename: `Invoice_${contract._id}.html`,
        content: htmlInvoice,
        encoding: 'base64',
        contentType: 'text/html'
      }]
    });

    console.log('\n========================================');
    console.log('🎉 WORK SUBMISSION COMPLETED SUCCESSFULLY');
    console.log('========================================');
    console.log('✅ Contract Status: COMPLETED');
    console.log('✅ Payment: RELEASED');
    console.log('✅ Invoice: GENERATED & EMAILED');
    console.log('========================================\n');

    res.json({ 
      message: 'Work submitted, Payment released, and Invoice sent!',
      contract: contract._id,
      amount: contract.terms.amount
    });
  } catch (error) {
    console.error('\n========================================');
    console.error('❌ WORK SUBMISSION FAILED');
    console.error('========================================');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('========================================\n');
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createContract, getMyContracts, deliverWork };
