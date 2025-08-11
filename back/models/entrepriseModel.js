const mongoose = require("mongoose");

const entrepriseSchema = new mongoose.Schema({
  identifiantFiscal: {
    type: String,
    required: true,
    unique: true, // Clé primaire
    trim: true
  },
  nom: {
    type: String,
    required: true,
    trim: true
  },
  adresse: {
    type: String,
    required: true
  },
  ville: {
    type: String,
    required: true
  },
  codePostal: {
    type: String
  },
  telephone: {
    type: String,
    required: true,
    match: /^[259]\d{7}$/ // commence par 2, 5 ou 9 + 8 chiffres
  },
  email: {
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // email valide
  },
  secteurActivite: {
    type: String
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  },
  taille: {
    type: Number // nombre d'employés
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Entreprise", entrepriseSchema);
