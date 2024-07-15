const jwt = require("jsonwebtoken");
const { createCustomError } = require("../errors/customError");

const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next(createCustomError("token not found", 401));

  try {
    jwt.verify(token, process.env.secretKey, (err, decoded) => {
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    res.clearCookie("token");
    return next(createCustomError("user not authenticated", 403));
  }
};

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  const roles = await user.getRoles();

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      next();
      return;
    }
  }

  res.status(403).send({
    message: "Require Admin Role!",
  });
  return;
};

const isModerator = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  const roles = await user.getRoles();

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "moderator") {
      next();
      return;
    }
  }

  res.status(403).send({
    message: "Require Moderator Role!",
  });
};

const isModeratorOrAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  const roles = await user.getRoles();

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "moderator") {
      next();
      return;
    }

    if (roles[i].name === "admin") {
      next();
      return;
    }
  }

  res.status(403).send({
    message: "Require Moderator or Admin Role!",
  });
};

module.exports = { verifyToken, isAdmin, isModerator, isModeratorOrAdmin };
