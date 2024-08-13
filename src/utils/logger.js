const winston = require("winston");
const path = require("path");

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const colors = {
  fatal: "red",
  error: "red",
  warning: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: path.join(__dirname, "..", "logs", "errors.log"),
    level: "error",
  }),
];

const devLogger = winston.createLogger({
  levels,
  format,
  transports,
});

const prodLogger = winston.createLogger({
  levels,
  format,
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({
      filename: path.join(__dirname, "..", "logs", "errors.log"),
      level: "error",
    }),
  ],
});

const logger = process.env.NODE_ENV === "production" ? prodLogger : devLogger;

const loggerTest = winston.createLogger({
  levels,
  format,
  transports: [
    new winston.transports.Console({ level: "debug" }),
    new winston.transports.File({
      filename: path.join(__dirname, "..", "logs", "test.log"),
      level: "debug",
    }),
  ],
});

/**
 * @type {import("express").RequestHandler}
 */
const useLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(`Request to endpoint: ${req.method} ${req.url}`);
  next();
};

module.exports = { useLogger, logger, loggerTest };
