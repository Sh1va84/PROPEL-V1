const easyinvoice = require('easyinvoice');

const generateInvoice = async (contractData, contractor, agent) => {
  const data = {
    "images": {
      // Optional: Add your logo URL here or base64
      "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", 
    },
    "sender": {
      "company": contractor.name,
      "address": contractor.email,
      "zip": "12345", // Mock data
      "city": "Remote",
      "country": "Internet"
    },
    "client": {
      "company": agent.companyName || agent.name,
      "address": agent.email,
      "zip": "54321",
      "city": "Client City",
      "country": "Client Country"
    },
    "information": {
      "number": contractData._id.toString().slice(-6).toUpperCase(),
      "date": new Date().toISOString().split('T')[0],
      "due-date": new Date().toISOString().split('T')[0]
    },
    "products": [
      {
        "quantity": 1,
        "description": "Project Development Services",
        "tax-rate": 0,
        "price": contractData.agreedAmount
      }
    ],
    "bottom-notice": "Kindly pay your invoice within 15 days.",
    "settings": {
      "currency": "USD", 
    },
  };

  const result = await easyinvoice.createInvoice(data);
  return result.pdf; // Returns base64 string of the PDF
};

module.exports = { generateInvoice };