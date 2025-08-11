const express =require("express");
const router =express.Router();
const{

create
}=require("../controllers/entrepriseController.js");
router.post("/create",create);

module.exports = router;
