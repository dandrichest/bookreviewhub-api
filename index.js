
// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/Routes/userRoutes');
const bookRoutes = require('./src/Routes/bookRoutes');
const reviewRoutes = require('./src/Routes/reviewRoutes');
const commentRoutes = require('./src/Routes/commentRoutes');
const { swaggerUi, swaggerSpec } = require('./src/config/swagger');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => res.send('BookReviewHub API is running'));
app.use((err, req, res, next) => {
  console.error('Error handler caught:', err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

// ✅ Only connect & listen if not in test mode
if (process.env.NODE_ENV !== 'test') {
  connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
