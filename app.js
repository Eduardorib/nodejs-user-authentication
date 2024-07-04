require("dotenv").config();
const express = require("express");
const sequelize = require("sequelize");
const cookieParser = require("cookie-parser");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const userRoutes = require("./routes/userRoutes");

const db = require("./models");

const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);

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
