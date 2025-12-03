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

      await getReviewsByBook(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ rating: 5, bookId }),
          expect.objectContaining({ rating: 4, bookId }),
        ])
      );
    });

    it('should return 500 on DB error', async () => {
      mockingoose(Review).toReturn(new Error('DB error'), 'find');

      const req = mockRequest({ bookId: new mongoose.Types.ObjectId().toHexString() });
      const res = mockResponse();

      await getReviewsByBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
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

      await getReviewsByUser(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ rating: 3, userId }),
          expect.objectContaining({ rating: 4, userId }),
        ])
      );
    });

    it('should return 500 on DB error', async () => {
      mockingoose(Review).toReturn(new Error('DB error'), 'find');

      const req = mockRequest({ userId: new mongoose.Types.ObjectId().toHexString() });
      const res = mockResponse();

      await getReviewsByUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });
});