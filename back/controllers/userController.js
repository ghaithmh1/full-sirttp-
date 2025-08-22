const User = require('../models/userModel');
const Activity = require('../models/Activity');
const { logActivity } = require('../services/activityService');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

// Register user
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, pwd, num } = req.body;

    // Validation basique
    if (!nom || !prenom || !email || !pwd || !num) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Format d’email invalide' });
    }

    if (!/^[259]\d{7}$/.test(num)) {
      return res.status(400).json({ success: false, message: 'Numéro de téléphone invalide' });
    }

    // Vérification email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }

    // Vérification numéro
    const existingNum = await User.findOne({ num });
    if (existingNum) {
      return res.status(400).json({ success: false, message: 'Numéro de téléphone déjà utilisé' });
    }

    // Création utilisateur
    const user = new User({ nom, prenom, email, pwd, num });
    const newUser = await user.save();

    // Génération token
    const token = newUser.generateAuthToken();

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        email: newUser.email,
        token
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, pwd } = req.body;

    // Vérification des champs
    if (!email || !pwd) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email et mot de passe sont requis' 
      });
    }

    // Recherche utilisateur par email
    const user = await User.findOne({ email }).select("+pwd +role");
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email non trouvé' 
      });
    }

    // Vérification du mot de passe
    const isMatch = await user.comparePassword(pwd);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Mot de passe incorrect' 
      });
    }

    // Mise à jour du dernier login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Génération du token JWT
    const token = user.generateAuthToken();

    // Réponse
    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,         // 🔹 important pour le frontend
        entrepriseId: user.entrepriseId || null,
        token
      }
    });

  } catch (error) {
    console.error("Erreur lors du login :", error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur, veuillez réessayer plus tard' 
    });
  }
};



// Get all users for current enterprise
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ entrepriseId: req.user.entrepriseId });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, entrepriseId: req.user.entrepriseId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Log activity
    await logActivity(
      'update',
      'User',
      user._id,
      req.user.id,
      req.user.entrepriseId,
      req.body
    );

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      entrepriseId: req.user.entrepriseId
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Log activity
    await logActivity(
      'delete',
      'User',
      user._id,
      req.user.id,
      req.user.entrepriseId,
      user
    );

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true pour port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
module.exports.forgotpwd = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email requis" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  // Génération du code à 6 chiffres
  const resetCode = Math.floor(100000 + Math.random() * 900000);

  // Hachage et expiration
  user.resetCode = await bcrypt.hash(resetCode.toString(), 12);
  user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  // Envoi par email
  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Réinitialisation du mot de passe",
    html: `<p>Votre code de réinitialisation est : <strong>${resetCode}</strong></p>
           <p>Ce code expire dans 15 minutes.</p>`,
  });

  res.status(200).json({ message: "Code de réinitialisation envoyé par email" });
});

// --- Réinitialisation du mot de passe ---
module.exports.resetpwd = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: "Email, code et nouveau mot de passe requis" });
  }

  const user = await User.findOne({ email }).select("+resetCode +resetCodeExpires +pwd");
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  // Vérifier l'expiration
  if (!user.resetCode || user.resetCodeExpires < Date.now()) {
    return res.status(400).json({ message: "Code expiré ou invalide" });
  }

  // Vérifier le code
  const isValid = await bcrypt.compare(code.toString(), user.resetCode);
  if (!isValid) return res.status(400).json({ message: "Code invalide" });

  // Hasher le nouveau mot de passe
  user.pwd = newPassword;

  // Supprimer resetCode après utilisation
  user.resetCode = undefined;
  user.resetCodeExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
});