const express = require("express");
const { logger } = require("../utils/logger");

/**
 * @type {express.RequestHandler}
 */
const configureCustomResponses = (req, res, next) => {
  res.sendSuccess = (payload, code = 200) => {
    logger.http(`Success response sent: ${code}`);
    return res.status(code).json({ status: "success", payload });
  };
  res.sendError = (payload, code = 500) => {
    logger.http(`Error response sent: ${code}`);
    return res.status(code).json({ status: "error", payload });
  };
  next();
};

module.exports = { configureCustomResponses };
