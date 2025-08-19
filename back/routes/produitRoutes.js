const express = require("express");
const { addProduit, getProduits, getProduitById, updateProduit, deleteProduit } = require("../controllers/produitController");
const router = express.Router();

router.post("/", addProduit);
router.get("/", getProduits);
router.get("/:id", getProduitById);
router.put("/:id", updateProduit);
router.delete("/:id", deleteProduit);

module.exports = router;