const Entreprise = require('../models/entrepriseModel');
const User = require('../models/userModel');
const Activity = require('../models/Activity');
const { logActivity } = require('../services/activityService');
const mongoose = require('mongoose');

// Create entreprise (and set the creator as admin)
exports.createEntreprise = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const {
      identifiantFiscal,
      nom,
      adresse,
      ville,
      codePostal,
      telephone,
      email,
      secteurActivite,
      dateCreation,
      description,
      taille,
      creatorId,
      users = [] // Array of user IDs to be added to the entreprise
    } = req.body;

  

    // Validate required fields
    if (!identifiantFiscal || !nom || !adresse || !ville || !telephone || !creatorId) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    // Validate phone
    if (!/^[259]\d{7}$/.test(telephone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    // Ensure creator is included in users
    const allUsers = [...new Set([...users, creatorId])];

    // Create entreprise
    const entreprise = new Entreprise({
      identifiantFiscal,
      nom,
      adresse,
      ville,
      codePostal,
      telephone,
      email,
      secteurActivite,
      dateCreation: dateCreation || Date.now(),
      description,
      taille,
      users: allUsers,
      createdBy: creatorId
    });
    
    const newEntreprise = await entreprise.save({ session });

    // Update users to set role to admin and link to entreprise
    await User.updateMany(
      { _id: { $in: allUsers } },
      { 
        $set: { 
          role: 'admin',
          entrepriseId: newEntreprise._id
        } 
      },
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Log activity
    await logActivity(
      'create',
      'Entreprise',
      newEntreprise._id,
      creatorId,
      newEntreprise._id, // entrepriseId is the same as the created entreprise
      newEntreprise
    );

    res.status(201).json({ success: true, data: newEntreprise });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Identifiant fiscal already exists' 
      });
    }
    
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get entreprise by ID (only for users of that entreprise)
exports.getEntreprise = async (req, res) => {
  try {
    const entreprise = await Entreprise.findOne({ 
      _id: req.params.id,
      users: req.user.id
    }).populate('users', 'nom prenom email role');
    
    if (!entreprise) {
      return res.status(404).json({ success: false, message: 'Entreprise not found' });
    }
    
    res.json({ success: true, data: entreprise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get current user's entreprise
exports.getMyEntreprise = async (req, res) => {
  try {
    if (!req.user.entrepriseId) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not associated with an entreprise' 
      });
    }
    
    const entreprise = await Entreprise.findById(req.user.entrepriseId)
      .populate('users', 'nom prenom email role')
      .populate('createdBy', 'nom prenom')
      .populate('updatedBy', 'nom prenom');
    
    if (!entreprise) {
      return res.status(404).json({ success: false, message: 'Entreprise not found' });
    }
    
    res.json({ success: true, data: entreprise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update entreprise (only admin)
exports.updateEntreprise = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const updates = req.body;
    const userId = req.user.id;
    
    // Find entreprise
    const entreprise = await Entreprise.findOne({
      _id: req.params.id,
      users: userId
    }).session(session);
    
    if (!entreprise) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Entreprise not found' });
    }
    
    // Prevent updating critical fields
    delete updates.identifiantFiscal;
    delete updates.createdBy;
    delete updates.users;
    
    // Update fields
    Object.keys(updates).forEach(key => {
      entreprise[key] = updates[key];
    });
    
    // Set updatedBy
    entreprise.updatedBy = userId;
    
    const updatedEntreprise = await entreprise.save({ session });
    
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    
    // Log activity
    await logActivity(
      'update',
      'Entreprise',
      updatedEntreprise._id,
      userId,
      updatedEntreprise._id,
      updates
    );
    
    res.json({ success: true, data: updatedEntreprise });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Add user to entreprise (admin only)
exports.addUserToEntreprise = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { userId } = req.body;
    const adminId = req.user.id;
    const entrepriseId = req.user.entrepriseId;
    
    // Find entreprise
    const entreprise = await Entreprise.findOne({
      _id: entrepriseId,
      users: adminId
    }).session(session);
    
    if (!entreprise) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Entreprise not found' });
    }
    
    // Check if user already in entreprise
    if (entreprise.users.includes(userId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        success: false, 
        message: 'User already in entreprise' 
      });
    }
    
    // Add user to entreprise
    entreprise.users.push(userId);
    entreprise.updatedBy = adminId;
    await entreprise.save({ session });
    
    // Update user to set entrepriseId
    const user = await User.findByIdAndUpdate(
      userId,
      { entrepriseId },
      { new: true, session }
    );
    
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    
    // Log activity
    await logActivity(
      'update',
      'Entreprise',
      entrepriseId,
      adminId,
      entrepriseId,
      { action: 'add_user', userId }
    );
    
    res.json({ success: true, data: entreprise });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove user from entreprise (admin only)
exports.removeUserFromEntreprise = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { userId } = req.body;
    const adminId = req.user.id;
    const entrepriseId = req.user.entrepriseId;
    
    // Cannot remove yourself
    if (userId === adminId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot remove yourself from entreprise' 
      });
    }
    
    // Find entreprise
    const entreprise = await Entreprise.findOne({
      _id: entrepriseId,
      users: adminId
    }).session(session);
    
    if (!entreprise) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Entreprise not found' });
    }
    
    // Check if user is in entreprise
    const userIndex = entreprise.users.indexOf(userId);
    if (userIndex === -1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        success: false, 
        message: 'User not in entreprise' 
      });
    }
    
    // Remove user from entreprise
    entreprise.users.splice(userIndex, 1);
    entreprise.updatedBy = adminId;
    await entreprise.save({ session });
    
    // Update user to remove entrepriseId and downgrade role
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        $unset: { entrepriseId: 1 },
        role: 'user'
      },
      { new: true, session }
    );
    
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    
    // Log activity
    await logActivity(
      'update',
      'Entreprise',
      entrepriseId,
      adminId,
      entrepriseId,
      { action: 'remove_user', userId }
    );
    
    res.json({ success: true, data: entreprise });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};