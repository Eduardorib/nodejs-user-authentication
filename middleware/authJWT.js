const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next(createCustomError("token not found", 401));

  try {
    const user = jwt.verify(token, process.env.secretKey);
    req.user = user;
    next();
  } catch (error) {
    res.clearCookie("token");
    return next(createCustomError("user not authenticated", 403));
  }
};

module.exports = verifyToken;
