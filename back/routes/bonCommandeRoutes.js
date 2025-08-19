const express = require("express");
const { addBonCommande, getBonCommandes, getBonCommandeById, updateBonCommande, deleteBonCommande } = require("../controllers/bonCommandeController");
const router = express.Router();

router.post("/", addBonCommande);
router.get("/", getBonCommandes);
router.get("/:id", getBonCommandeById);
router.put("/:id", updateBonCommande);
router.delete("/:id", deleteBonCommande);

module.exports = router;