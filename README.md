# Testimonial SaaS Platform

A comprehensive SaaS tool for collecting and displaying customer testimonials using a single JavaScript script integration.

## 🚀 Features

- **Single Script Integration** - One script tag to add to any website
- **Testimonial Button** - Customizable floating or inline button
- **Dual Submission Types** - Video and text testimonial collection
- **Theme Management** - Full customization from dashboard
- **Analytics & Tracking** - Complete event tracking system
- **Incentive System** - Credit/reward system for testimonial submissions
- **Security** - Domain validation and rate limiting

## 📁 Project Structure

```
testimonial-saas/
├── backend/          # NestJS backend API
├── frontend/         # Next.js dashboard
├── script/           # Injectable JavaScript script
└── README.md
```

## 🛠️ Tech Stack

- **Backend**: NestJS
- **Database**: MongoDB
- **Frontend Dashboard**: Next.js
- **Injectable Script**: Vanilla JavaScript (Shadow DOM)
- **Video Storage**: Cloudinary

## 🏃 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance
- Cloudinary account

### Installation

```bash
# Install all dependencies
npm run install:all

# Set up environment variables (see individual package READMEs)
```

### Development

```bash
# Start backend (port 3000)
npm run dev:backend

# Start frontend dashboard (port 3001)
npm run dev:frontend

# Build injectable script
npm run build:script
```

## 📦 Packages

### Backend (`/backend`)
NestJS API server handling:
- Site configuration management
- Testimonial CRUD operations
- Analytics event tracking
- Credit/incentive system
- Cloudinary video uploads
- Domain validation & security

### Frontend (`/frontend`)
Next.js dashboard for:
- Site management
- Theme customization (builder)
- Preview functionality
- Analytics dashboard
- Testimonial management

### Script (`/script`)
Injectable JavaScript script providing:
- Dynamic button injection
- Modal/drawer testimonial flow
- Video recording capabilities
- Event tracking
- Theme application

## 🔧 Configuration

Each package has its own README with detailed setup instructions.

## 📄 License

ISC

