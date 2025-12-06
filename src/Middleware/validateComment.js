
function validateComment(req, res, next) {
  const { reviewId, userId, commentText } = req.body;
  const errors = [];

  if (req.method === 'POST') {
    // For creating a comment, all fields are required
    if (!reviewId || typeof reviewId !== 'string' || reviewId.trim().length === 0) {
      errors.push('reviewId is required and must be a non-empty string.');
    }

    if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
      errors.push('userId is required and must be a non-empty string.');
    }

    if (!commentText || typeof commentText !== 'string' || commentText.trim().length < 2) {
      errors.push('commentText is required and must be at least 2 characters long.');
    }
  }

  if (req.method === 'PUT') {
    // For updating a comment, only commentText is required
    if (!commentText || typeof commentText !== 'string' || commentText.trim().length < 2) {
      errors.push('commentText is required and must be at least 2 characters long.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = validateComment;
