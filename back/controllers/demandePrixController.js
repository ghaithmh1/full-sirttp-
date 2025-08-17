const createHttpError = require("http-errors");
const DemandePrix = require("../models/demandePrixModel");
const Fournisseur = require("../models/fournisseurModel");
const Produit = require("../models/produitModel");
const { default: mongoose } = require("mongoose");


const addDemandePrix = async (req, res, next) => {
  try {
    // 1️⃣ Verify fournisseur exists (optional but recommended)
    const fournisseur = await Fournisseur.findById(req.body.fournisseur);
    if (!fournisseur) {
      return res.status(400).json({ success: false, message: "Fournisseur invalide" });
    }

    // 2️⃣ Fill in nomProduit for each product
    for (let p of req.body.listeProduits) {
      const prod = await Produit.findById(p.idProduit);
      if (!prod) {
        return res.status(400).json({ success: false, message: `Produit invalide: ${p.idProduit}` });
      }
      p.nomProduit = prod.nom; // add the readable name
    }

    // 3️⃣ Save the demandePrix
    const demandePrix = new DemandePrix(req.body);
    await demandePrix.save();

    res.status(201).json({
      success: true,
      message: "DemandePrix created!",
      data: demandePrix,
    });
  } catch (error) {
    next(error);
  }
};

/*
const addDemandePrix = async (req, res, next) => {
  try {
    const demandePrix = new DemandePrix(req.body);
    await demandePrix.save();
    res
      .status(201)
      .json({ success: true, message: "DemandePrix created!", data: demandePrix });
  } catch (error) {
    next(error);
  }
};*/

/*const addDemandePrix = async (req, res, next) => {
  try {
    const { numeroDemande, listeProduits, fournisseur } = req.body;

    // Vérification des champs obligatoires
    if (!numeroDemande) {
      return next(createHttpError(400, "Le numéro de demande est obligatoire"));
    }

    if (!listeProduits || !Array.isArray(listeProduits) || listeProduits.length === 0) {
      return next(createHttpError(400, "La liste des produits est obligatoire"));
    }

    if (!fournisseur) {
      return next(createHttpError(400, "Le fournisseur est obligatoire"));
    }

    // Création de la demande de prix
    const demandePrix = new DemandePrix(req.body);
    await demandePrix.save();

    res.status(201).json({
      success: true,
      message: "Demande de prix créée avec succès !",
      data: demandePrix
    });
  } catch (error) {
    next(error);
  }
};*/

const getDemandePrixById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const demandePrix = await DemandePrix.findById(id);
    if (!demandePrix) {
      const error = createHttpError(404, "DemandePrix not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: demandePrix });
  } catch (error) {
    next(error);
  }
};

/*const getDemandePrixs = async (req, res, next) => {
  try {
  const demandePrixs = await DemandePrix.find();
    res.status(200).json({ data: demandePrixs });
  } catch (error) {
    next(error);
  }
};*/

const getDemandePrixs = async (req, res, next) => {
  try {
    const demandePrixs = await DemandePrix.find()
      .populate('listeProduits.idProduit', 'nom prixUnitaire') // populate seulement nom et prix
      .populate('fournisseur', 'name'); // populate infos du fournisseur
    res.status(200).json({ data: demandePrixs });
  } catch (error) {
    next(error);
  }
};




const updateDemandePrix = async (req, res, next) => {
  try {
    const updates = req.body; // Use all fields from body
    const { id } = req.params;

    console.log("Request body:", req.body);
    console.log("DemandePrix ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    // Optional: Prevent updating certain fields like _id
    delete updates._id;

    if (Object.keys(updates).length === 0) {
      return next(createHttpError(400, "No fields provided for update"));
    }

    const demandePrix = await DemandePrix.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!demandePrix) {
      const error = createHttpError(404, "DemandePrix not found!");
      return next(error);
    }

    res.status(200).json({ success: true, message: "DemandePrix updated", data: demandePrix });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const deleteDemandePrix = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid id!"));
    }

    const demandePrix = await DemandePrix.findByIdAndDelete(id);
    if (!demandePrix) {
      return next(createHttpError(404, "DemandePrix not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "DemandePrix deleted successfully" });
  } catch (error) {
    next(error);
  }
};


module.exports = { addDemandePrix, getDemandePrixById, getDemandePrixs, updateDemandePrix, deleteDemandePrix };
