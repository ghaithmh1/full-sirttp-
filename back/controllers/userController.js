const crypto = require("crypto");
require("dotenv").config();
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const algorithm = "aes-256-cbc";

// Crypter mot de passe
function encrypt(text) {
  const KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const IV = Buffer.from(process.env.ENCRYPTION_IV, "hex");
  const cipher = crypto.createCipheriv(algorithm, KEY, IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Décrypter mot de passe
function decrypt(encryptedText) {
  const KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const IV = Buffer.from(process.env.ENCRYPTION_IV, "hex");
  const decipher = crypto.createDecipheriv(algorithm, KEY, IV);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports.register = asyncHandler(async (req, res) => {
  try {
    const { nom, prenom, email, pwd, num } = req.body;

    if (!nom) return res.status(400).json({ message: "Vérifier votre nom" });
    if (!prenom) return res.status(400).json({ message: "Vérifier votre prénom" });

    // Vérifier email valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }

    if (!pwd) return res.status(400).json({ message: "Vérifier votre mot de passe" });

    // Vérifier numéro : commence par 2, 5 ou 9 et fait 8 chiffres
    const numRegex = /^[259]\d{7}$/;
    if (!num || !numRegex.test(num)) {
      return res.status(400).json({ message: "Numéro invalide (8 chiffres et commence par 2, 5 ou 9)" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const newpass = encrypt(pwd);
    const newuser = new User({
      nom,
      prenom,
      email,
      num,
      pwd: newpass,
    });

    await newuser.save();

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      _id: newuser._id,
      email,
    });
  } catch (err) {
    console.error("Erreur inscription :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
module.exports.login = asyncHandler(async (req, res) => {
  const { email, pwd } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Vérifier email valide
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Email invalide" });
  }

  // Vérifier mot de passe présent
  if (!pwd) {
    return res.status(400).json({ message: "Vérifier votre mot de passe" });
  }

  // Chercher l'utilisateur
  const userExiste = await User.findOne({ email });
  if (!userExiste) {
    return res.status(400).json({ message: "Utilisateur non trouvé" });
  }

  // Vérifier mot de passe
  const cryptedpass = encrypt(pwd);
  if (cryptedpass !== userExiste.pwd) {
    return res.status(400).json({ message: "Mot de passe incorrect" });
  }

  // Réponse OK
  return res.status(200).json({
    _id: userExiste._id,
    email: userExiste.email,
    token: userExiste.generateAuthToken(),
    role: userExiste.role,
  });
});
