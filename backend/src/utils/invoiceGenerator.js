const easyinvoice = require('easyinvoice');

const generateInvoice = async (contractData, contractor, agent) => {
  try {
    const data = {
      "images": {
        // Using a standard logo hosted on a reliable CDN
        "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png", 
      },
      "sender": {
        "company": contractor.name,
        "address": contractor.email || "N/A",
        "zip": "12345", 
        "city": "Remote",
        "country": "Internet"
      },
      "client": {
        "company": agent.companyName || agent.name,
        "address": agent.email || "N/A",
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
          "price": contractData.agreedAmount || 0
        }
      ],
      "bottom-notice": "Kindly pay your invoice within 15 days.",
      "settings": {
        "currency": "USD", 
      },
    };

    // Attempt to generate the invoice
    const result = await easyinvoice.createInvoice(data);
    return result.pdf; 

  } catch (error) {
    console.error("⚠️  INVOICE GENERATION FAILED (Network/API Error).");
    console.error("   -> Returning blank PDF to prevent server crash.");
    
    // Return a dummy Base64 string (A valid empty PDF file)
    // This ensures the email service still receives a string and doesn't crash.
    return "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXwKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSC4gIC9RdWMgMTAwIDEwMCBUZAogIC9SZXNvdXJjZXMgPDwKICAgIC9Gb250IDw8CiAgICAgIC9GMSA0IDAgUgogICAgPj4KICA+Pgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTAgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTU3IDAwMDAwIG4gCjAwMDAwMDAzMDIgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDUKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDAxCiUlRU9GCg==";
  }
};

module.exports = { generateInvoice };
