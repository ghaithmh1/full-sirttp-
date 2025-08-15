const mongoose = require("mongoose");

const entrepriseSchema = new mongoose.Schema({
  identifiantFiscal: {
    type: String,
    required: true,
    unique: true
  },
  nom: {
    type: String,
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  ville: {
    type: String,
    required: true
  },
  codePostal: String,
  telephone: {
    type: String,
    required: true,
    match: /^[259]\d{7}$/
  },
  email: {
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  secteurActivite: String,
  dateCreation: {
    type: Date,
    default: Date.now
  },
  description: String,
  taille: String,
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
entrepriseSchema.index({ identifiantFiscal: 1 }, { unique: true });
entrepriseSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Entreprise", entrepriseSchema);