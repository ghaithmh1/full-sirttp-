// protect.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // ✅ Assure-toi que le chemin est correct

const protect = (options = {}) => async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-pwd');

    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });

    // Vérification des rôles si nécessaire
    if (options.roles?.length > 0 && !options.roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    // Vérification facultative de l'entreprise
    if (options.requireEntreprise && !req.user.entrepriseId) {
      return res.status(403).json({ success: false, message: 'User not associated with an enterprise' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

module.exports = { protect };
