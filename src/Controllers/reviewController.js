
const Review = require('../models/Review');

exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

exports.getReviewsByBook = async (req, res, next) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.getReviewsByUser = async (req, res, next) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(review);
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};
