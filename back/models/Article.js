const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    entrepriseId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entreprise",
      required: true
    } 
  }
);

module.exports = mongoose.model('Article', articleSchema);