
const Comment = require('../models/Comment');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { reviewId, userId, commentText } = req.body;

    const comment = await Comment.create({
      reviewId,
      userId,
      commentText
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a specific review
exports.getCommentsByReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const comments = await Comment.find({ reviewId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a comment by ID
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentText } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { commentText },
      { new: true } // return updated document
    );

    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
