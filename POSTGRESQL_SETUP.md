# PostgreSQL Setup for Pickleball Federation

This project has been **fully migrated to PostgreSQL** and no longer uses SQLite. Follow this guide to set up PostgreSQL for development.

## 🚀 Quick Start with Docker (Recommended)

### 1. Start PostgreSQL Container
```bash
# Start only PostgreSQL
docker compose up -d postgres

# Or start all services
docker compose up -d
```

### 2. Verify Database Connection
```bash
# From the backend directory
cd backend
npm run test:db
```

### 3. Run Database Migrations
```bash
cd backend
npm run migrate
```

### 4. Seed Database (Optional)
```bash
cd backend
npm run seed:microsites
```

### 5. Start Backend Server
```bash
cd backend
npm run dev
```

## 📋 Manual PostgreSQL Installation

If you prefer to install PostgreSQL locally instead of using Docker:

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Windows
Download and install from: https://www.postgresql.org/download/windows/

## 🔧 Database Configuration

### Environment Variables
The following environment variables are configured in `backend/.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pickleball_federation
DB_USER=postgres
DB_PASSWORD=password
```

### Docker Compose Configuration
PostgreSQL is configured in `docker-compose.yml` with:
- **Database**: `pickleball_federation`
- **User**: `postgres`
- **Password**: `password`
- **Port**: `5432`

## 🗄️ Database Schema

The complete PostgreSQL schema is located in `database_schema.sql` and includes:

### Core Tables
- ✅ **Users & Authentication** - Base user system with roles
- ✅ **User Profiles** - Players, Coaches, Clubs, Partners, State Committees
- ✅ **Courts & Facilities** - Court management and reservations
- ✅ **Tournaments & Events** - Tournament system with categories
- ✅ **Ranking System** - Player rankings and history
- ✅ **Player Finder** - Location-based player matching
- ✅ **Messaging & Notifications** - Internal communication
- ✅ **Payments & Billing** - Stripe integration ready
- ✅ **Microsites** - Custom microsites for organizations
- ✅ **Certifications & Training** - Coach certification system

### Key Features
- **JSONB columns** for flexible data storage
- **Comprehensive indexes** for performance
- **Triggers** for automatic timestamp updates
- **Functions** for federation ID generation
- **Mexican states** pre-populated
- **Membership plans** configured

## 🧪 Testing Database Connection

Use the connection test script to verify your setup:

```bash
cd backend
npm run test:db
```

**Expected Output:**
```
✅ PostgreSQL connection successful!
📊 PostgreSQL version: PostgreSQL 15.x...
🗄️ Current database: pickleball_federation
```

## 🔄 Migration from SQLite

The system has been completely migrated:

### ✅ Completed Changes
- ✅ Database configuration updated to use PostgreSQL only
- ✅ SQLite dependencies removed from `package.json`
- ✅ Environment variables configured for PostgreSQL
- ✅ Sequelize CLI configuration updated
- ✅ Docker Compose configured with PostgreSQL
- ✅ Comprehensive PostgreSQL schema created

### 🗂️ Files Updated
- `backend/src/config/database.ts` - Always uses PostgreSQL
- `backend/.env` - PostgreSQL environment variables uncommented
- `backend/config/config.json` - All environments use PostgreSQL
- `backend/package.json` - SQLite dependency removed
- `docker-compose.yml` - PostgreSQL container configured

## 📊 Database Management

### Common Commands
```bash
# Test connection
npm run test:db

# Run migrations
npm run migrate

# Seed database with sample data
npm run seed:microsites

# Access PostgreSQL CLI (with Docker)
docker compose exec postgres psql -U postgres -d pickleball_federation

# Access PostgreSQL CLI (local installation)
psql -h localhost -U postgres -d pickleball_federation
```

### Useful SQL Queries
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('pickleball_federation'));

-- List all tables
\dt

-- Check table schema
\d users

-- Count records in key tables
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'microsites', COUNT(*) FROM microsites
UNION ALL
SELECT 'tournaments', COUNT(*) FROM tournaments;
```

## 🔧 Troubleshooting

### Connection Issues
1. **Docker not running**: Start Docker service
2. **Permission denied**: Add user to docker group or use sudo
3. **Port already in use**: Stop existing PostgreSQL service
4. **Connection refused**: Check if PostgreSQL is running

### Common Solutions
```bash
# Check if PostgreSQL is running
docker compose ps

# View PostgreSQL logs
docker compose logs postgres

# Restart PostgreSQL container
docker compose restart postgres

# Reset database (WARNING: Deletes all data)
docker compose down -v
docker compose up -d postgres
```

## 🎯 Next Steps

1. **Start PostgreSQL**: `docker compose up -d postgres`
2. **Test Connection**: `npm run test:db`
3. **Run Migrations**: `npm run migrate`
4. **Seed Data**: `npm run seed:microsites`
5. **Start Development**: `npm run dev`

## 📝 Notes

- **No SQLite**: The system no longer supports SQLite
- **Production Ready**: PostgreSQL configuration works for production
- **SSL Support**: Production config includes SSL support
- **Performance**: Includes indexes and optimizations
- **Scalable**: Supports horizontal scaling

The microsite management system is fully compatible with PostgreSQL and includes all necessary database structures for the complete application.