function validateUser(req, res, next) {
  const { username, email, password } = req.body;
  const errors = [];

  // username (required, string, min 2 chars)
  if (!username || typeof username !== 'string' || username.trim().length < 2) {
    errors.push('username is required and must be at least 2 characters long.');
  }

  // email (required, must look like an email)
  if (!email || typeof email !== 'string') {
    errors.push('email is required and must be a string.');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('email must be a valid email address.');
    }
  }

  // password (required, min 6 chars)
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('password is required and must be at least 6 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = validateUser;
