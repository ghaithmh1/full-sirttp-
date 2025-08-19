const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect } = require('../middlewares/authMiddleware');

// Get articles for current entreprise
router.get('/', protect(), articleController.getArticlesForCurrentEntreprise);

// Get articles by entrepriseId
router.get('/entreprise/:entrepriseId', protect(), articleController.getArticlesByEntrepriseId);

// Get one article
router.get('/:id', protect(), articleController.getArticle);

// Create article
router.post('/', protect(['admin', 'superadmin']), articleController.createArticle);

// Update article
router.put('/:id', protect(['admin', 'superadmin']), articleController.updateArticle);

// Delete article
router.delete('/:id', protect(['admin', 'superadmin']), articleController.deleteArticle);

module.exports = router;