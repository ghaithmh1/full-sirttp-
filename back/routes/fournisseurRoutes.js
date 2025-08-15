const express = require('express');
const router = express.Router();
const fournisseurController = require('../controllers/fournisseurController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect(), fournisseurController.getFournisseurs);
router.get('/:id', protect(), fournisseurController.getFournisseur);
router.post('/', protect(['admin', 'superadmin']), fournisseurController.createFournisseur);
router.put('/:id', protect(['admin', 'superadmin']), fournisseurController.updateFournisseur);
router.delete('/:id', protect(['admin', 'superadmin']), fournisseurController.deleteFournisseur);

module.exports = router;