/**
 * LBS School ERP — Server Entry Point
 * 
 * Production-ready Express server with:
 *  - Environment variable management (dotenv)
 *  - CORS support
 *  - HTTP request logging (morgan)
 *  - JSON body parsing
 *  - Centralized error handling
 *  - MongoDB connection via Mongoose
 */

// ──────────────────────────────────────────────
// 1. Load environment variables (must be first)
// ──────────────────────────────────────────────
require('dotenv').config();

// ──────────────────────────────────────────────
// 2. Dependencies
// ──────────────────────────────────────────────
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Utilities
const connectDB = require('./utils/db');
const logger = require('./utils/logger');

// Middleware
const errorHandler = require('./middleware/errorHandler');

// Routes
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

// API Documentation
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// ──────────────────────────────────────────────
// 3. Initialize Express app
// ──────────────────────────────────────────────

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Security Middleware ---
// 1. Set security HTTP headers
app.use(helmet());

// 2. Limit requests (Rate limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests, please try again after 15 minutes',
});
app.use('/api', limiter);

// 3. Manual Data sanitization against NoSQL query injection
const sanitizeData = (obj) => {
  if (obj instanceof Object) {
    for (const key in obj) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else {
        sanitizeData(obj[key]);
      }
    }
  }
};

app.use((req, res, next) => {
  sanitizeData(req.body);
  sanitizeData(req.query);
  sanitizeData(req.params);
  next();
});







// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));



// ──────────────────────────────────────────────
// 4. Global Middleware
// ──────────────────────────────────────────────

// Enable CORS for all origins (tighten in production)
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (use 'combined' in production for full logs)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const adminRoutes = require('./routes/adminRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const feeRoutes = require('./routes/feeRoutes');
const academicRoutes = require('./routes/academicRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const adminTimetableRoutes = require('./routes/adminTimetableRoutes');

// ──────────────────────────────────────────────
// 5. API Routes
// ──────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/academic', academicRoutes); 
app.use('/api/admin/timetable', adminTimetableRoutes); // Mount admin timetable APIs
app.use('/api/timetable', timetableRoutes); // Mount class-wise timetable APIs
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);


// API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));






// ──────────────────────────────────────────────
// 5a. Example Protected Route (admin-only dashboard)
// ──────────────────────────────────────────────
const { protect, isAdmin } = require('./middleware/auth');
app.get('/api/admin/dashboard', protect, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the admin dashboard',
    data: {
      user: req.user.name,
      role: req.user.role,
      timestamp: new Date().toISOString(),
    },
  });
});

// ──────────────────────────────────────────────
// 5b. Example Teacher Protected Route
// ──────────────────────────────────────────────
const { isTeacher } = require('./middleware/auth');
app.get('/api/teacher/dashboard', protect, isTeacher, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the teacher dashboard',
    data: {
      user: req.user.name,
      role: req.user.role,
      department: 'General Academics', // Example static data
      timestamp: new Date().toISOString(),
    },
  });
});


// ──────────────────────────────────────────────
// 6. 404 Handler — catch unmatched routes
// ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ──────────────────────────────────────────────
// 7. Centralized Error Handler (must be last)
// ──────────────────────────────────────────────
app.use(errorHandler);

// ──────────────────────────────────────────────
// 8. Start Server
// ──────────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Then start listening
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
