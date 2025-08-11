const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    serie: { type: String, required: true },
    registrationCard: { type: String, required: true }, // carte grise
    insurance: { type: String, required: true },
    mileage: { type: Number, required: true },
    lastServiceDate: { type: Date },
    nextServiceDue: { type: Date }
  },
  {
    timestamps: true // This will automatically manage createdAt and updatedAt
  }
);

module.exports = mongoose.model('Car', carSchema);
   