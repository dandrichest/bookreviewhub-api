
// src/test/book.test.js
jest.setTimeout(30000);

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');

let mongoServer;
let app;
let connectDB;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = mongoServer.getUri();

  jest.resetModules();

  app = require('../../app'); // ✅ FIXED
  connectDB = require('../../src/config/db');

  await connectDB();

  // Register & login to get token
  await request(app).post('/api/users/register').send({
    username: 'BookTester',
    email: 'booktester@example.com',
    password: 'password123',
  });

  const login = await request(app).post('/api/users/login').send({
    email: 'booktester@example.com',
    password: 'password123',
  });

  token = login.body.token;
});

afterAll(async () => {
  try { await mongoose.connection.dropDatabase(); } catch (_) {}
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Book API', () => {
  it('should create a book when authenticated', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Book',
        author: 'Author Name',
        genre: 'Fiction',
        publishedYear: 2023,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Test Book');
    expect(typeof res.body._id).toBe('string');
  });
});
