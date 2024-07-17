const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const { createCustomError } = require("../errors/customError");
const asyncWrapper = require("../middleware/async");

require("dotenv").config({ path: `${__dirname}/../.env` });

const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const signup = asyncWrapper(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const data = {
    userName,
    email,
    password: await bcrypt.hash(password, 10), // Hash password string with salt length of 10
  };

  const user = await User.create(data);

  if (user) {
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      await user.setRoles(roles); // Set roles provided in body
    } else {
      await user.setRoles([1]); // If don't provided, set role "user"
    }

    let token = jwt.sign({ id: user.id }, process.env.secretKey, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true });

    return res.status(201).json({
      msg: "user created successfully",
      user: {
        id: user.id,
        username: user.userName,
        email: user.email,
        accessToken: token,
      },
    });
  } else {
    return next(createCustomError("details are not correct", 409));
  }
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (user) {
    const isSame = await bcrypt.compare(password, user.password);

    if (isSame) {
      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: "1h",
      });

      const userRoles = await user.getRoles();

      let rolesArr = [];

      for (let i = 0; i < userRoles.length; i++) {
        rolesArr.push("ROLE_" + userRoles[i].name.toUpperCase());
      }

      res.cookie("token", token, { httpOnly: true });

      return res.status(201).json({
        msg: "logged in successfully",
        user: {
          id: user.id,
          username: user.userName,
          email: user.email,
          roles: rolesArr,
          accessToken: token,
        },
      });
    } else {
      return next(createCustomError("Invalid password", 404));
    }
  } else {
    return next(createCustomError("Email not found", 404));
  }
});

const forgotPassword = asyncWrapper(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (user) {
    const token = crypto.randomBytes(20).toString("hex");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAILRECOVERY,
        pass: process.env.EMAILRECOVERYPASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAILRECOVERY,
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return next(createCustomError("Error sending email", 500));
      } else {
        console.log(`Email sent: ${info.response}`);
        res
          .status(200)
          .send(
            "Check your email for instructions on resetting your password."
          );
      }
    });
  } else {
    return next(createCustomError("Email not found", 404));
  }
});

module.exports = {
  signup,
  login,
  forgotPassword,
};
