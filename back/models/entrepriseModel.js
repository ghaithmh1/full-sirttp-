const mongoose = require("mongoose");

const entrepriseSchema = new mongoose.Schema({
  identifiantFiscal: {
    type: String,
    required: true,
    unique: true,
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
    match: /^[259]\d{7}$/
  },
  email: {
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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
    type: Number
  },
  users: [ // Liste de références vers User
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model("Entreprise", entrepriseSchema);
