const SousTraitant = require('../models/sousTraitantModel');
const Depot = require('../models/depot');
const Activity = require('../models/Activity');
const { logActivity } = require('../services/activityService');
const mongoose = require('mongoose');

// Create sous-traitant with depot (transaction)
exports.createSousTraitant = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, phone, address, specialite } = req.body;
    const entrepriseId = req.user.entrepriseId;
    const userId = req.user.id;

    // Validate input
    if (!name || !email || !phone || !address || !specialite) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires'
      });
    }

    // Create depot first
    const depot = new Depot({
      name: `Dépôt ${name}`,
      location: address,
      num: phone,
      entrepriseId
    });

    const savedDepot = await depot.save({ session });

    // Create sous-traitant
    const sousTraitant = new SousTraitant({
      name,
      email,
      phone,
      address,
      specialite,
      depot: savedDepot._id,
      entrepriseId
    });

    const savedSousTraitant = await sousTraitant.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Log activity
    await Promise.all([
      logActivity('create', 'SousTraitant', savedSousTraitant._id, userId, entrepriseId, savedSousTraitant),
      logActivity('create', 'Depot', savedDepot._id, userId, entrepriseId, savedDepot)
    ]);

    res.status(201).json({
      success: true,
      data: {
        ...savedSousTraitant.toObject(),
        depot: savedDepot
      }
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error creating sous-traitant:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email déjà utilisé'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Get all sous-traitants for current enterprise
exports.getSousTraitants = async (req, res) => {
  try {
    const sousTraitants = await SousTraitant.find({ 
      entrepriseId: req.user.entrepriseId 
    }).populate('depot');
    
    res.json({
      success: true,
      count: sousTraitants.length,
      data: sousTraitants
    });
  } catch (error) {
    console.error('Error fetching sous-traitants:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Get single sous-traitant
exports.getSousTraitant = async (req, res) => {
  try {
    const sousTraitant = await SousTraitant.findOne({
      _id: req.params.id,
      entrepriseId: req.user.entrepriseId
    }).populate('depot');
    
    if (!sousTraitant) {
      return res.status(404).json({
        success: false,
        message: 'Sous-traitant non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: sousTraitant
    });
  } catch (error) {
    console.error('Error fetching sous-traitant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Update sous-traitant
exports.updateSousTraitant = async (req, res) => {
  try {
    const { name, email, phone, address, specialite } = req.body;
    const entrepriseId = req.user.entrepriseId;
    const userId = req.user.id;

    const updates = {
      name,
      email,
      phone,
      address,
      specialite,
      updatedAt: Date.now()
    };

    const sousTraitant = await SousTraitant.findOneAndUpdate(
      { _id: req.params.id, entrepriseId },
      updates,
      { new: true, runValidators: true }
    ).populate('depot');
    
    if (!sousTraitant) {
      return res.status(404).json({
        success: false,
        message: 'Sous-traitant non trouvé'
      });
    }

    // Log activity
    await logActivity(
      'update',
      'SousTraitant',
      sousTraitant._id,
      userId,
      entrepriseId,
      updates
    );

    res.json({
      success: true,
      data: sousTraitant
    });
  } catch (error) {
    console.error('Error updating sous-traitant:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email déjà utilisé'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Delete sous-traitant and associated depot
exports.deleteSousTraitant = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const entrepriseId = req.user.entrepriseId;
    const userId = req.user.id;

    // Find sous-traitant first to get depot ID
    const sousTraitant = await SousTraitant.findOne({
      _id: req.params.id,
      entrepriseId
    }).session(session);
    
    if (!sousTraitant) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Sous-traitant non trouvé'
      });
    }

    // Delete sous-traitant
    await SousTraitant.deleteOne({ _id: req.params.id }).session(session);
    
    // Delete associated depot
    await Depot.deleteOne({ _id: sousTraitant.depot }).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Log activity
    await Promise.all([
      logActivity('delete', 'SousTraitant', sousTraitant._id, userId, entrepriseId, sousTraitant),
      logActivity('delete', 'Depot', sousTraitant.depot, userId, entrepriseId, {
        name: `Dépôt ${sousTraitant.name}` 
      })
    ]);

    res.json({
      success: true,
      message: 'Sous-traitant et dépôt associé supprimés'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error deleting sous-traitant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};