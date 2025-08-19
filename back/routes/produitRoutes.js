const express = require("express");
const { addProduit, getProduits, getProduitById, updateProduit, deleteProduit } = require("../controllers/produitController");
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

router.post("/", protect(['admin', 'superadmin']), addProduit);
router.get("/", protect(), getProduits);
router.get("/:id", protect(), getProduitById);
router.put("/:id", protect(['admin', 'superadmin']), updateProduit);
router.delete("/:id", protect(['admin', 'superadmin']), deleteProduit);

module.exports = router;