
// src/test/review.test.js
jest.setTimeout(30000);

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');

let mongoServer;
let app;
let connectDB;

let token;
let userId;
let bookId;
let reviewId;

const getId = (obj) => obj?._id || obj?.id;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = mongoServer.getUri();

  jest.resetModules();

  app = require('../../app'); // ✅ FIXED
  connectDB = require('../../src/config/db');

  await connectDB();

  // 1) Register & login
  await request(app).post('/api/users/register').send({
    username: 'Reviewer',
    email: 'rev@example.com',
    password: 'password123',
  });
  const login = await request(app).post('/api/users/login').send({
    email: 'rev@example.com',
    password: 'password123',
  });
  token = login.body.token;

  // 2) Get user profile
  const profile = await request(app)
    .get('/api/users/profile')
    .set('Authorization', `Bearer ${token}`);
  userId = getId(profile.body);
  if (!userId) throw new Error('Could not determine userId');

  // 3) Create a book
  const bookRes = await request(app)
    .post('/api/books')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Review Target',
      author: 'Author',
      genre: 'Non-fiction',
      publishedYear: 2021,
    });
  bookId = getId(bookRes.body);
  if (!bookId) throw new Error('Could not determine bookId');
});

afterAll(async () => {
  try { await mongoose.connection.dropDatabase(); } catch (_) {}
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Review API', () => {
  it('creates a review', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId, bookId, rating: 4, reviewText: 'Solid read!' });

    expect(res.statusCode).toBe(201);
    reviewId = getId(res.body);
    expect(typeof reviewId).toBe('string');
    expect(res.body).toHaveProperty('bookId', bookId);
    expect(res.body).toHaveProperty('userId', userId);
  });

  it('gets reviews for a book', async () => {
    const res = await request(app).get(`/api/reviews/book/${bookId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('updates a review', async () => {
    const res = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId, bookId, rating: 5, reviewText: 'Updated review text' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('rating', 5);
  });

  it('deletes a review', async () => {
    const res = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Review deleted');
  });
});
