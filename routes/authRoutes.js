const express = require("express");
const authController = require("../controllers/authController");
const { signup, login, forgotPassword } = authController;
const userAuth = require("../middleware/userAuth");

const router = express.Router();

router.post("/signup", userAuth.saveUser, signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

module.exports = router;
