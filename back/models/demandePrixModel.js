const mongoose = require('mongoose');

// Schéma pour les produits dans la demande de prix
const ListeProduitSchema = new mongoose.Schema({
  idProduit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit', // référence au modèle Produit existant
    required: true
  },
  nomProduit: {
    type: String,
    required: true
  },
  quantiteDemandee: {
    type: Number,
    required: true,
    min: 1
  }
});

// Schéma principal de la demande de prix
const DemandePrixSchema = new mongoose.Schema({
  numeroDemande: {
    type: String,
    required: true,
    unique: true
  },
  dateDemande: {
    type: Date,
    default: Date.now
  },
  listeProduits: {
    type: [ListeProduitSchema],
    required: true
  },
  statut: {
    type: String,
    enum: ['En attente', 'En cours', 'Répondu', 'Annulé'],
    default: 'En attente'
  },
  fournisseur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fournisseur', 
    required: true
  },
  description: {
    type: String
  },
  entrepriseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entreprise",
      required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('DemandePrix', DemandePrixSchema);
