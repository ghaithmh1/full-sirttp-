const Produit = require('../models/produitModel');
const Activity = require('../models/Activity');
const { logActivity } = require('../services/activityService');

// Add this to your produitController.js temporarily

exports.debugProduits = async (req, res) => {
  try {
    console.log('=== DEBUG START ===');
    console.log('User object:', JSON.stringify(req.user, null, 2));
    console.log('Enterprise ID:', req.user.entrepriseId);
    console.log('Enterprise ID type:', typeof req.user.entrepriseId);
    
    // Test 1: Count documents
    const count = await Produit.countDocuments();
    console.log('Total produits in database:', count);
    
    // Test 2: Count for this enterprise
    const enterpriseCount = await Produit.countDocuments({ 
      entrepriseId: req.user.entrepriseId 
    });
    console.log('Produits for this enterprise:', enterpriseCount);
    
    // Test 3: Get one document without filter
    const anyProduit = await Produit.findOne();
    console.log('Sample produit from DB:', JSON.stringify(anyProduit, null, 2));
    
    // Test 4: Try to find with enterprise filter
    const filteredProduits = await Produit.find({ 
      entrepriseId: req.user.entrepriseId 
    }).limit(1);
    console.log('Filtered produits:', JSON.stringify(filteredProduits, null, 2));
    
    // Test 5: Compare with Client model (which works)
    const Client = require('../models/clientModel');
    const clientCount = await Client.countDocuments({ 
      entrepriseId: req.user.entrepriseId 
    });
    console.log('Clients for this enterprise:', clientCount);
    
    res.json({
      success: true,
      debug: {
        totalProduits: count,
        enterpriseProduits: enterpriseCount,
        enterpriseClients: clientCount,
        sampleProduit: anyProduit,
        filteredProduits: filteredProduits
      }
    });
    
  } catch (error) {
    console.error('=== DEBUG ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    });
  }
};

// Get all produits for current enterprise
exports.getProduits = async (req, res) => {
  console.log("REQ.USER:!!!!!!", req.user); // <--- debug
  try {
    const produits = await Produit.find({ entrepriseId: req.user.entrepriseId });
    res.json({ success: true, data: produits });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single produit
exports.getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findOne({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit not found' });
    }
    
    res.json({ success: true, data: produit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create produit
exports.addProduit = async (req, res) => {
  try {
    const produitData = {
      ...req.body,
      entrepriseId: req.user.entrepriseId
    };
    
    const produit = new Produit(produitData);
    const newProduit = await produit.save();
    
    // Log activity
    await logActivity(
      'create', 
      'Produit', 
      newProduit._id, 
      req.user.id, 
      req.user.entrepriseId,
      newProduit
    );
    
    res.status(201).json({ success: true, data: newProduit });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update produit
exports.updateProduit = async (req, res) => {
  try {
    const produit = await Produit.findOneAndUpdate(
      { _id: req.params.id, entrepriseId: req.user.entrepriseId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit not found' });
    }
    
    // Log activity
    await logActivity(
      'update', 
      'Produit', 
      produit._id, 
      req.user.id, 
      req.user.entrepriseId,
      req.body
    );
    
    res.json({ success: true, data: produit });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete produit
exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findOneAndDelete({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!produit) {
      return res.status(404).json({ success: false, message: 'Produit not found' });
    }
    
    // Log activity
    await logActivity(
      'delete', 
      'Produit', 
      produit._id, 
      req.user.id, 
      req.user.entrepriseId,
      produit
    );
    
    res.json({ success: true, message: 'Produit deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};