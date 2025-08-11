const createHttpError = require("http-errors");
const Fournisseur = require("../models/fournisseurModel");
const { default: mongoose } = require("mongoose");

const addFournisseur = async (req, res, next) => {
  try {
    const fournisseur = new Fournisseur(req.body);
    await fournisseur.save();
    res
      .status(201)
      .json({ success: true, message: "Fournisseur created!", data: fournisseur });
  } catch (error) {
    next(error);
  }
};

const getFournisseurById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const fournisseur = await Fournisseur.findById(id);
    if (!fournisseur) {
      const error = createHttpError(404, "Fournisseur not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: fournisseur });
  } catch (error) {
    next(error);
  }
};

const getFournisseurs = async (req, res, next) => {
  try {
  const fournisseurs = await Fournisseur.find();
    res.status(200).json({ data: fournisseurs });
  } catch (error) {
    next(error);
  }
};



const updateFournisseur = async (req, res, next) => {
  try {
    const updates = req.body; // Use all fields from body
    const { id } = req.params;

    console.log("Request body:", req.body);
    console.log("Fournisseur ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    // Optional: Prevent updating certain fields like _id
    delete updates._id;

    if (Object.keys(updates).length === 0) {
      return next(createHttpError(400, "No fields provided for update"));
    }

    const fournisseur = await Fournisseur.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!fournisseur) {
      const error = createHttpError(404, "Fournisseur not found!");
      return next(error);
    }

    res.status(200).json({ success: true, message: "Fournisseur updated", data: fournisseur });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const deleteFournisseur = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid id!"));
    }

    const fournisseur = await Fournisseur.findByIdAndDelete(id);
    if (!fournisseur) {
      return next(createHttpError(404, "Fournisseur not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "Fournisseur deleted successfully" });
  } catch (error) {
    next(error);
  }
};


module.exports = { addFournisseur, getFournisseurById, getFournisseurs, updateFournisseur, deleteFournisseur };
