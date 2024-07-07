require("dotenv").config({ path: `${__dirname}/../.env` });

const { Sequelize, DataTypes } = require("sequelize");

const postgres = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
};

// Instantiating Sequelize with database URI
const sequelize = new Sequelize(
  `postgres://${postgres.user}:${postgres.password}@localhost:${postgres.port}/${postgres.database}`,
  { dialect: "postgres" }
);

// Authenticate on to database
sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected`);
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel")(sequelize, DataTypes);

module.exports = db;
