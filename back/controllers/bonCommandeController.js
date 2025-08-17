const createHttpError = require("http-errors");
const BonCommande = require("../models/bonCommandeModel");
const { default: mongoose } = require("mongoose");

const addBonCommande = async (req, res, next) => {
  try {
    const bonCommande = new BonCommande(req.body);
    await bonCommande.save();
    res
      .status(201)
      .json({ success: true, message: "BonCommande created!", data: bonCommande });
  } catch (error) {
    next(error);
  }
};

const getBonCommandeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const bonCommande = await BonCommande.findById(id);
    if (!bonCommande) {
      const error = createHttpError(404, "BonCommande not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: bonCommande });
  } catch (error) {
    next(error);
  }
};


const getBonCommandes = async (req, res, next) => {
  try {
    const bonCommandes = await BonCommande.find()
      .populate('listeProduits.idProduit', 'nom')
      .populate('fournisseur', 'name')
      .populate('client', 'name'); // ajout pour type=vente
    res.status(200).json({ data: bonCommandes });
  } catch (error) {
    next(error);
  }
};


const updateBonCommande = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log("BonCommande ID:", id);
    console.log("Request body:", updates);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid id!"));
    }

    const bonCommande = await BonCommande.findById(id);
    if (!bonCommande) {
      return next(createHttpError(404, "BonCommande not found!"));
    }

    // Mettre à jour uniquement les champs envoyés
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        bonCommande[key] = value;
      }
    });

    // Sauvegarder avec validations
    await bonCommande.save();

    res.status(200).json({
      success: true,
      message: "BonCommande updated",
      data: bonCommande
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};


const deleteBonCommande = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(404, "Invalid id!"));
    }

    const bonCommande = await BonCommande.findByIdAndDelete(id);
    if (!bonCommande) {
      return next(createHttpError(404, "BonCommande not found!"));
    }

    res
      .status(200)
      .json({ success: true, message: "BonCommande deleted successfully" });
  } catch (error) {
    next(error);
  }
};


module.exports = { addBonCommande, getBonCommandeById, getBonCommandes, updateBonCommande, deleteBonCommande };
