const mongoose = require("mongoose");

const bonCommandeSchema = new mongoose.Schema({
  numeroCommande: { type: String, required: true, unique: true },
  dateCommande: { type: Date, required: true },
  typeBonCommande: { 
    type: String, 
    enum: ["achat", "vente"], // achat = envoyé au fournisseur, vente = reçu du client
    required: true
  },
  fournisseur: { type: mongoose.Schema.Types.ObjectId, ref: "Fournisseur" }, // requis si type=achat
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" }, // requis si type=vente
  listeProduits: [{
    idProduit: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
    quantite: { type: Number, required: true },
    nomProduit: {type: String, required: true}
  }],
  statut: { 
    type: String, 
    enum: ['En attente', 'En cours', 'Répondu', 'Annulé'],
    default: 'En attente'
  },
  entrepriseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entreprise",
    required: true
  },
  description: String
}, { timestamps: true });

// Validation conditionnelle
bonCommandeSchema.pre("validate", function(next) {
  if (this.typeBonCommande === "achat" && !this.fournisseur) {
    return next(new Error("Un bon de commande d'achat doit avoir un fournisseur."));
  }
  if (this.typeBonCommande === "vente" && !this.client) {
    return next(new Error("Un bon de commande de vente doit avoir un client."));
  }
  next();
});

module.exports = mongoose.model("BonCommande", bonCommandeSchema);
