
// src/test/comment.test.js
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
let commentId;

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
    username: 'Commenter',
    email: 'comment@example.com',
    password: 'password123',
  });
  const login = await request(app).post('/api/users/login').send({
    email: 'comment@example.com',
    password: 'password123',
  });
  token = login.body.token;

  // 2) Get the authenticated user's profile to obtain userId (required by the Comment model)
  const profile = await request(app)
    .get('/api/users/profile')
    .set('Authorization', `Bearer ${token}`);
  userId = getId(profile.body);
  if (!userId) {
    throw new Error('Could not determine userId from /api/users/profile response');
  }

  // 3) Create a book
  const bookRes = await request(app)
    .post('/api/books')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Comment Target',
      author: 'Author',
      genre: 'Drama',
      publishedYear: 2020,
    });
  const bookDoc = bookRes.body; // raw doc
  bookId = getId(bookDoc);

  // 4) Create a review (so we can comment on it)
  const reviewRes = await request(app)
    .post('/api/reviews')
    .set('Authorization', `Bearer ${token}`)
    .send({
      userId,
      bookId,
      rating: 3,
      reviewText: 'Decent.',
    });
  const reviewDoc = reviewRes.body;
  reviewId = getId(reviewDoc);
});

afterAll(async () => {
  try { await mongoose.connection.dropDatabase(); } catch (_) {}
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Comment API', () => {
  it('creates a comment (reviewId, userId, commentText)', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reviewId,                   // REQUIRED per your Comment model
        userId,                     // REQUIRED per your Comment model
        commentText: 'I agree with this!',
      });

    expect(res.statusCode).toBe(201);
    const comment = res.body; // raw comment doc
    commentId = getId(comment);
    expect(typeof commentId).toBe('string');
    expect(comment).toHaveProperty('reviewId', reviewId);
    expect(comment).toHaveProperty('userId', userId);
    expect(comment).toHaveProperty('commentText', 'I agree with this!');
  });

  it('gets comments for a review', async () => {
    const res = await request(app).get(`/api/comments/review/${reviewId}`);
    expect(res.statusCode).toBe(200);
    const arr = res.body; // raw array of comments
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.length).toBeGreaterThan(0);
    const found = arr.find(c => getId(c) === commentId);
    expect(Boolean(found)).toBe(true);
  });

  it('deletes a comment', async () => {
    const res = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Comment deleted');
  });
});
