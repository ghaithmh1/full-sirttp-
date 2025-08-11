const express = require("express");
const { addFournisseur, getFournisseurs, getFournisseurById, updateFournisseur, deleteFournisseur } = require("../controllers/fournisseurController");
const router = express.Router();

router.post("/", addFournisseur);
router.get("/", getFournisseurs);
router.get("/:id", getFournisseurById);
router.put("/:id", updateFournisseur);
router.delete("/:id", deleteFournisseur);

module.exports = router;
