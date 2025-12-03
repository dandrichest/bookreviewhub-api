const mongoose = require('mongoose');
const mockingoose = require('mockingoose');
const Review = require('../models/Review');

const {
  getReviewsByBook,
  getReviewsByUser,
} = require('./reviewController');

const mockRequest = (params = {}) => ({ params });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Review Controller using mockingoose', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('getReviewsByBook', () => {
    it('should return reviews for a specific book', async () => {
      const bookId = new mongoose.Types.ObjectId();
      const mockReviews = [
        { _id: new mongoose.Types.ObjectId(), rating: 5, bookId, userId: new mongoose.Types.ObjectId(), reviewText: 'Great book!' },
        { _id: new mongoose.Types.ObjectId(), rating: 4, bookId, userId: new mongoose.Types.ObjectId(), reviewText: 'Good read' }
      ];

      mockingoose(Review).toReturn(mockReviews, 'find');

      const req = mockRequest({ bookId: bookId.toHexString() });
      const res = mockResponse();
      const next = jest.fn();

      await getReviewsByBook(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ rating: 5, bookId }),
          expect.objectContaining({ rating: 4, bookId }),
        ])
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on DB error', async () => {
      mockingoose(Review).toReturn(new Error('DB error'), 'find');

      const req = mockRequest({ bookId: new mongoose.Types.ObjectId().toHexString() });
      const res = mockResponse();
      const next = jest.fn();

      await getReviewsByBook(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('DB error');
    });
  });

  describe('getReviewsByUser', () => {
    it('should return reviews for a specific user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const mockReviews = [
        { _id: new mongoose.Types.ObjectId(), rating: 3, userId, bookId: new mongoose.Types.ObjectId(), reviewText: 'Okay book' },
        { _id: new mongoose.Types.ObjectId(), rating: 4, userId, bookId: new mongoose.Types.ObjectId(), reviewText: 'Nice read' }
      ];

      mockingoose(Review).toReturn(mockReviews, 'find');

      const req = mockRequest({ userId: userId.toHexString() });
      const res = mockResponse();
      const next = jest.fn();

      await getReviewsByUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ rating: 3, userId }),
          expect.objectContaining({ rating: 4, userId }),
        ])
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on DB error', async () => {
      mockingoose(Review).toReturn(new Error('DB error'), 'find');

      const req = mockRequest({ userId: new mongoose.Types.ObjectId().toHexString() });
      const res = mockResponse();
      const next = jest.fn();

      await getReviewsByUser(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('DB error');
    });
  });
});