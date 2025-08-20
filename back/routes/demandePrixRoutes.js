const express = require("express");
const { addDemandePrix, getDemandePrixs, getDemandePrixById, updateDemandePrix, deleteDemandePrix } = require("../controllers/demandePrixController");
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

router.post("/", protect(['admin', 'superadmin']), addDemandePrix);
router.get("/", protect(), getDemandePrixs);
router.get("/:id", protect(), getDemandePrixById);
router.put("/:id", protect(['admin', 'superadmin']), updateDemandePrix);
router.delete("/:id", protect(['admin', 'superadmin']), deleteDemandePrix);

module.exports = router;