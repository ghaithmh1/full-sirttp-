const createHttpError = require("http-errors");
const SousTraitant = require("../models/sousTraitantModel");
const { default: mongoose } = require("mongoose");

const addSousTraitant = async (req, res, next) => {
  try {
    const sousTraitant = new SousTraitant(req.body);
    await sousTraitant.save();
    res
      .status(201)
      .json({ success: true, message: "SousTraitant created!", data: sousTraitant });
  } catch (error) {
    next(error);
  }
};    

const getSousTraitantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const sousTraitant = await SousTraitant.findById(id);
    if (!sousTraitant) {
      const error = createHttpError(404, "Sous Traitant not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: sousTraitant });
  } catch (error) {
    next(error);
  }
};

const getSousTraitants = async (req, res, next) => {
  try {
  const sousTraitants = await SousTraitant.find();
    res.status(200).json({ data: sousTraitants });
  } catch (error) {
    next(error);
  }
};



const updateSousTraitant = async (req, res, next) => {
  try {
    const updates = req.body; // Use all fields from body
    const { id } = req.params;

    console.log("Request body:", req.body);
    console.log("Sous Traitant ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    // Optional: Prevent updating certain fields like _id
    delete updates._id;

    if (Object.keys(updates).length === 0) {
      return next(createHttpError(400, "No fields provided for update"));
    }

    const sousTraitant = await SousTraitant.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!sousTraitant) {
      const error = createHttpError(404, "Sous Traitant not found!");
      return next(error);
    }

    res.status(200).json({ success: true, message: "Sous Traitant updated", data: sousTraitant });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const deleteSousTraitant = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid id!"));
    }

    const sousTraitant = await SousTraitant.findByIdAndDelete(id);
    if (!sousTraitant) {
      return next(createHttpError(404, "SousTraitant not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "Sous Traitant deleted successfully" });
  } catch (error) {
    next(error);
  }
};


module.exports = { addSousTraitant, getSousTraitantById, getSousTraitants, updateSousTraitant, deleteSousTraitant };
