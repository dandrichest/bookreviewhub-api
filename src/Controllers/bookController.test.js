const mockingoose = require('mockingoose');
const Book = require('../models/Book');
const { getBooks, getBookById } = require('./bookController');

const mockRequest = (params = {}) => ({ params });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Book Controller using mockingoose', () => {

  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('getBooks', () => {

    it('should return all books', async () => {
      const mockBooks = [
        { _id: '1', title: 'Book One', author: 'Author A', genre: 'Fiction', publishedYear: 2020 },
        { _id: '2', title: 'Book Two', author: 'Author B', genre: 'Non-Fiction', publishedYear: 2021 }
      ];

      mockingoose(Book).toReturn(mockBooks, 'find');

      const req = mockRequest();
      const res = mockResponse();

      await getBooks(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ title: 'Book One', author: 'Author A' }),
          expect.objectContaining({ title: 'Book Two', author: 'Author B' })
        ])
      );
    });

    it('should return 500 on database error', async () => {
      mockingoose(Book).toReturn(new Error('DB error'), 'find');

      const req = mockRequest();
      const res = mockResponse();

      await getBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });

  });

  describe('getBookById', () => {

    it('should return a book by ID', async () => {
      const bookId = '1';
      const mockBook = { _id: bookId, title: 'Book One', author: 'Author A', genre: 'Fiction', publishedYear: 2020 };

      mockingoose(Book).toReturn(mockBook, 'findOne');

      const req = mockRequest({ id: bookId });
      const res = mockResponse();

      await getBookById(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Book One', author: 'Author A' })
      );
    });

    it('should return 404 if book not found', async () => {
      mockingoose(Book).toReturn(null, 'findOne');

      const req = mockRequest({ id: 'nonexistentId' });
      const res = mockResponse();

      await getBookById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
    });

    it('should return 500 on database error', async () => {
      mockingoose(Book).toReturn(new Error('DB error'), 'findOne');

      const req = mockRequest({ id: '1' });
      const res = mockResponse();

      await getBookById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });

  });

});