# Tower Office Rental Management System

A professional web application for managing and promoting office spaces in a tower building.

## Features

### Public Website
- Browse available office floors with filtering
- View detailed floor information
- Submit rental inquiries
- View tower amenities and information
- Responsive design for all devices

### Admin Dashboard
- Secure authentication with JWT
- Manage floors (CRUD operations)
- View and manage inquiries
- Dashboard with analytics and statistics
- Update floor availability status

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- RESTful API design

### Frontend
- React with functional components
- Tailwind CSS for styling
- React Router for navigation
- Formik & Yup for forms
- Framer Motion for animations
- Chart.js for data visualization

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configurations
npm run dev