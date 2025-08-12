const express =require("express");
const router =express.Router();
const{
register,
login,
checkEmail
}=require("../controllers/userController.js");
router.post("/register",register);
router.post("/login",login);
router.post("/checkEmail",checkEmail);
module.exports = router;
