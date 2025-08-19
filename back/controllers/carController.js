const Car = require('../models/Car');
const Activity = require('../models/Activity');
const { logActivity } = require('../services/activityService');

// Get all cars for current enterprise
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ entrepriseId: req.user.entrepriseId });
    res.json({ success: true, data: cars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single car
exports.getCar = async (req, res) => {
  try {
    const car = await Car.findOne({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    
    res.json({ success: true, data: car });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create car
exports.createCar = async (req, res) => {
  try {
    const carData = {
      ...req.body,
      entrepriseId: req.user.entrepriseId
    };
    
    const car = new Car(carData);
    const newCar = await car.save();
    
    // Log activity
    await logActivity(
      'create', 
      'Car', 
      newCar._id, 
      req.user.id, 
      req.user.entrepriseId,
      newCar
    );
    
    res.status(201).json({ success: true, data: newCar });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update car
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, entrepriseId: req.user.entrepriseId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    
    // Log activity
    await logActivity(
      'update', 
      'Car', 
      car._id, 
      req.user.id, 
      req.user.entrepriseId,
      req.body
    );
    
    res.json({ success: true, data: car });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete car
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ 
      _id: req.params.id, 
      entrepriseId: req.user.entrepriseId 
    });
    
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    
    // Log activity
    await logActivity(
      'delete', 
      'Car', 
      car._id, 
      req.user.id, 
      req.user.entrepriseId,
      car
    );
    
    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};