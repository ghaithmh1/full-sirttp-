const Activity = require('../models/Activity');

exports.logActivity = async (action, model, documentId, userId, entrepriseId, changes = null) => {
  try {
    const activity = new Activity({
      action,
      model,
      documentId,
      userId,
      entrepriseId,
      changes
    });
    
    await activity.save();
    return activity;
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};