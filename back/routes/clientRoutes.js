const express = require("express");
const { addClient, getClients, getClientById, updateClient, deleteClient } = require("../controllers/clientController");
const router = express.Router();

router.post("/", addClient);
router.get("/", getClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

module.exports = router;
