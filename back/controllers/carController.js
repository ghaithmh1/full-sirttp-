const Car = require('../models/Car');

// Get all cars
async function getCars(req, res) {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get one car
async function getCar(req, res, next) {
  let car;
  try {
    car = await Car.findById(req.params.id);
    if (car == null) {
      return res.status(404).json({ message: 'Cannot find car' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.car = car;
  next();
}

// Create car
async function createCar(req, res) {
  const car = new Car({
    name: req.body.name,
    model: req.body.model,
    serie: req.body.serie,
    registrationCard: req.body.registrationCard,
    insurance: req.body.insurance,
    mileage: req.body.mileage
  });

  try {
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Update car
async function updateCar(req, res) {
  if (req.body.name != null) res.car.name = req.body.name;
  if (req.body.model != null) res.car.model = req.body.model;
  if (req.body.serie != null) res.car.serie = req.body.serie;
  if (req.body.registrationCard != null) res.car.registrationCard = req.body.registrationCard;
  if (req.body.insurance != null) res.car.insurance = req.body.insurance;
  if (req.body.mileage != null) res.car.mileage = req.body.mileage;
  if (req.body.lastServiceDate != null) res.car.lastServiceDate = req.body.lastServiceDate;
  if (req.body.nextServiceDue != null) res.car.nextServiceDue = req.body.nextServiceDue;

  try {
    const updatedCar = await res.car.save();
    res.json(updatedCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Delete car
async function deleteCar(req, res) {
  try {
    await res.car.deleteOne();
    res.json({ message: 'Deleted Car' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar
};
