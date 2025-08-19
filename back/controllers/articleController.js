const Article = require('../models/Article');
const mongoose=require("mongoose")



async function getArticles(req, res) {
  try {
      const Articles = await Article.find();
      res.json(Articles);
    } catch (err) {
      res.status(500).json({ message: err.message });
}}
async function getArticlesByEntrepriseId(req, res) {
  try {
    const { entrepriseId } = req.params;
    const entrepriseObjectId = new mongoose.Types.ObjectId(entrepriseId);
    const articles = await Article.find({ entrepriseId: entrepriseObjectId });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getArticle(req, res, next) {
  let article; // Lowercase variable
  try {
    article = await Article.findById(req.params.id);
    if (article == null) {
      return res.status(404).json({ message: 'Cannot find article' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.article = article; // Lowercase property
  next();
}

async function createArticle(req, res) {
  const article = new Article({
    name: req.body.name,
    model: req.body.model,
    entrepriseId:req.body.entrepriseId,
  });
  try {
    const newArticle = await article.save(); 
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function updateArticle(req, res) {
  if (req.body.name != null) res.article.name = req.body.name;
  if (req.body.model != null) res.article.model = req.body.model;
  try {
    const updatedArticle = await res.article.save();
    res.json(updatedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deleteArticle(req, res) {
  try {
    await res.article.deleteOne();
    res.json({ message: 'Deleted article' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
module.exports = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,getArticlesByEntrepriseId
};
