const Article = require('../models/Article');

// Get articles for current entreprise
async function getArticlesForCurrentEntreprise(req, res) {
  try {
    const articles = await Article.find({ entrepriseId: req.user.entrepriseId });
    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    });
  }
}

// Get articles by entrepriseId
async function getArticlesByEntrepriseId(req, res) {
  try {
    const articles = await Article.find({ entrepriseId: req.params.entrepriseId });
    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    });
  }
}

// Get single article
async function getArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    if (article.entrepriseId.toString() !== req.user.entrepriseId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this article'
      });
    }
    
    res.json({
      success: true,
      data: article
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error: ' + err.message
    });
  }
}

// Create article
async function createArticle(req, res) {
  try {
    const article = new Article({
      name: req.body.name,
      model: req.body.model,
      entrepriseId: req.user.entrepriseId
    });

    const newArticle = await article.save();
    
    res.status(201).json({
      success: true,
      data: newArticle
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Validation error: ' + err.message
    });
  }
}

// Update article
async function updateArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    if (article.entrepriseId.toString() !== req.user.entrepriseId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this article'
      });
    }

    // Update fields
    article.name = req.body.name || article.name;
    article.model = req.body.model || article.model;
    
    const updatedArticle = await article.save();
    
    res.json({
      success: true,
      data: updatedArticle
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Update failed: ' + err.message
    });
  }
}

// Delete article
async function deleteArticle(req, res) {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }
    
    if (article.entrepriseId.toString() !== req.user.entrepriseId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article'
      });
    }

    await article.deleteOne();
    
    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Delete failed: ' + err.message
    });
  }
}

module.exports = {
  getArticlesForCurrentEntreprise,
  getArticlesByEntrepriseId,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle
};