const express = require('express');
const router = express.Router();
const entrepriseController = require('../controllers/entrepriseController');
const { protect } = require('../middlewares/authMiddleware');

// Create entreprise (no protection needed - first step)
router.post('/', entrepriseController.createEntreprise);

// Protected routes (require authentication)
router.get('/my-entreprise', protect(), entrepriseController.getMyEntreprise);
router.get('/:id', protect(), entrepriseController.getEntreprise);
router.put('/:id', protect(['admin', 'superadmin']), entrepriseController.updateEntreprise);

// User management
router.post('/add-user', protect(['admin', 'superadmin']), entrepriseController.addUserToEntreprise);
router.post('/remove-user', protect(['admin', 'superadmin']), entrepriseController.removeUserFromEntreprise);
router.post('/join', protect(), entrepriseController.joinEntreprise);

module.exports = router;