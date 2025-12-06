
const express = require('express');
const { protect } = require('../Middleware/authMiddleware'); 
const validateComment = require('../Middleware/validateComment');
const {
  createComment,
  getCommentsByReview,
  deleteComment,
  updateComment // ✅ Add this in your controller
} = require('../Controllers/commentController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewId:
 *                 type: string
 *               userId:
 *                 type: string
 *               commentText:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
router.post('/', validateComment, protect, createComment);

/**
 * @swagger
 * /api/comments/review/{reviewId}:
 *   get:
 *     summary: Get comments for a review
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments for the review
 */
router.get('/review/:reviewId', getCommentsByReview);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentText:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
router.put('/:id', validateComment, protect, updateComment); // ✅ New PUT route

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete('/:id', protect, deleteComment);

module.exports = router;
