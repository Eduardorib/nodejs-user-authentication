const express = require("express");

const router = express.Router();

const {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
} = require("../controllers/userController");

router.get("/all", allAccess); // Public Route
router.get("/user", userBoard); // Logged User Route
router.get("/admin", adminBoard); // Logged Admin Route
router.get("/moderator", moderatorBoard); // Logged Moderator Route

module.exports = router;
