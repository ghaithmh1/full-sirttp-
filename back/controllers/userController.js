const User = require('../models/userModel');
const Activity = require('../models/Activity');
const { logActivity } = require('../services/activityService');
const jwt = require('jsonwebtoken');

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

    if (!email || !pwd) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe sont requis' });
    }

    const user = await User.findOne({ email }).select('+pwd');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email non trouvé' });
    }

    const isMatch = await user.comparePassword(pwd);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = user.generateAuthToken();

    res.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
        entrepriseId: user.entrepriseId,
        token
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
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