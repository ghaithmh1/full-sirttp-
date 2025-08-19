const Client = require('../models/clientModel');
const Activity = require('../models/Activity');
const { logActivity } = require('../services/activityService');

// Get all clients for current enterprise
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ entrepriseId: req.user.entrepriseId });
    res.json({ success: true, data: clients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single client
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findOne({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    res.json({ success: true, data: client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create client
exports.createClient = async (req, res) => {
  try {
    const clientData = {
      ...req.body,
      entrepriseId: req.user.entrepriseId
    };
    
    const client = new Client(clientData);
    const newClient = await client.save();
    
    // Log activity
    await logActivity(
      'create', 
      'Client', 
      newClient._id, 
      req.user.id, 
      req.user.entrepriseId,
      newClient
    );
    
    res.status(201).json({ success: true, data: newClient });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, entrepriseId: req.user.entrepriseId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    // Log activity
    await logActivity(
      'update', 
      'Client', 
      client._id, 
      req.user.id, 
      req.user.entrepriseId,
      req.body
    );
    
    res.json({ success: true, data: client });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    // Log activity
    await logActivity(
      'delete', 
      'Client', 
      client._id, 
      req.user.id, 
      req.user.entrepriseId,
      client
    );
    
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};