const createHttpError = require("http-errors");
const Produit = require("../models/produitModel");
const { default: mongoose } = require("mongoose");

const addProduit = async (req, res, next) => {
  try {
    const produit = new Produit(req.body);
    await produit.save();
    res
      .status(201)
      .json({ success: true, message: "Produit created!", data: produit });
  } catch (error) {
    next(error);
  }
};

const getProduitById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const produit = await Produit.findById(id);
    if (!produit) {
      const error = createHttpError(404, "Produit not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: produit });
  } catch (error) {
    next(error);
  }
};

const getProduits = async (req, res, next) => {
  try {
  const produits = await Produit.find();
    res.status(200).json({ data: produits });
  } catch (error) {
    next(error);
  }
};



const updateProduit = async (req, res, next) => {
  try {
    const updates = req.body; // Use all fields from body
    const { id } = req.params;

    console.log("Request body:", req.body);
    console.log("Produit ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    // Optional: Prevent updating certain fields like _id
    delete updates._id;

    if (Object.keys(updates).length === 0) {
      return next(createHttpError(400, "No fields provided for update"));
    }

    const produit = await Produit.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!produit) {
      const error = createHttpError(404, "Produit not found!");
      return next(error);
    }

    res.status(200).json({ success: true, message: "Produit updated", data: produit });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const deleteProduit = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid id!"));
    }

    const produit = await Produit.findByIdAndDelete(id);
    if (!produit) {
      return next(createHttpError(404, "Produit not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "Produit deleted successfully" });
  } catch (error) {
    next(error);
  }
};


module.exports = { addProduit, getProduitById, getProduits, updateProduit, deleteProduit };
