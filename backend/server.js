// **************************************************************************
// TASKFLOW CORE ENGINE
// Premium Backend for Project & Task Management
// **************************************************************************

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// --- DATABASE CONNECTIVITY ---
connectDB();

const app = express();

// --- MIDDLEWARE STACK ---
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- CORS CONFIGURATION ---
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.includes("vercel.app") ||
      origin.includes("localhost")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


// Handle preflight requests
app.options("*", cors());

// --- BODY PARSING ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API ROUTE MANAGEMENT ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// --- BASE & HEALTH ENDPOINT ---
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the TaskFlow Core API',
    status: 'Operational',
    version: '1.0.0'
  });
});

// --- 404 HANDLER ---
app.use((req, res, next) => {
  res.status(404).json({ message: 'The requested resource could not be found.' });
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 Service initialized in ${process.env.NODE_ENV} mode.
  🌍 Server running on port ${PORT}
  `);
});

// --- HANDLE UNHANDLED PROMISE REJECTIONS ---
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
