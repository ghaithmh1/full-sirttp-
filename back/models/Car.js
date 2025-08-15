const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    serie: { type: String, required: true },
    registrationCard: { type: String, required: true },
    insurance: { type: String, required: true },
    mileage: { type: Number, required: true },
    lastServiceDate: { type: Date },
    nextServiceDue: { type: Date },
    entrepriseId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entreprise",
      required: true
    } 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);