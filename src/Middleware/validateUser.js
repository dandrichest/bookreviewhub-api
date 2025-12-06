
function validateUser(req, res, next) {
  const { username, email, password } = req.body;
  const errors = [];

  if (req.method === 'POST') {
    // For registration, all fields are required
    if (!username || typeof username !== 'string' || username.trim().length < 2) {
      errors.push('username is required and must be at least 2 characters long.');
    }

    if (!email || typeof email !== 'string') {
      errors.push('email is required and must be a string.');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push('email must be a valid email address.');
      }
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      errors.push('password is required and must be at least 6 characters long.');
    }
  }

  if (req.method === 'PUT') {
    // For updating user, username or email can be updated (password optional)
    if (username && (typeof username !== 'string' || username.trim().length < 2)) {
      errors.push('username must be at least 2 characters long if provided.');
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push('email must be a valid email address if provided.');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = validateUser;
