require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const organRoutes = require('./routes/organs');
const predictionRoutes = require('./routes/predictions');
const patientRoutes = require('./routes/patients');
const hospitalRoutes = require('./routes/hospitals');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;
const frontendOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const allowedOrigins = [
  ...frontendOrigins,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
].filter(Boolean);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/organs', organRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AI Organ Availability Prediction API is running', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🏥 AI Organ Availability Prediction API running on port ${PORT}`);
});

module.exports = app;
