const express = require("express");
const db = require("../models");

const ROLES = db.ROLES;
const User = db.users;

// Check if username or email already exist in the database
const saveUser = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: {
        userName: req.body.userName,
      },
    });

    if (username) {
      return res.status(409).json({ msg: "username already taken" });
    }

    const emailcheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (emailcheck) {
      return res.status(409).json({ msg: "email already registered" });
    }

    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).json({
            msg: "Failed! Role does not exist = " + req.body.roles[i],
          });
          return;
        }
      }
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  saveUser,
};
