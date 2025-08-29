# Step 1: Project Setup and Authentication System

## Overview
This step establishes the foundational project structure with Docker, sets up both frontend (React + Vite + TypeScript + TailwindCSS + Redux) and backend (Node.js + Express + PostgreSQL + Sequelize), and implements a complete authentication system with role-based access control.

## Objectives
- Set up complete project structure with Docker
- Create database connection and models
- Implement JWT-based authentication system
- Build login/logout functionality
- Create protected route system
- Establish Redux store for state management
- Set up API communication layer

## Directory Structure
```
pick-new/
├── docker-compose.yml
├── .env
├── .gitignore
├── README.md
├── database_schema.sql
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── store/
│   │   │   ├── index.ts
│   │   │   ├── authSlice.ts
│   │   │   └── apiSlice.ts
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   └── auth/
│   │   │       ├── LoginForm.tsx
│   │   │       └── LogoutButton.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── authService.ts
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   └── api.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   └── styles/
│   │       └── globals.css
│   └── public/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── server.ts
│   │   ├── app.ts
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── config.ts
│   │   ├── models/
│   │   │   ├── index.ts
│   │   │   ├── User.ts
│   │   │   ├── Player.ts
│   │   │   ├── Coach.ts
│   │   │   ├── Club.ts
│   │   │   ├── Partner.ts
│   │   │   ├── StateCommittee.ts
│   │   │   └── State.ts
│   │   ├── controllers/
│   │   │   └── authController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── cors.ts
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   └── auth.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   └── jwtService.ts
│   │   ├── types/
│   │   │   ├── auth.ts
│   │   │   └── user.ts
│   │   └── utils/
│   │       ├── logger.ts
│   │       └── validators.ts
│   └── .env
└── overview/
```

## Database Setup Tasks
### 1. Docker Configuration
- Create docker-compose.yml with PostgreSQL, backend, and frontend services
- Set up environment variables for database connection
- Configure networking between services

### 2. Database Initialization
- Run database schema creation script
- Seed initial data (Mexican states, membership plans, system settings)
- Set up database migrations system

## Backend Development Tasks
### 1. Project Setup
- Initialize Node.js project with TypeScript
- Install dependencies: express, sequelize, pg, jsonwebtoken, bcryptjs, cors, helmet, dotenv
- Configure TypeScript and ESLint
- Set up folder structure

### 2. Database Models
- Create Sequelize models for core entities:
  - User (base authentication model)
  - State (Mexican states)
  - Player, Coach, Club, Partner, StateCommittee profiles
- Define model relationships and associations
- Set up model validations

### 3. Authentication System
- Implement JWT token generation and validation
- Create password hashing utilities
- Build authentication middleware
- Create role-based authorization middleware

### 4. API Endpoints
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/me - Get current user profile
- GET /api/auth/verify - Verify JWT token
- POST /api/auth/refresh - Refresh JWT token

### 5. Security & Middleware
- CORS configuration
- Helmet for security headers
- Rate limiting for auth endpoints
- Error handling middleware
- Request logging

## Frontend Development Tasks
### 1. Project Setup
- Initialize Vite React project with TypeScript
- Install dependencies: @reduxjs/toolkit, react-redux, axios, react-router-dom, @types/*
- Configure TailwindCSS with custom theme
- Set up ESLint and Prettier

### 2. Redux Store Setup
- Configure Redux store with RTK Query
- Create auth slice with:
  - User state management
  - Token storage/retrieval
  - Loading states
  - Error handling
- Set up API slice for backend communication

### 3. API Service Layer
- Create axios instance with interceptors
- Implement token refresh logic
- Error handling for API calls
- Type-safe API methods

### 4. Authentication Components
- LoginForm component with form validation
- LogoutButton component
- ProtectedRoute wrapper component
- Loading states and error handling

### 5. Layout Components
- Header with navigation and user menu
- Footer with federation information
- Layout wrapper component
- Responsive design with mobile support

### 6. Pages
- HomePage (public landing page)
- LoginPage (authentication form)
- DashboardPage (role-based dashboard placeholder)

### 7. Routing Setup
- Configure React Router with protected routes
- Role-based route protection
- Redirect logic for authenticated/unauthenticated users
- Error boundaries

## Type Definitions
### Backend Types
```typescript
// types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: UserProfile;
  token: string;
  refreshToken: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  profile: PlayerProfile | CoachProfile | ClubProfile | PartnerProfile | StateCommitteeProfile;
}

export type UserRole = 'player' | 'coach' | 'club' | 'partner' | 'state' | 'federation';
```

### Frontend Types
```typescript
// types/auth.ts
export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
```

## API Endpoints Specification
### Authentication Endpoints
```
POST /api/auth/login
Content-Type: application/json
Body: { email: string, password: string }
Response: { success: boolean, user: UserProfile, token: string, refreshToken: string }

POST /api/auth/logout
Authorization: Bearer <token>
Response: { success: boolean, message: string }

GET /api/auth/me
Authorization: Bearer <token>
Response: { success: boolean, user: UserProfile }

POST /api/auth/refresh
Body: { refreshToken: string }
Response: { success: boolean, token: string, refreshToken: string }

GET /api/auth/verify
Authorization: Bearer <token>
Response: { success: boolean, valid: boolean }
```

## Testing Requirements
### Backend Testing
- Test database connection and models
- Test authentication endpoints with Postman/Insomnia
- Verify JWT token generation and validation
- Test protected route middleware
- Verify CORS and security headers

### Frontend Testing
- Test login form functionality
- Verify Redux state management
- Test protected route navigation
- Verify token storage and retrieval
- Test responsive design on different screen sizes

### Integration Testing
- Test complete login flow (frontend to backend)
- Verify token refresh mechanism
- Test logout functionality
- Verify role-based route protection

## Environment Variables
### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=pickleball_federation
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Federación Mexicana de Pickleball
```

## Docker Configuration
### docker-compose.yml
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: pickleball_federation
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database_schema.sql:/docker-entrypoint-initdb.d/init.sql

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    environment:
      - NODE_ENV=development
      - DB_HOST=postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

## Success Criteria
✅ Docker containers start successfully
✅ Database schema is created and seeded
✅ Backend server starts and connects to database
✅ Frontend application loads in browser
✅ User can log in with valid credentials
✅ JWT tokens are properly generated and stored
✅ Protected routes require authentication
✅ User can log out successfully
✅ Redux store maintains authentication state
✅ API calls include proper authorization headers
✅ Role-based navigation works correctly
✅ Responsive design works on mobile and desktop

## Commands to Test
```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Run database migrations
docker-compose exec backend npm run migrate

# Test API endpoints
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Access frontend
open http://localhost:3000
```

## Next Steps
After completing this step, you should have:
- A fully dockerized development environment
- Working authentication system
- Protected routing
- Redux state management
- Ready foundation for the next development phase

The next step will focus on user registration and profile management for all user roles.