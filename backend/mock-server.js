const express = require('express');
const cors = require('cors');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './data/development.sqlite',
  logging: false
});

// Define simplified models
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: DataTypes.STRING,
  role: { type: DataTypes.ENUM('player', 'coach', 'club', 'partner', 'state_committee', 'federation'), allowNull: false },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'users' });

const Court = sequelize.define('Court', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  address: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  hourlyRate: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  peakHourRate: DataTypes.DECIMAL(10, 2),
  weekendRate: DataTypes.DECIMAL(10, 2),
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  ownerType: { type: DataTypes.ENUM('club', 'partner'), allowNull: false },
  surfaceType: { type: DataTypes.ENUM('outdoor_concrete', 'indoor_wood', 'outdoor_asphalt', 'synthetic', 'clay'), defaultValue: 'outdoor_concrete' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  images: { type: DataTypes.JSON, defaultValue: [] },
  amenities: { type: DataTypes.JSON, defaultValue: [] },
  averageRating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  totalReviews: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'courts' });

// Middleware
app.use(cors());
app.use(express.json());

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  // Mock authenticated user
  req.user = {
    userId: 1,
    email: 'club1@example.com',
    role: 'club'
  };
  next();
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock server running' });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Mock successful login (skip password validation for testing)
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Courts routes
app.get('/api/courts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    const { count, rows: courts } = await Court.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: {
        courts,
        pagination: {
          current: page,
          pages: Math.ceil(count / limit),
          total: count,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/courts/:id', async (req, res) => {
  try {
    const court = await Court.findByPk(req.params.id);
    if (!court) {
      return res.status(404).json({ success: false, error: 'Court not found' });
    }
    
    res.json({
      success: true,
      data: { court }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/api/courts', mockAuth, async (req, res) => {
  try {
    const courtData = {
      ...req.body,
      ownerId: req.user.userId,
      ownerType: req.user.role === 'club' ? 'club' : 'partner'
    };
    
    const court = await Court.create(courtData);
    
    res.status(201).json({
      success: true,
      data: { court },
      message: 'Court created successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/api/courts/:id', mockAuth, async (req, res) => {
  try {
    const court = await Court.findByPk(req.params.id);
    if (!court) {
      return res.status(404).json({ success: false, error: 'Court not found' });
    }
    
    await court.update(req.body);
    
    res.json({
      success: true,
      data: { court },
      message: 'Court updated successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// My courts route
app.get('/api/courts/my-courts', mockAuth, async (req, res) => {
  try {
    const courts = await Court.findAll({
      where: {
        ownerId: req.user.userId
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: { courts }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Analytics routes (mock data)
app.get('/api/analytics/courts/:courtId?', mockAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      overview: {
        totalRevenue: 25000,
        totalReservations: 150,
        averageRating: 4.7,
        occupancyRate: 0.75,
        topRevenueHours: [
          { hour: '18', revenue: 2500, reservations: 15 },
          { hour: '19', revenue: 2200, reservations: 12 },
          { hour: '20', revenue: 1800, reservations: 10 }
        ],
        revenueByDay: [
          { date: '2024-01-15', revenue: 1200, reservations: 8 },
          { date: '2024-01-16', revenue: 1500, reservations: 10 },
          { date: '2024-01-17', revenue: 1800, reservations: 12 }
        ]
      }
    }
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Mock server running on port ${PORT}`);
  
  try {
    await sequelize.authenticate();
    console.log('📊 Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});

module.exports = app;