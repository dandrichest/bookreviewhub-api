const express = require('express');
const {
  createComment,
  getCommentsByReview,
  deleteComment
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

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
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
router.post('/', validateComment, protect, createComment);          // Protected

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
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
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
router.delete('/:id', protect, deleteComment);     // Protected

module.exports = router;
