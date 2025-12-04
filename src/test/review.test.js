
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

  app = require('../../index');
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

  // 2) Get the authenticated user's profile to obtain userId (required by your Review model)
  const profile = await request(app)
    .get('/api/users/profile')
    .set('Authorization', `Bearer ${token}`);
  userId = getId(profile.body);
  if (!userId) {
    throw new Error('Could not determine userId from /api/users/profile response');
  }

  // 3) Create a book to review
  const bookRes = await request(app)
    .post('/api/books')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Review Target',
      author: 'Author',
      genre: 'Non-fiction',
      publishedYear: 2021,
    });

  const bookDoc = bookRes.body; // raw doc
  bookId = getId(bookDoc);
  if (!bookId) {
    throw new Error('Could not determine bookId from /api/books create response');
  }
});

afterAll(async () => {
  try { await mongoose.connection.dropDatabase(); } catch (_) {}
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Review API', () => {
  it('creates a review (userId, bookId, rating, reviewText)', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId,                  // REQUIRED per your Review model
        bookId,                  // REQUIRED per your Review model
        rating: 4,               // min:1, max:5
        reviewText: 'Solid read!',
      });

    expect(res.statusCode).toBe(201);
    const review = res.body; // controller returns raw review doc
    reviewId = getId(review);
    expect(typeof reviewId).toBe('string');
    expect(review).toHaveProperty('bookId', bookId);
    expect(review).toHaveProperty('userId', userId);
    expect(review).toHaveProperty('reviewText', 'Solid read!');
  });

  it('gets reviews for a book', async () => {
    const res = await request(app).get(`/api/reviews/book/${bookId}`);
    expect(res.statusCode).toBe(200);
    const arr = res.body; // raw array of reviews
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.length).toBeGreaterThan(0);
    const found = arr.find(r => getId(r) === reviewId);
    expect(Boolean(found)).toBe(true);
  });

  it('updates a review (send ALL required fields to satisfy validateReview)', async () => {
    const res = await request(app)
      .put(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId,            // include to satisfy validateReview, if required
        bookId,            // include to satisfy validateReview, if required
        rating: 5,
        reviewText: 'Updated review text',
      });

    // If it still fails, log the response body to inspect validation error
    if (res.statusCode === 400) {
      // This helps us see what validateReview is complaining about
      // Remove after it passes
      console.log('Update review 400 response:', res.body);
    }

    expect(res.statusCode).toBe(200);
    const updated = res.body; // raw doc
    expect(updated).toHaveProperty('rating', 5);
    expect(updated).toHaveProperty('reviewText', 'Updated review text');
    expect(updated).toHaveProperty('userId', userId);
    expect(updated).toHaveProperty('bookId', bookId);
  });

  it('deletes a review', async () => {
    const res = await request(app)
      .delete(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Review deleted');
  });
});
