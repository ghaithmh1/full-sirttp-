const express = require('express');
const router = express.Router();
const depotController = require('../controllers/depotController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect(), depotController.getDepots);
router.get('/:id', protect(), depotController.getDepot);
router.post('/', protect(['admin', 'superadmin']), depotController.createDepot);
router.put('/:id', protect(['admin', 'superadmin']), depotController.updateDepot);
router.delete('/:id', protect(['admin', 'superadmin']), depotController.deleteDepot);

module.exports = router;