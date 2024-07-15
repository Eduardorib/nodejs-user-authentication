const express = require("express");

const router = express.Router();

const {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
} = require("../controllers/userController");

const authJWT = require("../middleware/authJWT");
const { isAdmin, isModerator, isModeratorOrAdmin } = authJWT;

router.get("/all", allAccess); // Public Route
router.get("/user", userBoard); // Logged User Route
router.get("/admin", isAdmin, adminBoard); // Logged Admin Route
router.get("/moderator", isModerator, moderatorBoard); // Logged Moderator Route

module.exports = router;
