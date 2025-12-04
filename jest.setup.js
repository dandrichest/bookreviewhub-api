
jest.setTimeout(30000); // 30s for slower DB ops & hashing

// Set test env and default test DB once for all suites
process.env.NODE_ENV = 'test';
process.env.MONGO_URI_TEST = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/bookreviewhub_test';
