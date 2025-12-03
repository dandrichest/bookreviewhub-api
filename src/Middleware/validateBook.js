function validateBook(req, res, next) {
  const { title, author, genre, publishedYear } = req.body;

  const errors = [];

  // title
  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    errors.push('Title is required and must be a string with at least 2 characters.');
  }

  // author
  if (!author || typeof author !== 'string' || author.trim().length < 2) {
    errors.push('Author is required and must be a string with at least 2 characters.');
  }

  // genre
  if (genre && typeof genre !== 'string') {
    errors.push('Genre must be a string.');
  }

  // publishedYear
  const currentYear = new Date().getFullYear();
  if (publishedYear === undefined) {
    errors.push('publishedYear is required.');
  } else if (typeof publishedYear !== 'number') {
    errors.push('publishedYear must be a number.');
  } else if (publishedYear < 0 || publishedYear > currentYear) {
    errors.push(`publishedYear must be between 0 and ${currentYear}.`);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = validateBook;
