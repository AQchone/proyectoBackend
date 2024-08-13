const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("express-compression");
const { mongoUri, dbName } = require("./config");
const { configureCustomResponses } = require("./controllers/utils");
const createBusinessRouter = require("./routes/business.router");
const createOrdersRouter = require("./routes/orders.router");
const createUsersRouter = require("./routes/users.router");
const { useLogger, logger } = require("./utils/logger");
const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(configureCustomResponses);
app.use(useLogger);

const main = async () => {
  try {
    await mongoose.connect(mongoUri, { dbName });
    logger.info("Connected to MongoDB");

    const routers = [
      { path: "/api/users", createRouter: createUsersRouter },
      { path: "/api/orders", createRouter: createOrdersRouter },
      { path: "/api/business", createRouter: createBusinessRouter },
    ];

    for (const { path, createRouter } of routers) {
      app.use(path, await createRouter());
    }

    const port = process.env.PORT || 8080;

    app.listen(port, () => {
      logger.info(`Server listening on ${port}`);
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

main();
