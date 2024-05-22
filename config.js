require("dotenv").config();

const config = {
  mongoURI: process.env.MONGO_URI || "mongodb://localhost/ecommerce",
  port: process.env.PORT || 8080,
};

module.exports = config;
