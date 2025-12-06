
const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./src/auth/passport');
const session = require('express-session');
const { swaggerUi, swaggerSpec } = require('./src/config/swagger');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'testsecret', // ✅ fallback
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
const userRoutes = require('./src/Routes/userRoutes');
const reviewRoutes = require('./src/Routes/reviewRoutes');
const commentRoutes = require('./src/Routes/commentRoutes');
const bookRoutes = require('./src/Routes/bookRoutes');

app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/books', bookRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/', (req, res) => res.send('BookReviewHub API is running'));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error handler caught:', err);
  res.status(500).json({ message: err.message });
});

module.exports = app; // ✅ Export for tests
