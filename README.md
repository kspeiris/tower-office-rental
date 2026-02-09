# 🏢 TowerSpace Office Rental Management System

[![Framework: React](https://img.shields.io/badge/Framework-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Style: Tailwind CSS](https://img.shields.io/badge/Style-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Backend: Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

---

## 🌟 Overview

**TowerSpace** is a high-end, professional management platform designed for grade-A commercial real estate. It offers a seamless experience for potential tenants to explore premium office spaces and a robust administrative suite for building managers to handle inventory and inquiries.

> *Experience the perfect blend of architectural elegance and technological innovation.*

---

## 💎 Design Identity: "Emerald & Gold"

The platform features a **"Corporate + Premium"** aesthetic, utilizing a sophisticated color palette:

*   🍃 **Modern Emerald** (`#14b8a6`) - Growth and Vitality
*   🌊 **Architectural Teal** (`#0d9488`) - Professionalism and Stability
*   ✨ **Architectural Gold** (`#d79f22`) - Luxury and Excellence
*   🌌 **Midnight Navy** (`#0f172a`) - Authority and Depth

---

## 🚀 Features

### 🏢 Public Experience
*   🔍 **Registry Exploration**: Advanced filtering by area, budget, and availability.
*   📸 **Visual Portfolio**: High-resolution image galleries for every floor.
*   📫 **Command Inquiries**: Professional inquiry system with automated tracking.
*   ✨ **Amenities Vault**: Detailed showcase of world-class building facilities.
*   🌓 **Dual-Theme Support**: Seamless transition between sophisticated Light and Dark modes.

### 🔐 Admin Suite
*   📊 **Analytics Dashboard**: Real-time visualization of occupancy and inquiry trends.
*   🗂️ **Inventory Command**: Full CRUD operations for floor management.
*   📨 **Inquiry Console**: Centralized management of potential tenant leads.
*   🛡️ **JWT Security**: Enterprise-grade authentication and route protection.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Component-based UI library
- **Tailwind CSS** - Utility-first styling with custom dual-theme logic
- **Framer Motion** - Premium micro-interactions and transitions
- **Formik & Yup** - Robust form handling and validation
- **React Helmet Async** - SEO optimization for every page

### Backend
- **Node.js & Express** - Scalable server architecture
- **MongoDB & Mongoose** - Flexible NoSQL data modeling
- **Cloudinary** - Optimized asset management for floor imagery
- **JSON Web Tokens** - Secure stateless authentication

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Atlas or Local)
- Cloudinary Account (for image hosting)

### 1. Repository Setup
```bash
git clone <repository-url>
cd tower-office-rental
```

### 2. Backend Configuration
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Configuration
```bash
cd ../frontend
npm install
```
Run the application:
```bash
npm run dev
```

---

## 📁 Project Structure

```bash
tower-office-rental/
├── backend/                # Express API Server
│   ├── src/
│   │   ├── controllers/    # Request logic
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API endpoints
│   │   └── middleware/     # Auth & validation
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views
│   │   ├── services/       # API interaction layer
│   │   └── styles/         # Tailwind & Global CSS
└── README.md
```

---

## 📜 License

Governed by Metropolis Commercial Privacy Acts and Strategic Governance Protocols. 

Designed with Excellence by **Antigravity**.