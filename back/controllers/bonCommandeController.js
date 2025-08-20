const BonCommande = require('../models/bonCommandeModel');
const Activity = require('../models/Activity');
const { logActivity } = require('../services/activityService');

exports.debugBonCommandes = async (req, res) => {
  try {
    console.log('=== DEBUG START ===');
    console.log('User object:', JSON.stringify(req.user, null, 2));
    console.log('Enterprise ID:', req.user.entrepriseId);
    console.log('Enterprise ID type:', typeof req.user.entrepriseId);
    
    // Test 1: Count documents
    const count = await BonCommande.countDocuments();
    console.log('Total BonCommande in database:', count);
    
    // Test 2: Count for this enterprise
    const enterpriseCount = await BonCommande.countDocuments({ 
      entrepriseId: req.user.entrepriseId 
    });
    console.log('BonCommande for this enterprise:', enterpriseCount);
    
    // Test 3: Get one document without filter
    const anyBonCommande = await BonCommande.findOne();
    console.log('Sample BonCommnade from DB:', JSON.stringify(anyBonCommande, null, 2));
    
    // Test 4: Try to find with enterprise filter
    const filteredBonCommandes = await BonCommande.find({ 
      entrepriseId: req.user.entrepriseId 
    }).limit(1);
    console.log('Filtered BonCommandes:', JSON.stringify(filteredBonCommandes, null, 2));
    
    // Test 5: Compare with Client model (which works)
    const Client = require('../models/clientModel');
    const clientCount = await Client.countDocuments({ 
      entrepriseId: req.user.entrepriseId 
    });
    console.log('Clients for this enterprise:', clientCount);
    
    res.json({
      success: true,
      debug: {
        totalBonCommandes: count
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

// Get all BonCommande for current enterprise
exports.getBonCommandes = async (req, res) => {
  console.log("REQ.USER:!!!!!!", req.user); // <--- debug
  try {
    const bonCommandes = await BonCommande.find({ entrepriseId: req.user.entrepriseId })
    .populate("fournisseur", "name")
    .populate("client", "name"); 
    console.log("=== POPULATED ===", JSON.stringify(bonCommandes, null, 2));
    res.json({ success: true, data: bonCommandes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single BonCommande
exports.getBonCommandeById = async (req, res) => {
  try {
    const bonCommande = await BonCommande.findOne({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    }).populate("fournisseur", "name")
    .populate("client", "name"); 
    
    if (!bonCommande) {
      return res.status(404).json({ success: false, message: 'BonCommande not found' });
    }
    
    res.json({ success: true, data: bonCommande });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addBonCommande = async (req, res) => {
  try {
    console.log("🚀 === CREATE BonCommande DEBUG ===");
    console.log("📦 req.body:", JSON.stringify(req.body, null, 2));
    console.log("👤 req.user:", JSON.stringify(req.user, null, 2));
    console.log("🏢 req.user.entrepriseId:", req.user.entrepriseId);
    console.log("🔍 entrepriseId type:", typeof req.user.entrepriseId);

    // ✅ FIXED: Build the data object conditionally - NO spreading of req.body
    const bonCommandeData = {
      numeroCommande: req.body.numeroCommande,
      dateCommande: req.body.dateCommande,
      typeBonCommande: req.body.typeBonCommande,
      listeProduits: req.body.listeProduits,
      statut: req.body.statut,
      entrepriseId: req.user.entrepriseId
    };

    // Only add description if it exists
    if (req.body.description) {
      bonCommandeData.description = req.body.description;
    }

    // ✅ CRITICAL: Only add fournisseur OR client based on type and value
    if (req.body.typeBonCommande === "achat" && req.body.fournisseur && req.body.fournisseur.trim() !== "") {
      bonCommandeData.fournisseur = req.body.fournisseur;
      console.log("✅ Added fournisseur:", req.body.fournisseur);
    }

    if (req.body.typeBonCommande === "vente" && req.body.client && req.body.client.trim() !== "") {
      bonCommandeData.client = req.body.client;
      console.log("✅ Added client:", req.body.client);
    }

    console.log("💾 Data before save (CLEANED):", JSON.stringify(bonCommandeData, null, 2));
    console.log("🔍 entrepriseId in data:", bonCommandeData.entrepriseId);

    const bonCommande = new BonCommande(bonCommandeData);
    console.log("🏗️ Created instance (before save):", JSON.stringify(bonCommande.toObject(), null, 2));
    
    const newBonCommande = await bonCommande.save();
    console.log("✅ Saved document:", JSON.stringify(newBonCommande.toObject(), null, 2));

    // Log activity
    await logActivity(
      'create',
      'BonCommande',
      newBonCommande._id,
      req.user.id,
      req.user.entrepriseId,
      newBonCommande
    );

    res.status(201).json({ success: true, data: newBonCommande });
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

// Update BonCommande
exports.updateBonCommande = async (req, res) => {
  try {
    const bonCommande = await BonCommande.findOneAndUpdate(
      { _id: req.params.id, entrepriseId: req.user.entrepriseId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!bonCommande) {
      return res.status(404).json({ success: false, message: 'BonCommande not found' });
    }
    
    // Log activity
    await logActivity(
      'update', 
      'BonCommande', 
      bonCommande._id, 
      req.user.id, 
      req.user.entrepriseId,
      req.body
    );
    
    res.json({ success: true, data: bonCommande });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete bonCommande
exports.deleteBonCommande = async (req, res) => {
  try {
    const bonCommande = await BonCommande.findOneAndDelete({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!bonCommande) {
      return res.status(404).json({ success: false, message: 'BonCommande not found' });
    }
    
    // Log activity
    await logActivity(
      'delete', 
      'BonCommande', 
      bonCommande._id, 
      req.user.id, 
      req.user.entrepriseId,
      bonCommande
    );
    
    res.json({ success: true, message: 'BonCommande deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};