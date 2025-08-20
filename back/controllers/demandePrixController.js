const DemandePrix = require('../models/demandePrixModel');
const Activity = require('../models/Activity');
const { logActivity } = require('../services/activityService');

exports.debugDemandePrixs = async (req, res) => {
  try {
    console.log('=== DEBUG START ===');
    console.log('User object:', JSON.stringify(req.user, null, 2));
    console.log('Enterprise ID:', req.user.entrepriseId);
    console.log('Enterprise ID type:', typeof req.user.entrepriseId);
    
    // Test 1: Count documents
    const count = await DemandePrix.countDocuments();
    console.log('Total DemandePrix in database:', count);
    
    // Test 2: Count for this enterprise
    const enterpriseCount = await DemandePrix.countDocuments({ 
      entrepriseId: req.user.entrepriseId 
    });
    console.log('DemandePrix for this enterprise:', enterpriseCount);
    
    // Test 3: Get one document without filter
    const anyDemandePrix = await DemandePrix.findOne();
    console.log('Sample DemandePrix from DB:', JSON.stringify(anyDemandePrix, null, 2));
    
    // Test 4: Try to find with enterprise filter
    const filteredDemandePrixs = await DemandePrix.find({ 
      entrepriseId: req.user.entrepriseId 
    }).limit(1);
    console.log('Filtered DemandePrixs:', JSON.stringify(filteredDemandePrixs, null, 2));
    
    // Test 5: Compare with Client model (which works)
    const Client = require('../models/clientModel');
    const clientCount = await Client.countDocuments({ 
      entrepriseId: req.user.entrepriseId 
    });
    console.log('Clients for this enterprise:', clientCount);
    
    res.json({
      success: true,
      debug: {
        totalDemandePrixs: count
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

// Get all DemandePrixs for current enterprise
exports.getDemandePrixs = async (req, res) => {
  console.log("REQ.USER:!!!!!!", req.user); // <--- debug
  try {
    const demandePrixs = await DemandePrix.find({ entrepriseId: req.user.entrepriseId })
    .populate("fournisseur", "name"); 
    console.log("=== POPULATED ===", JSON.stringify(demandePrixs, null, 2));
    res.json({ success: true, data: demandePrixs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single DemandePrix
exports.getDemandePrixById = async (req, res) => {
  try {
    const demandePrix = await DemandePrix.findOne({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    }).populate("fournisseur", "name"); 
    
    if (!demandePrix) {
      return res.status(404).json({ success: false, message: 'DemandePrix not found' });
    }
    
    res.json({ success: true, data: demandePrix });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/*exports.addDemandePrix = async (req, res) => {
  try {
    const demandePrixData = {
      ...req.body,
      entrepriseId: req.user.entrepriseId // ensure it's linked to the right enterprise
    };

    const demandePrix = new DemandePrix(demandePrixData);
    const newDemandePrix = await demandePrix.save();

    // Log activity
    await logActivity(
      'create',
      'DemandePrix',
      newDemandePrix._id,
      req.user.id,
      req.user.entrepriseId,
      newDemandePrix
    );

    res.status(201).json({ success: true, data: newDemandePrix });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};*/

exports.addDemandePrix = async (req, res) => {
  try {
    console.log("🚀 === CREATE DEMANDE DEBUG ===");
    console.log("📦 req.body:", JSON.stringify(req.body, null, 2));
    console.log("👤 req.user:", JSON.stringify(req.user, null, 2));
    console.log("🏢 req.user.entrepriseId:", req.user.entrepriseId);
    console.log("🔍 entrepriseId type:", typeof req.user.entrepriseId);

    const demandePrixData = {
      ...req.body,
      entrepriseId: req.user.entrepriseId
    };

    console.log("💾 Data before save:", JSON.stringify(demandePrixData, null, 2));
    console.log("🔍 entrepriseId in data:", demandePrixData.entrepriseId);

    const demandePrix = new DemandePrix(demandePrixData);
    console.log("🏗️ Created instance (before save):", JSON.stringify(demandePrix.toObject(), null, 2));
    
    const newDemandePrix = await demandePrix.save();
    console.log("✅ Saved document:", JSON.stringify(newDemandePrix.toObject(), null, 2));

    // Log activity
    await logActivity(
      'create',
      'DemandePrix',
      newDemandePrix._id,
      req.user.id,
      req.user.entrepriseId,
      newDemandePrix
    );

    res.status(201).json({ success: true, data: newDemandePrix });
  } catch (error) {
    console.error("❌ Creation error:", error);
    console.error("❌ Error name:", error.name);
    console.error("❌ Error message:", error.message);
    console.error("❌ Validation errors:", error.errors);
    res.status(400).json({ 
      success: false, 
      message: error.message,
      errors: error.errors 
    });
  }
};

// Update DemandePrix
exports.updateDemandePrix = async (req, res) => {
  try {
    const demandePrix = await DemandePrix.findOneAndUpdate(
      { _id: req.params.id, entrepriseId: req.user.entrepriseId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!demandePrix) {
      return res.status(404).json({ success: false, message: 'DemandePrix not found' });
    }
    
    // Log activity
    await logActivity(
      'update', 
      'DemandePrix', 
      demandePrix._id, 
      req.user.id, 
      req.user.entrepriseId,
      req.body
    );
    
    res.json({ success: true, data: demandePrix });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete demandePrix
exports.deleteDemandePrix = async (req, res) => {
  try {
    const demandePrix = await DemandePrix.findOneAndDelete({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!demandePrix) {
      return res.status(404).json({ success: false, message: 'DemandePrix not found' });
    }
    
    // Log activity
    await logActivity(
      'delete', 
      'DemandePrix', 
      demandePrix._id, 
      req.user.id, 
      req.user.entrepriseId,
      demandePrix
    );
    
    res.json({ success: true, message: 'DemandePrix deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};