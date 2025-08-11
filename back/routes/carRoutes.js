const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Get all cars
router.get('/', carController.getCars);

// Get one car
router.get('/:id', carController.getCar, (req, res) => {
  res.json(res.car);
});

// Create car
router.post('/', carController.createCar);

// Update car
router.patch('/:id', carController.getCar, carController.updateCar);

// Delete car
router.delete('/:id', carController.getCar, carController.deleteCar);

module.exports = router;
