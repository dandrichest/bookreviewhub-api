function validateReview(req, res, next) {
  const { userId, bookId, rating, reviewText } = req.body;

  const errors = [];

  // userId
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    errors.push('userId is required and must be a non-empty string.');
  }

  // bookId
  if (!bookId || typeof bookId !== 'string' || bookId.trim().length === 0) {
    errors.push('bookId is required and must be a non-empty string.');
  }

  // rating (required, number 1–5)
  if (rating === undefined) {
    errors.push('rating is required.');
  } else if (typeof rating !== 'number') {
    errors.push('rating must be a number.');
  } else if (rating < 1 || rating > 5) {
    errors.push('rating must be between 1 and 5.');
  }

  // reviewText (required, at least 2 chars)
  if (!reviewText || typeof reviewText !== 'string' || reviewText.trim().length < 2) {
    errors.push('reviewText is required and must be at least 2 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = validateReview;