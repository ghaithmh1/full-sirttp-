const mongoose = require('mongoose');

const sousTraitantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email est obligatoire'],
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide']
  },
  phone: {
    type: String,
    required: [true, 'Téléphone est obligatoire'],
    match: [/^[259]\d{7}$/, 'Numéro de téléphone invalide']
  },
  address: {
    type: String,
    required: [true, 'Adresse est obligatoire']
  },
  specialite: {
    type: String
  },
  depot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Depot',
    required: [true, 'Dépôt associé est obligatoire']
  },
  entrepriseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entreprise',
    required: [true, 'Entreprise est obligatoire']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Indexes
sousTraitantSchema.index({ entrepriseId: 1 });
sousTraitantSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('SousTraitant', sousTraitantSchema);