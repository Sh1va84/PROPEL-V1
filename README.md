# PROPEL - Property Maintenance Management System

**A comprehensive platform connecting Property Managers with Trade Contractors for efficient maintenance workflow management.**

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-forestgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind](https://img.shields.io/badge/Style-Tailwind%20CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)]()

**Live Demo:** [https://propel-v1-pebl.vercel.app](https://propel-v1-pebl.vercel.app)

---

## Overview

PROPEL is a specialized property maintenance management system designed for the letting and property management industry. The platform streamlines the entire maintenance workflow—from reporting property issues to contractor payment—ensuring transparency, efficiency, and professional service delivery across rental property portfolios.

---

## Key Features

### Property-Focused Workflow Management
The platform addresses the unique challenges of property maintenance coordination, enabling property managers to efficiently handle maintenance requests across multiple rental units while maintaining complete oversight and control.

**Maintenance Categories Supported:**
- Plumbing (Emergency Leaks, Boiler Repairs, Drainage Issues)
- Electrical (Wiring, Safety Inspections, Lighting)
- HVAC (Heating Systems, Cooling Units, Ventilation)
- Carpentry & Joinery
- Painting & Decorating
- Roofing & Guttering
- Appliance Repair
- General Property Maintenance

### Complete Maintenance Lifecycle

**Status Flow:** `OPEN` → `IN_PROGRESS` → `WORK_SUBMITTED` → `COMPLETED`

1. **Maintenance Request Creation**
   - Property managers create detailed maintenance requests
   - Specify property address, urgency level, and required trade
   - Set budgets and completion deadlines

2. **Trade Contractor Bidding**
   - Vetted contractors (Plumbers, Electricians, Gas Safe Engineers, etc.)
   - Submit professional quotes with timelines
   - Include detailed proposals and credentials

3. **Contract Award & Work Execution**
   - Property managers review and compare quotes
   - Award contracts to preferred contractors
   - Track work progress in real-time

4. **Work Verification & Payment**
   - Contractors submit completed work with photo/document evidence
   - Property managers review deliverables
   - Approve work and release payment with automatic invoice generation

### Secure Escrow System
Funds are committed upon contractor hire but held securely until work completion is verified by the property manager. This protects both parties and ensures quality service delivery.

**Escrow Flow:** `HELD` → `RELEASED` (upon approval) or `REFUNDED` (if work rejected)

### Automated Invoice Generation
Professional PDF invoices are automatically generated upon payment release, including:
- Property details and maintenance description
- Contractor credentials and contact information
- Transaction breakdown and payment confirmation
- Company branding and compliance information

Invoices are automatically emailed to property managers for record-keeping and accounting purposes.

### Real-Time Dashboard Analytics
Property managers can track:
- Total maintenance requests posted
- Active ongoing jobs
- Completed maintenance work
- Budget allocation across properties
- Contractor performance metrics

---

## Technical Architecture

### Stack Overview

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, Vite, Tailwind CSS, Lucide React, Axios, React Hot Toast |
| **Backend** | Node.js, Express.js, RESTful API Architecture |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js |
| **Invoice Generation** | PDFKit (Custom Internal Engine) |
| **Email Service** | Nodemailer with Gmail SMTP |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## System Design: Maintenance Request Flow

The platform implements a comprehensive workflow optimized for property maintenance:

1. **Request Creation:** Property manager creates maintenance request specifying property address, issue category, urgency level, and budget.

2. **Quote Submission:** Trade contractors browse available requests and submit competitive quotes with timelines and detailed proposals.

3. **Contract Award:** Property manager reviews quotes, checks contractor credentials, and awards the contract. System creates binding contract instance with escrow status `HELD`.

4. **Work Execution:** Contractor performs maintenance work with status `IN_PROGRESS`.

5. **Work Submission:** Contractor uploads documentation (photos, completion reports) via cloud storage links. Status updates to `WORK_SUBMITTED`.

6. **Review & Payment:**
   - **Approval Path:** Property manager verifies work quality, releases payment (escrow → `RELEASED`), triggering automatic PDF invoice generation and email delivery.
   - **Revision Path:** Property manager requests corrections, status reverts to `IN_PROGRESS`.

---

## Local Development Setup

### Prerequisites
- Node.js v16 or higher
- MongoDB instance or Atlas URI
- npm or yarn package manager
- Gmail account with App Password (for email functionality)

### Installation

**1. Clone Repository**
```bash
git clone https://github.com/Sh1va84/PROPEL-V1.git
cd PROPEL-V1
```

**2. Backend Configuration**
```bash
cd backend
npm install
```

Create `.env` file with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Email Configuration (Optional for invoice delivery)
SMTP_EMAIL=your_gmail_address
SMTP_PASSWORD=your_gmail_app_password
FROM_NAME=Propel Platform
```

**Obtaining Gmail App Password:**
1. Enable 2-Factor Authentication on your Gmail account
2. Visit: https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Copy the 16-character password (remove spaces)
5. Add to `.env` file

Start backend server:
```bash
npm run dev
```

**3. Frontend Configuration**
```bash
cd frontend
npm install
```

Update API base URL in `src/utils/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

Start frontend:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

---

## API Documentation

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user (Property Manager/Contractor) |
| `POST` | `/api/auth/login` | Authenticate existing user |
| `POST` | `/api/projects` | Create new maintenance request |
| `GET` | `/api/projects` | Retrieve available maintenance requests |
| `GET` | `/api/projects/:id` | Get specific maintenance request details |
| `POST` | `/api/bids/:id` | Submit quote on maintenance request |
| `GET` | `/api/bids/:id` | Retrieve quotes for specific request |
| `POST` | `/api/contracts` | Award contract to contractor |
| `GET` | `/api/contracts/my-contracts` | Get user's contracts |
| `POST` | `/api/contracts/deliver` | Submit completed maintenance work |
| `PUT` | `/api/contracts/:id/pay` | Release payment & generate invoice |

---

## Testing the Platform

### Complete Workflow Test

**1. Register as Property Manager (Agent)**
- Navigate to registration page
- Select "Agent" role
- Complete registration with valid email

**2. Create Maintenance Request**
- Login as Property Manager
- Click "New Maintenance Request"
- Fill in details:
  - Title: "Emergency Boiler Repair - Flat 4B"
  - Property Address: "123 Main Street, London, SW1A 1AA"
  - Category: "HVAC"
  - Urgency: "Emergency"
  - Budget: £500
  - Deadline: 7 days
- Add deliverables checklist (optional)
- Submit request

**3. Register as Trade Contractor**
- Logout and register new account
- Select "Contractor" role
- Complete registration

**4. Submit Quote**
- Login as Contractor
- Browse available maintenance requests
- Click "View & Submit Quote" on the boiler repair request
- Enter quote amount: £450
- Timeline: 3 days
- Proposal: Detailed description of repair approach
- Submit quote

**5. Award Contract**
- Logout and login as Property Manager
- View maintenance request
- Review contractor's quote
- Click "Award Contract"

**6. Submit Completed Work**
- Login as Contractor
- Navigate to active contract
- Click "Submit Completed Work"
- Enter link to work evidence (Google Drive, Imgur, etc.)
- Add completion notes
- Submit

**7. Approve & Release Payment**
- Login as Property Manager
- View submitted work
- Review documentation
- Click "Approve & Release Payment"
- System generates PDF invoice automatically
- Invoice emailed to property manager

---

## Project Structure
```
PROPEL-V1/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── bidController.js
│   │   └── contractController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Bid.js
│   │   └── Contract.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── bidRoutes.js
│   │   └── contractRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   ├── emailService.js
│   │   └── invoiceGenerator.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── AgentDashboard.jsx
│   │   │   └── ContractorDashboard.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CreateProject.jsx
│   │   │   └── ProjectDetails.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── utils/
│   │       └── api.js
│   └── index.html
└── README.md
```

---

## Key Differentiators

### Industry-Specific Design
Unlike generic freelance platforms, PROPEL is purpose-built for property maintenance management with:
- Property address tracking
- Maintenance category taxonomy
- Urgency level prioritization
- Trade-specific contractor filtering

### Professional Documentation
Automated PDF invoice generation with property-specific details ensures compliance and professional record-keeping.

### Escrow Protection
Dual-protection model safeguards both property managers (quality assurance) and contractors (payment guarantee).

### Scalability
Built on modern cloud infrastructure, the platform can handle:
- Multiple properties per manager
- Concurrent maintenance requests
- Large contractor networks
- High-volume document processing

---

## Future Enhancements

**Phase 1: Property Management Features**
- Multi-property portfolio management
- Tenant maintenance request portal
- Recurring maintenance scheduling
- Contractor rating and review system

**Phase 2: Advanced Analytics**
- Maintenance cost tracking per property
- Contractor performance metrics
- Predictive maintenance suggestions
- Budget forecasting tools

**Phase 3: Integration & Automation**
- Property management software integration (e.g., Arthur Online, Reapit)
- Automated contractor matching based on location and specialty
- SMS notifications for urgent requests
- Mobile app for on-site contractors

---

## Security & Compliance

- **Data Protection:** All sensitive data encrypted at rest and in transit
- **Authentication:** JWT-based secure authentication with bcrypt password hashing
- **Role-Based Access Control:** Strict separation between property manager and contractor permissions
- **Payment Security:** Escrow system ensures funds are protected until work verification
- **Audit Trail:** Complete transaction history for compliance and dispute resolution

---

## Support & Documentation

For technical issues or feature requests, please:
1. Check existing GitHub issues
2. Review API documentation above
3. Contact: shiva91official@gmail.com

---

## Author

**Shiva**  
Roll Number: 22BEC091  
B.Tech - Electronics & Communication Engineering  
National Institute of Technology, Hamirpur

[LinkedIn](https://www.linkedin.com/in/shiva-619851375/) • [GitHub](https://github.com/Sh1va84)

---

## License

This project is licensed under the MIT License.

---

**Built for the Property & Letting industry with a focus on efficiency, transparency, and professional service delivery.**
