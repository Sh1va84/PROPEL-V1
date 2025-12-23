# Propel

**A secure, escrow-based freelance marketplace connecting clients with skilled contractors.**

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-forestgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind](https://img.shields.io/badge/Style-Tailwind%20CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)]()

**Live Demo:** [https://propel-v1-pebl.vercel.app](https://propel-v1-pebl.vercel.app) 

---

## Overview

Propel is a decentralized work order management system designed to solve the fundamental trust problem in freelancing. The platform features automated work verification, secure escrow-based fund management, and instant invoice generation—creating a transparent, reliable environment for both clients and contractors.

---

## Key Features

### Secure Escrow System
Propel addresses the core trust issue in freelance work through a robust escrow mechanism. Funds are deducted upon contractor hire but held in a secure state until work completion is verified.

**Escrow Flow:** `HELD` → `RELEASED` or `REFUNDED`

This dual-protection model ensures contractors know funds are committed while clients maintain control over fund release based on work quality.

### Internal Invoice Engine
Built with a custom invoice generation system that eliminates dependency on external APIs.

- **High Performance:** Generates receipts in under 10ms
- **Fault Tolerant:** Operates offline with graceful handling of incomplete data
- **Compliance Ready:** Automatically generates PDF receipts upon fund release

### Intelligent Workflows

**For Clients:**
- Post work orders with detailed requirements
- Review and compare contractor bids
- Manage active contracts with revision capabilities
- Track project completion and budget allocation

**For Contractors:**
- Browse marketplace opportunities
- Submit competitive proposals
- Deliver work via integrated link submission (GitHub, Figma, etc.)
- Track earnings and payment history

### Real-Time Dashboard
Comprehensive analytics tracking total budget allocation, active jobs, and completed contracts with visual status indicators: `OPEN`, `IN_PROGRESS`, `WORK_SUBMITTED`, and `COMPLETED`.

---

## Technical Architecture

### Stack Overview

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, Vite, Tailwind CSS, Lucide React, Axios, React Hot Toast |
| **Backend** | Node.js, Express.js, RESTful API Architecture |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js |
| **Deployment** | Vercel (Frontend), Render (Backend) |
| **Infrastructure** | Custom Invoice Engine, Nodemailer |

---

## System Design: Payment Flow

The platform implements a comprehensive payment lifecycle that prioritizes security and transparency:

1. **Contract Creation:** Client accepts a contractor bid, creating a new contract instance. Funds are logically allocated to escrow with `HELD` status.

2. **Development Phase:** Contractor views the job with `IN_PROGRESS` status and begins work.

3. **Work Submission:** Upon completion, contractor submits deliverable link. System updates status to `WORK_SUBMITTED`.

4. **Review & Approval:**
   - **Approval Path:** Client releases funds, triggering status change to `COMPLETED` and automatic invoice generation.
   - **Revision Path:** Client requests modifications, reverting status to `IN_PROGRESS`.

---

## Local Development Setup

### Prerequisites
- Node.js v16 or higher
- MongoDB instance or Atlas URI
- npm or yarn package manager

### Installation

**1. Clone Repository**
```bash
git clone https://github.com/your-username/propel.git
cd propel
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
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

Start backend server:
```bash
npm run dev
```

**3. Frontend Configuration**
```bash
cd client
npm install
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

---

## API Documentation

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user (Client/Contractor) |
| `POST` | `/api/auth/login` | Authenticate existing user |
| `POST` | `/api/projects` | Create new work order |
| `GET` | `/api/projects` | Retrieve available projects |
| `POST` | `/api/bids/:id` | Submit bid on project |
| `POST` | `/api/contracts/deliver` | Submit completed work |
| `PUT` | `/api/contracts/:id/pay` | Release escrow funds & generate invoice |

---

## UPCOMING FEATURES

**Phase 1: Core Enhancements**
- Integration with Stripe Connect for real fiat currency transactions
- Advanced search and filtering capabilities
- User rating and review system

**Phase 2: Communication**
- Real-time chat system using Socket.io
- In-app notification center
- Email digest system

**Phase 3: Media & Storage**
- File upload system (AWS S3 or Cloudinary)
- Document version control
- Secure attachment sharing

---

## Contributing

Contributions are welcome. Please fork the repository and submit pull requests for any enhancements.

---

## Author

**Shiva**  
Full Stack Developer  

[LinkedIn](https://www.linkedin.com/in/shiva-619851375/) • [GitHub](https://github.com/Sh1va84) • [Portfolio](https://your-portfolio.com)

---

## License

This project is licensed under the MIT License.

---

Built for the freelance community with a focus on trust, transparency, and efficient workflows.
