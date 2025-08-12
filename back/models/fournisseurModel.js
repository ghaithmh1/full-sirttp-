const mongoose = require("mongoose");

const fournisseurSchema = new mongoose.Schema({
  name: { type: String, 
    required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
    entrepriseId:{ 
          type: mongoose.Schema.Types.ObjectId,
          ref: "Entreprise",
          required: true
        } ,
}, { timestamps: true });

module.exports = mongoose.model("Fournisseur", fournisseurSchema);     