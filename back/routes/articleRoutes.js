const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// Get all Articles
router.get('/', articleController.getArticles); // ici renvoie tous les articles sans filtre

// Get Articles by entrepriseId
router.get('/entreprise/:entrepriseId', articleController.getArticlesByEntrepriseId);

// Get one Article by article id
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
