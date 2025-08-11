const asyncHandler = require("express-async-handler");
const Entreprise = require("../models/entrepriseModel");

// Création d'une entreprise
module.exports.create = asyncHandler(async (req, res) => {
  try {
    const {
      identifiantFiscal,
      nom,
      adresse,
      ville,
      codePostal,
      telephone,
      email,
      secteurActivite,
      dateCreation,
      description,
      taille,
      createdBy
    } = req.body;

    // Vérifications simples
    if (!identifiantFiscal) return res.status(400).json({ message: "Identifiant fiscal requis" });
    if (!nom) return res.status(400).json({ message: "Nom requis" });
    if (!adresse) return res.status(400).json({ message: "Adresse requise" });
    if (!ville) return res.status(400).json({ message: "Ville requise" });
    if (!telephone) return res.status(400).json({ message: "Téléphone requis" });

    // Validation téléphone : commence par 2,5 ou 9 + 7 chiffres (total 8 chiffres)
    const telRegex = /^[259]\d{7}$/;
    if (!telRegex.test(telephone)) {
      return res.status(400).json({ message: "Numéro de téléphone invalide" });
    }

    // Validation email (si fourni)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email invalide" });
      }
    }

    // Vérifier si entreprise avec ce numéro fiscal existe déjà
    const existing = await Entreprise.findOne({ identifiantFiscal });
    if (existing) {
      return res.status(400).json({ message: "Entreprise avec cet identifiant fiscal déjà existante" });
    }

    // Création de l'entreprise
    const newEntreprise = new Entreprise({
      identifiantFiscal,
      nom,
      adresse,
      ville,
      codePostal,
      telephone,
      email,
      secteurActivite,
      dateCreation: dateCreation || Date.now(),
      description,
      taille,
      createdBy,
    });

    await newEntreprise.save();

    res.status(201).json({ message: "Entreprise créée avec succès", entreprise: newEntreprise });
  } catch (error) {
    console.error("Erreur création entreprise :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
