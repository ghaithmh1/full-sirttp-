const express = require("express");
const { addSousTraitant, getSousTraitants, getSousTraitantById, updateSousTraitant, deleteSousTraitant } = require("../controllers/sousTraitantController");
const router = express.Router();

router.post("/", addSousTraitant);
router.get("/", getSousTraitants);
router.get("/:id", getSousTraitantById);
router.put("/:id", updateSousTraitant);
router.delete("/:id", deleteSousTraitant);

module.exports = router;
