
const Comment = require('../models/Comment');

exports.createComment = async (req, res, next) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

exports.getCommentsByReview = async (req, res, next) => {
  try {
    const comments = await Comment.find({ reviewId: req.params.reviewId });
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};
