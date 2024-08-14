const cluster = require("cluster");
const os = require("os");
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
const { exec } = require("child_process");

const numCPUs = os.cpus().length;

function countNodeProcesses() {
  exec(
    'tasklist /fi "imagename eq node.exe" /fo csv /nh',
    (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error al ejecutar el comando: ${error}`);
        return;
      }
      const processCount = stdout.trim().split("\n").length;
      logger.info(`Número de procesos node.exe: ${processCount}`);
    }
  );
}

if (cluster.isMaster) {
  logger.info(`Master ${process.pid} is running`);

  const workers = new Set();

  function forkWorker() {
    const worker = cluster.fork();
    workers.add(worker);
    return worker;
  }

  for (let i = 0; i < numCPUs; i++) {
    forkWorker();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.warn(
      `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    );
    workers.delete(worker);

    const newWorker = forkWorker();
    logger.info(`New worker ${newWorker.process.pid} started`);
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception in master process:", error);
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection in master process:", reason);
  });

  setInterval(() => {
    logger.info(`Active workers: ${workers.size}`);
    countNodeProcesses();
  }, 60000);
} else {
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
      logger.info(`Worker ${process.pid} connected to MongoDB`);

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
        logger.info(`Worker ${process.pid} listening on ${port}`);
      });
    } catch (error) {
      logger.error(`Worker ${process.pid} failed to connect to MongoDB`, error);
      process.exit(1);
    }
  };

  main();

  process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception in worker ${process.pid}:`, error);
    process.exit(1);
  });

  process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled Rejection in worker ${process.pid}:`, reason);
    process.exit(1);
  });
}
