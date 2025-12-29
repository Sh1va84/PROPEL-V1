// SIMPLE HTML INVOICE - NO EXTERNAL DEPENDENCIES
const generateInvoice = async (contractData, contractor, agent) => {
  try {
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 40px 20px; }
        .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 60px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 4px solid #4F46E5; padding-bottom: 30px; margin-bottom: 40px; }
        .header h1 { color: #4F46E5; font-size: 42px; margin-bottom: 10px; letter-spacing: 2px; }
        .invoice-number { color: #6B7280; font-size: 16px; margin-top: 10px; }
        .info-section { display: flex; justify-content: space-between; margin: 40px 0; gap: 40px; }
        .info-box { flex: 1; }
        .info-box h3 { color: #4F46E5; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-bottom: 2px solid #E5E7EB; padding-bottom: 8px; }
        .info-box p { color: #374151; line-height: 1.8; font-size: 15px; }
        .info-box .name { font-weight: 700; font-size: 17px; color: #111827; }
        table { width: 100%; border-collapse: collapse; margin: 40px 0; }
        thead { background: #F9FAFB; }
        th { padding: 15px; text-align: left; font-weight: 600; color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #E5E7EB; }
        td { padding: 20px 15px; color: #4B5563; font-size: 15px; border-bottom: 1px solid #F3F4F6; }
        .amount-section { margin-top: 40px; text-align: right; }
        .total-label { font-size: 18px; color: #6B7280; margin-bottom: 10px; }
        .total-amount { font-size: 48px; color: #10B981; font-weight: 800; letter-spacing: -1px; }
        .footer { margin-top: 60px; text-align: center; padding-top: 30px; border-top: 2px solid #E5E7EB; }
        .footer p { color: #9CA3AF; font-size: 14px; line-height: 1.8; }
        .footer .brand { color: #4F46E5; font-weight: 700; font-size: 16px; }
        .status-badge { display: inline-block; padding: 8px 16px; background: #D1FAE5; color: #065F46; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>📄 INVOICE</h1>
            <div class="invoice-number">Invoice #${contractData._id.toString().slice(-8).toUpperCase()}</div>
            <div class="invoice-number">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div class="status-badge">✓ PAID</div>
        </div>
        <div class="info-section">
            <div class="info-box">
                <h3>From (Contractor)</h3>
                <p class="name">${contractor.name}</p>
                <p>${contractor.email}</p>
            </div>
            <div class="info-box">
                <h3>To (Property Manager)</h3>
                <p class="name">${agent.companyName || agent.name}</p>
                <p>${agent.email}</p>
            </div>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Project Development Services</strong><br><span style="color: #9CA3AF; font-size: 13px;">Work Order Completion & Delivery</span></td>
                    <td style="text-align: center;">1</td>
                    <td style="text-align: right; font-weight: 600;">$${contractData.agreedAmount || 0}</td>
                </tr>
            </tbody>
        </table>
        <div class="amount-section">
            <div class="total-label">Total Amount</div>
            <div class="total-amount">$${contractData.agreedAmount || 0}</div>
            <div style="color: #6B7280; font-size: 14px; margin-top: 5px;">USD</div>
        </div>
        <div class="footer">
            <p>Thank you for your business!</p>
            <p class="brand">PROPEL</p>
            <p style="font-size: 12px;">Work Order Management System</p>
        </div>
    </div>
</body>
</html>`;
    const base64Invoice = Buffer.from(invoiceHTML).toString('base64');
    console.log('✅ Invoice generated successfully');
    return base64Invoice;
  } catch (error) {
    console.error('⚠️ Invoice generation error:', error.message);
    const fallbackHTML = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial; padding: 40px; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #4F46E5; text-align: center;">INVOICE</h1>
    <p><strong>Invoice #:</strong> ${contractData._id.toString().slice(-8)}</p>
    <p><strong>Date:</strong> ${new Date().toDateString()}</p>
    <hr>
    <p><strong>From:</strong> ${contractor.name}</p>
    <p><strong>To:</strong> ${agent.name}</p>
    <hr>
    <h2 style="color: #10B981; text-align: center;">Total: $${contractData.agreedAmount || 0}</h2>
    <p style="text-align: center; color: #666;">Thank you for your business!</p>
</body>
</html>`;
    return Buffer.from(fallbackHTML).toString('base64');
  }
};

module.exports = { generateInvoice };
