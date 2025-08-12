const asyncHandler = require("express-async-handler");
const Entreprise = require("../models/entrepriseModel");
const User = require("../models/userModel"); // Assure-toi que le chemin est correct

// Création d'une entreprise
// Création de l'entreprise
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
      users // un ID ou un tableau d'IDs
    } = req.body;

    // Vérifications simples
    if (!identifiantFiscal) return res.status(400).json({ message: "Identifiant fiscal requis" });
    if (!nom) return res.status(400).json({ message: "Nom requis" });
    if (!adresse) return res.status(400).json({ message: "Adresse requise" });
    if (!ville) return res.status(400).json({ message: "Ville requise" });
    if (!telephone) return res.status(400).json({ message: "Téléphone requis" });

    // Validation téléphone
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

    // Normaliser `users` pour qu'il soit toujours un tableau
    let usersArray = [];
    if (users) {
      if (Array.isArray(users)) {
        usersArray = users;
      } else {
        usersArray = [users]; // si un seul ID
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
      users: usersArray
    });

    await newEntreprise.save();

    // Changer le rôle en admin pour tous les users associés
    if (usersArray.length > 0) {
      await User.updateMany(
        { _id: { $in: usersArray } },
        { $set: { role: "admin" } }
      );
    }

    res.status(201).json({ message: "Entreprise créée avec succès", entreprise: newEntreprise });
  } catch (error) {
    console.error("Erreur création entreprise :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

