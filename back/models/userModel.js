const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: false,
  },
  prenom: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pwd: {
    type: String,
    required: true,
  },
  num: {
    type: Number,
    unique: true,
    sparse: true,
  },
  role:{
    type:String,
    default:"",
  }
});
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role:this.role,
    },
    process.env.JWT_SECRET,
    
  );
};
module.exports = mongoose.model("User", userSchema);
