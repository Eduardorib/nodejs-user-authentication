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

db.user = require("./userModel")(sequelize, DataTypes);
db.role = require("./roleModel")(sequelize, DataTypes);

db.role.belongsToMany(db.user, {
  through: "user_roles",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
