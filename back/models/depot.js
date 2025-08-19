const mongoose = require('mongoose');

const depotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location : { type: String, required: true },
    num: { type: String },
    entrepriseId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entreprise",
      required: true
    } 
  }
);

module.exports = mongoose.model('Depot', depotSchema);