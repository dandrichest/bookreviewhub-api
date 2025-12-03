const mongoose = require('mongoose');
const mockingoose = require('mockingoose');
const Comment = require('../models/Comment');
const { getCommentsByReview } = require('./commentController');

const mockRequest = (params = {}) => ({ params });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Comment Controller using mockingoose', () => {

  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('getCommentsByReview', () => {

    it('should return comments for a specific review', async () => {
      const reviewId = new mongoose.Types.ObjectId();
      const mockComments = [
        { _id: new mongoose.Types.ObjectId(), reviewId, userId: new mongoose.Types.ObjectId(), commentText: 'Great review!' },
        { _id: new mongoose.Types.ObjectId(), reviewId, userId: new mongoose.Types.ObjectId(), commentText: 'I totally agree' }
      ];

      mockingoose(Comment).toReturn(mockComments, 'find');

      const req = mockRequest({ reviewId: reviewId.toHexString() });
      const res = mockResponse();
      const next = jest.fn();

      await getCommentsByReview(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ reviewId }),
          expect.objectContaining({ reviewId }),
        ])
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on database error', async () => {
      mockingoose(Comment).toReturn(new Error('DB error'), 'find');

      const req = mockRequest({ reviewId: new mongoose.Types.ObjectId().toHexString() });
      const res = mockResponse();
      const next = jest.fn();

      await getCommentsByReview(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('DB error');
    });

  });

});