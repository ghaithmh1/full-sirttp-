const express = require('express');
const router = express.Router();
const sousTraitantController = require('../controllers/sousTraitantController');
const { protect } = require('../middlewares/authMiddleware');

// Protected routes
router.post('/', protect(), sousTraitantController.createSousTraitant);
router.get('/', protect(), sousTraitantController.getSousTraitants);
router.get('/:id', protect(), sousTraitantController.getSousTraitant);
router.put('/:id', protect(), sousTraitantController.updateSousTraitant);
router.delete('/:id', protect(), sousTraitantController.deleteSousTraitant);

module.exports = router;