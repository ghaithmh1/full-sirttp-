const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  quantite: {
    type: Number,
    required: true,
    min: 0
  },
  unite: {
    type: String,
    required: true,
    trim: true
  },
  prixUnitaire: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

module.exports = mongoose.model('Produit', produitSchema);
