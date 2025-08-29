# Mexican Pickleball Federation Platform

A comprehensive platform for the Mexican Pickleball Federation with complete microsite management system, tournament organization, player finder, court reservations, and more.

## 🏆 Features

### ✅ Complete Microsite Management System
- **Drag-and-drop page builder** with 10+ content block types
- **Theme customization** with 6 professional templates
- **Media library** with upload and management capabilities
- **SEO optimization** tools integrated throughout
- **Responsive design** for all devices
- **Real-time preview** and live editing

### 🎯 Core Platform Features
- **User Management** - Players, Coaches, Clubs, Partners, State Committees
- **Tournament System** - Complete tournament organization and management
- **Court Reservations** - Court booking and availability system
- **Player Finder** - Location-based player matching (premium)
- **Ranking System** - National and state-level player rankings
- **Payment Integration** - Stripe-powered membership and fees
- **Messaging System** - Internal communication platform
- **Mobile-First Design** - Responsive across all devices

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** 15+ (via Docker or local installation)
- **Docker** and Docker Compose (recommended)

### 1. Clone and Install
```bash
git clone <repository-url>
cd pick-new

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. Start PostgreSQL Database
```bash
# Return to project root
cd ..

# Start PostgreSQL with Docker (recommended)
docker compose up -d postgres

# Initialize database and schema
cd backend
npm run init:db
```

### 3. Start Development Servers
```bash
# Start backend (from backend directory)
npm run dev

# In another terminal, start frontend (from frontend directory)
cd ../frontend
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Microsites**: http://microsites.localhost:3000

## 🗄️ Database Setup

This project uses **PostgreSQL** exclusively (SQLite has been completely removed).

### Docker Setup (Recommended)
```bash
# Start PostgreSQL container
docker compose up -d postgres

# Initialize database
cd backend
npm run init:db

# Test connection
npm run test:db
```

### Manual PostgreSQL Setup
See detailed instructions in: [`POSTGRESQL_SETUP.md`](POSTGRESQL_SETUP.md)

## 📁 Project Structure

```
pick-new/
├── backend/                 # Node.js/TypeScript API
│   ├── src/
│   │   ├── controllers/     # API route controllers
│   │   ├── models/         # Sequelize models
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   └── config/         # Configuration files
│   ├── database/           # Seeders and migrations
│   └── test-*.js          # Database utilities
├── frontend/               # React/TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── microsites/ # Microsite management system
│   │   │   ├── ui/         # Reusable UI components
│   │   │   └── common/     # Shared components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   └── services/       # API services
├── docker-compose.yml      # Docker configuration
├── database_schema.sql     # Complete PostgreSQL schema
└── POSTGRESQL_SETUP.md     # Database setup guide
```

## 🎨 Microsite Management System

The crown jewel of this platform - a complete microsite builder for organizations:

### ✨ Key Features
- **Visual Page Builder** - Drag-and-drop interface for creating pages
- **10+ Content Blocks** - Text, Image, Gallery, Video, Contact, Map, Court List, Tournament List, Calendar, Custom HTML
- **Theme System** - 6 professional templates with full customization
- **Media Management** - Integrated media library with upload capabilities
- **SEO Tools** - Complete SEO optimization for all pages and sites
- **Real-time Preview** - See changes instantly as you build
- **Responsive Design** - Mobile-first, works on all devices

### 🏗️ Technical Architecture
- **Redux Toolkit** for state management with real-time updates
- **TypeScript** throughout for type safety
- **Drag-and-drop** powered by native HTML5 APIs
- **Modal-based editing** for focused content creation
- **Optimized performance** with proper memoization
- **Modular components** for maintainability

## 🧪 Testing and Development

### Database Operations
```bash
# Test database connection
npm run test:db

# Initialize/reset database
npm run init:db

# Seed with sample data
npm run seed:microsites
```

### Development Commands
```bash
# Backend development
cd backend
npm run dev

# Frontend development  
cd frontend
npm run dev

# Build for production
npm run build
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f
```

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pickleball_federation
DB_USER=postgres
DB_PASSWORD=password

# JWT Secrets
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# External Services (Optional)
STRIPE_SECRET_KEY=sk_...
CLOUDINARY_URL=cloudinary://...
```

## 📊 Database Schema

Complete PostgreSQL schema with:
- **32 Mexican states** pre-populated
- **User system** with role-based access
- **Tournament management** with categories and brackets
- **Court booking system** with availability
- **Player finder** with geolocation
- **Payment system** with Stripe integration
- **Microsite system** with flexible content
- **Comprehensive indexes** for performance

## 🎯 User Roles

- **Players** - Tournament participation, court booking, player finder
- **Coaches** - Training management, certification system
- **Clubs** - Member management, court facilities, microsites
- **Partners** - Business partnerships, premium features
- **State Committees** - Regional administration, tournament oversight
- **Federation** - Platform administration, system management

## 🔧 API Documentation

The backend provides a comprehensive REST API:
- **Authentication** - JWT-based with refresh tokens
- **User Management** - CRUD operations for all user types
- **Tournaments** - Complete tournament lifecycle management
- **Courts** - Booking, availability, and management
- **Microsites** - Full CRUD for microsite builder
- **Payments** - Stripe integration for memberships and fees

## 📱 Mobile Support

- **Responsive design** works on all screen sizes
- **Touch-friendly** interface optimized for mobile
- **Progressive Web App** capabilities
- **Offline support** for critical features

## 🏅 Achievements

✅ **Complete microsite management system** - Professional-grade website builder
✅ **PostgreSQL migration** - Robust, scalable database solution  
✅ **Modern tech stack** - React, TypeScript, Node.js, Sequelize
✅ **Production-ready** - Docker deployment, environment configuration
✅ **Comprehensive features** - Tournament management, payments, user system
✅ **Mexican market ready** - Localized for Mexican Pickleball Federation

## 📞 Support

For technical support or questions about the microsite management system, refer to the comprehensive documentation in the codebase and the PostgreSQL setup guide.

---

**Built with ❤️ for the Mexican Pickleball Federation**