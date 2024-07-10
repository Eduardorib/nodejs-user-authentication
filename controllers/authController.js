const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");

const { createCustomError } = require("../errors/customError");
const asyncWrapper = require("../middleware/async");

require("dotenv").config({ path: `${__dirname}/../.env` });

const User = db.users;
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
      await user.setRoles([1]); // If don't provided, set role to "user"
    }

    let token = jwt.sign({ user }, process.env.secretKey, {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true });

    return res.status(201).json({ msg: "user created successfully", user });
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
      let token = jwt.sign({ user }, process.env.secretKey, {
        expiresIn: "1h",
      });

      res.cookie("token", token, { httpOnly: true });

      return res.status(201).json({ msg: "logged in successfully", user });
    } else {
      return next(createCustomError("invalid password", 404));
    }
  } else {
    return next(createCustomError("email not registered", 404));
  }
});

module.exports = {
  signup,
  login,
};
