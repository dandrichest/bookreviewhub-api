
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/Routes/userRoutes');
const bookRoutes = require('./src/Routes/bookRoutes');
const reviewRoutes = require('./src/Routes/reviewRoutes');
const commentRoutes = require('./src/Routes/commentRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => res.send('BookReviewHub API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const { swaggerUi, swaggerSpec } = require('./src/config/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
