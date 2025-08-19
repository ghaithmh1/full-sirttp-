const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect(), carController.getCars);
router.get('/:id', protect(), carController.getCar);
router.post('/', protect(['admin', 'superadmin']), carController.createCar);
router.put('/:id', protect(['admin', 'superadmin']), carController.updateCar);
router.delete('/:id', protect(['admin', 'superadmin']), carController.deleteCar);

module.exports = router;   