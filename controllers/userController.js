const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");

const { createCustomError } = require("../errors/customError");
const asyncWrapper = require("../middleware/async");

require("dotenv").config({ path: `${__dirname}/../.env` });

const User = db.users;

const signup = asyncWrapper(async (req, res, next) => {
  const { userName, email, password } = req.body;
  const data = {
    userName,
    email,
    password: await bcrypt.hash(password, 10),
  };

  const user = await User.create(data);

  if (user) {
    let token = jwt.sign({ id: user.id }, process.env.secretKey, {
      expiresIn: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });

    console.log("user", JSON.stringify(user, null, 2));
    console.log(token);

    return res.status(201).json({ user });
  } else {
    return next(createCustomError("Details are not correct", 409));
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
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);

      console.log(user);

      return res.status(201).json(user);
    } else {
      return next(
        createCustomError(
          JSON.parse({
            status: "error",
            statusCode: 401,
            error: {
              message: "Wrong password",
            },
          }),
          401
        )
      );
    }
  } else {
    return next(createCustomError("User not found", 404));
  }
});

module.exports = {
  signup,
  login,
};
