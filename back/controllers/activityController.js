const Activity = require('../models/Activity');

// Get all activities for current enterprise
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ entrepriseId: req.user.entrepriseId })
      .populate('userId', 'nom prenom email')
      .sort('-timestamp')
      .limit(50);
      
    res.json({ success: true, data: activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get activities for specific entity
exports.getEntityActivities = async (req, res) => {
  try {
    const { model, id } = req.params;
    
    const activities = await Activity.find({ 
      model, 
      documentId: id,
      entrepriseId: req.user.entrepriseId 
    })
    .populate('userId', 'nom prenom email')
    .sort('-timestamp');
    
    res.json({ success: true, data: activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};