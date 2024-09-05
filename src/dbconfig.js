require("dotenv").config();
module.exports = {
  dbName: process.env.MONGO_DBNAME,
  mongoUrl: process.env.MONGO_URL,
};
