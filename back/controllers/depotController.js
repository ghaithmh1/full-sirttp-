const Depot = require('../models/depot');
const Activity = require('../models/Activity');
const { logActivity } = require('../services/activityService');

// Get all depots for current enterprise
exports.getDepots = async (req, res) => {
  try {
    const depots = await Depot.find({ entrepriseId: req.user.entrepriseId });
    res.json({ success: true, data: depots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single depot
exports.getDepot = async (req, res) => {
  try {
    const depot = await Depot.findOne({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!depot) {
      return res.status(404).json({ success: false, message: 'Depot not found' });
    }
    
    res.json({ success: true, data: depot });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create depot
exports.createDepot = async (req, res) => {
  try {
    const depotData = {
      ...req.body,
      entrepriseId: req.user.entrepriseId
    };
    
    const depot = new Depot(depotData);
    const newDepot = await depot.save();
    
    // Log activity
    await logActivity(
      'create', 
      'Depot', 
      newDepot._id, 
      req.user.id, 
      req.user.entrepriseId,
      newDepot
    );
    
    res.status(201).json({ success: true, data: newDepot });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update depot
exports.updateDepot = async (req, res) => {
  try {
    const depot = await Depot.findOneAndUpdate(
      { _id: req.params.id, entrepriseId: req.user.entrepriseId },
      req.body,
      { new: true }
    );
    
    if (!depot) {
      return res.status(404).json({ success: false, message: 'Depot not found' });
    }
    
    // Log activity
    await logActivity(
      'update', 
      'Depot', 
      depot._id, 
      req.user.id, 
      req.user.entrepriseId,
      req.body
    );
    
    res.json({ success: true, data: depot });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete depot
exports.deleteDepot = async (req, res) => {
  try {
    const depot = await Depot.findOneAndDelete({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!depot) {
      return res.status(404).json({ success: false, message: 'Depot not found' });
    }
    
    // Log activity
    await logActivity(
      'delete', 
      'Depot', 
      depot._id, 
      req.user.id, 
      req.user.entrepriseId,
      depot
    );
    
    res.json({ success: true, message: 'Depot deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};