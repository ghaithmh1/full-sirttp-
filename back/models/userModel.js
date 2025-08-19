const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true
  },
  num: { 
    type: String, 
    required: true,
    match: /^[259]\d{7}$/ 
  },
  pwd: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'superadmin'], 
    default: 'superadmin' 
  },
  entrepriseId: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'Entreprise',
  index: true
},
  lastLogin: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('pwd')) return next();
  this.pwd = await bcrypt.hash(this.pwd, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.pwd);
};

userSchema.methods.generateAuthToken = function() {
  return require('jsonwebtoken').sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      entrepriseId: this.entrepriseId
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

module.exports = mongoose.model('User', userSchema);