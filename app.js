require("dotenv").config();
const express = require("express");
const sequelize = require("sequelize");
const cookieParser = require("cookie-parser");

const verifyToken = require("./middleware/authJWT");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const commonRoutes = require("./routes/commonRoutes");

const db = require("./models");

const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.static("./public"));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Routes
app.use("/api/users", authRoutes);
app.use("/api/test", verifyToken, commonRoutes);

app.use(errorHandler);
app.use(notFound);

const start = async () => {
  try {
    db.sequelize.sync({ force: false }).then(() => {
      console.log("db has been re sync");
    });

    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
