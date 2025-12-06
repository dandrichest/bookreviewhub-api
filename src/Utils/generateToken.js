
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'testsecret'; // ✅ fallback for tests
  return jwt.sign({ id }, secret, { expiresIn: '1h' });
};

module.exports = generateToken;
