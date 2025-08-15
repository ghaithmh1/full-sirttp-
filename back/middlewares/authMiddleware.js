const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = (roles = []) => async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-pwd');
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    
    // Ensure user has an enterprise
    if (!req.user.entrepriseId) {
      return res.status(403).json({ 
        success: false, 
        message: 'User not associated with an enterprise' 
      });
    }
    
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

module.exports = { protect };