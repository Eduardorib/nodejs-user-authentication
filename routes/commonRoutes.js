const express = require("express");

const router = express.Router();

const { allAccess, userBoard } = require("../controllers/userController");

router.get("/all", allAccess); // Public Route
router.get("/user", userBoard); // Logged User Route

module.exports = router;
