const Fournisseur = require('../models/fournisseurModel');
const Activity = require('../models/Activity');
const { logActivity } = require('../services/activityService');

// Get all fournisseurs for current enterprise
exports.getFournisseurs = async (req, res) => {
  try {
    const fournisseurs = await Fournisseur.find({ entrepriseId: req.user.entrepriseId });
    res.json({ success: true, data: fournisseurs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single fournisseur
exports.getFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findOne({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!fournisseur) {
      return res.status(404).json({ success: false, message: 'Fournisseur not found' });
    }
    
    res.json({ success: true, data: fournisseur });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create fournisseur
exports.createFournisseur = async (req, res) => {
  try {
    const fournisseurData = {
      ...req.body,
      entrepriseId: req.user.entrepriseId
    };
    
    const fournisseur = new Fournisseur(fournisseurData);
    const newFournisseur = await fournisseur.save();
    
    // Log activity
    await logActivity(
      'create', 
      'Fournisseur', 
      newFournisseur._id, 
      req.user.id, 
      req.user.entrepriseId,
      newFournisseur
    );
    
    res.status(201).json({ success: true, data: newFournisseur });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update fournisseur
exports.updateFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findOneAndUpdate(
      { _id: req.params.id, entrepriseId: req.user.entrepriseId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!fournisseur) {
      return res.status(404).json({ success: false, message: 'Fournisseur not found' });
    }
    
    // Log activity
    await logActivity(
      'update', 
      'Fournisseur', 
      fournisseur._id, 
      req.user.id, 
      req.user.entrepriseId,
      req.body
    );
    
    res.json({ success: true, data: fournisseur });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete fournisseur
exports.deleteFournisseur = async (req, res) => {
  try {
    const fournisseur = await Fournisseur.findOneAndDelete({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!fournisseur) {
      return res.status(404).json({ success: false, message: 'Fournisseur not found' });
    }
    
    // Log activity
    await logActivity(
      'delete', 
      'Fournisseur', 
      fournisseur._id, 
      req.user.id, 
      req.user.entrepriseId,
      fournisseur
    );
    
    res.json({ success: true, message: 'Fournisseur deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};