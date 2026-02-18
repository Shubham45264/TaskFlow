// TASKFLOW CORE ENGINE
// Premium Backend for Project & Task Management

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// --- DATABASE CONNECTIVITY ---
// Establishing connection to MongoDB Pulse
connectDB();

const app = express();

// --- MIDDLEWARE STACK ---
// Logging requests for development clarity
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security & Data Parsing
app.use(cors({
  origin: [
    "https://task-flow-iota-seven.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API ROUTE MANAGEMENT ---
// Mounting individual modules for Users, Projects, and Tasks
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// --- BASE & HEALTH ENDPOINTS ---
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the TaskFlow Core API',
    status: 'Operational',
    version: '1.0.0'
  });
});

// --- ERROR ORCHESTRATION ---
// Handle 404 - Resource Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: 'The requested resource could not be found.' });
});

// Global Exception Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// --- SERVER LIFECYCLE ---
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 Service initialized in ${process.env.NODE_ENV} mode.
  📡 Pulse detected at http://localhost:${PORT}
  `);
});

// Handle unhandled promise rejections for system stability
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Forceful but graceful shutdown on critical failures
  server.close(() => process.exit(1));
});
