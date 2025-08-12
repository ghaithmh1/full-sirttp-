const express = require("express");
const { getSousTraitantByEntrepriseId,addSousTraitant, getSousTraitants, getSousTraitantById, updateSousTraitant, deleteSousTraitant } = require("../controllers/sousTraitantController");
const router = express.Router();

router.post("/", addSousTraitant);
router.get("/", getSousTraitants);
router.get('/entreprise/:entrepriseId', getSousTraitantByEntrepriseId);

router.get("/:id", getSousTraitantById);
router.put("/:id", updateSousTraitant);
router.delete("/:id", deleteSousTraitant);

module.exports = router;
