const PDFDocument = require('pdfkit');

const generateInvoice = async (contractData, contractor, agent) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`[Invoice Generator] Creating invoice for Contract: ${contractData._id}`);
      
      // Create PDF document
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks = [];
      
      // Collect PDF data in memory
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        const base64 = pdfBuffer.toString('base64');
        console.log(`[Invoice Generator] ✅ Invoice generated successfully`);
        resolve(base64);
      });
      doc.on('error', reject);
      
      // ============================================
      // INVOICE HEADER
      // ============================================
      
      // Company name/logo area
      doc.fontSize(28)
         .fillColor('#6B46C1')
         .text('PROPEL', 50, 50);
      
      doc.fontSize(10)
         .fillColor('#666666')
         .text('Property Management Platform', 50, 85);
      
      // Invoice title
      doc.fontSize(24)
         .fillColor('#000000')
         .text('INVOICE', 400, 50, { align: 'right' });
      
      // Horizontal line
      doc.moveTo(50, 120)
         .lineTo(550, 120)
         .strokeColor('#E5E7EB')
         .stroke();
      
      // ============================================
      // INVOICE INFO (Right side)
      // ============================================
      
      doc.fontSize(10)
         .fillColor('#666666')
         .text('Invoice Number:', 400, 140)
         .fillColor('#000000')
         .text(`INV-${contractData._id.toString().slice(-8).toUpperCase()}`, 400, 155);
      
      doc.fillColor('#666666')
         .text('Date:', 400, 175)
         .fillColor('#000000')
         .text(new Date().toLocaleDateString('en-GB'), 400, 190);
      
      doc.fillColor('#666666')
         .text('Status:', 400, 210)
         .fillColor('#10B981')
         .fontSize(11)
         .text('PAID', 400, 225);
      
      // ============================================
      // FROM / TO SECTION
      // ============================================
      
      doc.fontSize(12)
         .fillColor('#000000')
         .text('FROM:', 50, 140);
      
      doc.fontSize(10)
         .fillColor('#666666')
         .text(contractor?.name || 'Contractor', 50, 160)
         .text(contractor?.email || 'N/A', 50, 175);
      
      doc.fontSize(12)
         .fillColor('#000000')
         .text('BILL TO:', 50, 210);
      
      doc.fontSize(10)
         .fillColor('#666666')
         .text(agent?.name || 'Property Manager', 50, 230)
         .text(agent?.email || 'N/A', 50, 245);
      
      // ============================================
      // PROJECT DETAILS
      // ============================================
      
      doc.moveTo(50, 280)
         .lineTo(550, 280)
         .strokeColor('#E5E7EB')
         .stroke();
      
      doc.fontSize(12)
         .fillColor('#000000')
         .text('PROJECT DETAILS', 50, 300);
      
      doc.fontSize(10)
         .fillColor('#666666')
         .text('Project:', 50, 325)
         .fillColor('#000000')
         .text(contractData.project?.title || 'Maintenance Work', 150, 325, { width: 350 });
      
      doc.fillColor('#666666')
         .text('Description:', 50, 345)
         .fillColor('#000000')
         .text(contractData.project?.description || 'Property maintenance services', 150, 345, { width: 350 });
      
      doc.fillColor('#666666')
         .text('Timeline:', 50, 380)
         .fillColor('#000000')
         .text(`${contractData.terms?.days || 'N/A'} days`, 150, 380);
      
      // ============================================
      // PAYMENT TABLE
      // ============================================
      
      const tableTop = 430;
      
      // Table header background
      doc.rect(50, tableTop, 500, 30)
         .fillColor('#F3F4F6')
         .fill();
      
      // Table headers
      doc.fontSize(10)
         .fillColor('#374151')
         .text('DESCRIPTION', 60, tableTop + 10)
         .text('AMOUNT', 450, tableTop + 10);
      
      // Table content
      doc.fillColor('#000000')
         .text('Property Maintenance Services', 60, tableTop + 50)
         .fontSize(12)
         .text(`£${contractData.terms?.amount || '0.00'}`, 450, tableTop + 50);
      
      // Subtotal line
      doc.moveTo(50, tableTop + 80)
         .lineTo(550, tableTop + 80)
         .strokeColor('#E5E7EB')
         .stroke();
      
      // Subtotal
      doc.fontSize(10)
         .fillColor('#666666')
         .text('Subtotal:', 370, tableTop + 95)
         .fillColor('#000000')
         .text(`£${contractData.terms?.amount || '0.00'}`, 450, tableTop + 95);
      
      // Total background
      doc.rect(50, tableTop + 120, 500, 40)
         .fillColor('#EEF2FF')
         .fill();
      
      // Total
      doc.fontSize(14)
         .fillColor('#000000')
         .text('TOTAL PAID:', 370, tableTop + 133)
         .fontSize(16)
         .fillColor('#6B46C1')
         .text(`£${contractData.terms?.amount || '0.00'}`, 450, tableTop + 132);
      
      // ============================================
      // PAYMENT INFO
      // ============================================
      
      doc.fontSize(10)
         .fillColor('#666666')
         .text('Payment Method:', 50, tableTop + 185)
         .fillColor('#000000')
         .text('Propel Escrow System', 150, tableTop + 185);
      
      doc.fillColor('#666666')
         .text('Transaction ID:', 50, tableTop + 205)
         .fillColor('#000000')
         .text(contractData._id.toString(), 150, tableTop + 205);
      
      doc.fillColor('#666666')
         .text('Payment Date:', 50, tableTop + 225)
         .fillColor('#000000')
         .text(new Date().toLocaleString('en-GB'), 150, tableTop + 225);
      
      // ============================================
      // FOOTER
      // ============================================
      
      doc.fontSize(8)
         .fillColor('#9CA3AF')
         .text('This is a computer-generated invoice and requires no signature.', 50, 750, {
           align: 'center',
           width: 500
         });
      
      doc.text('Thank you for using Propel Property Management Platform', 50, 765, {
         align: 'center',
         width: 500
       });
      
      // Finalize PDF
      doc.end();
      
    } catch (error) {
      console.error('[Invoice Generator] ❌ Error:', error);
      reject(error);
    }
  });
};

module.exports = { generateInvoice };
