const easyinvoice = require('easyinvoice');

const generateInvoice = async (contractData, contractor, agent) => {
  // Safety Checks: Use 'Unknown' if data is missing
  const con = contractor || {};
  const cli = agent || {};
  
  const data = {
    "images": {
      // Standard placeholder logo
      "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", 
    },
    "sender": {
      "company": con.name || "Contractor",
      "address": con.email || "No Email",
      "zip": "00000",
      "city": "Remote",
      "country": "Global"
    },
    "client": {
      "company": cli.companyName || cli.name || "Valued Client",
      "address": cli.email || "No Email",
      "zip": "11111",
      "city": "Headquarters",
      "country": "USA"
    },
    "information": {
      "number": (contractData._id || "INV-001").toString().slice(-6).toUpperCase(),
      "date": new Date().toISOString().split('T')[0],
      "due-date": new Date().toISOString().split('T')[0]
    },
    "products": [
      {
        "quantity": 1,
        "description": "Project Development Services",
        "tax-rate": 0,
        "price": contractData.terms?.amount || 0
      }
    ],
    "bottom-notice": "Payment has been released via Propel Secure Escrow.",
    "settings": {
      "currency": "USD", 
    },
  };

  const result = await easyinvoice.createInvoice(data);
  return result.pdf;
};

module.exports = { generateInvoice };
