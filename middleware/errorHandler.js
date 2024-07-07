const { CustomAPIError } = require("../errors/customError");
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err instanceof CustomAPIError) {
    return res
      .status(err.statusCode)
      .json({ statusCode: err.statusCode, msg: err.message });
  }
  return res
    .status(500)
    .json({ msg: "Something went wrong, please try again" });
};

module.exports = errorHandlerMiddleware;
