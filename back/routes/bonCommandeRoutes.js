const express = require("express");
const { addBonCommande, getBonCommandes, getBonCommandeById, updateBonCommande, deleteBonCommande } = require("../controllers/bonCommandeController");
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

router.post("/", protect(['admin', 'superadmin']) , addBonCommande);
router.get("/", protect() , getBonCommandes);
router.get("/:id", protect() , getBonCommandeById);
router.put("/:id", protect(['admin', 'superadmin']) , updateBonCommande);
router.delete("/:id", protect(['admin', 'superadmin']) , deleteBonCommande);

module.exports = router;