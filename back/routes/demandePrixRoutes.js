const express = require("express");
const { addDemandePrix, getDemandePrixs, getDemandePrixById, updateDemandePrix, deleteDemandePrix } = require("../controllers/demandePrixController");
const router = express.Router();

router.post("/", addDemandePrix);
router.get("/", getDemandePrixs);
router.get("/:id", getDemandePrixById);
router.put("/:id", updateDemandePrix);
router.delete("/:id", deleteDemandePrix);

module.exports = router;