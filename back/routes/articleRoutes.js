const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Get all Articles
router.get('/', articleController.getArticles);

// Get one Article
router.get('/:id', articleController.getArticle, (req, res) => {
  res.json(res.article);
});

// Create Article
router.post('/', articleController.createArticle);

// Update Article
router.patch('/:id', articleController.getArticle, articleController.updateArticle);

// Delete Article
router.delete('/:id', articleController.getArticle, articleController.deleteArticle);

module.exports = router;
