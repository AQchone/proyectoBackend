const { User } = require("../dao");
const { SaveUserResponse } = require("../dto/responses/SaveUserResponse");
const { UsersService } = require("../services/users.service");
const { logger } = require("../utils/logger");
const userDAO = new User();
const service = new UsersService(userDAO);

module.exports = {
  getUsers: async (req, res) => {
    try {
      logger.debug("Attempting to retrieve all users");
      const users = await userDAO.getUsers();
      if (!users || users.length === 0) {
        logger.info("No users found");
        return res.sendError("No users found", 404);
      }
      logger.info(`Retrieved ${users.length} users`);
      res.sendSuccess(users);
    } catch (error) {
      logger.error("Error in getUsers:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  getUserById: async (req, res) => {
    try {
      const id = req.params.id;
      logger.debug(`Attempting to get user with id: ${id}`);
      const user = await userDAO.getUserById(id);
      if (!user) {
        logger.info(`User with id ${id} not found`);
        return res.sendError("User not found", 404);
      }
      logger.info(`Retrieved user with id ${id}`);
      res.sendSuccess(user);
    } catch (error) {
      logger.error(`Error in getUserById for id ${req.params.id}:`, error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  saveUser: async (req, res) => {
    try {
      const userData = req.body;
      if (!userData || Object.keys(userData).length === 0) {
        logger.warn("Attempt to save user with invalid data");
        return res.sendError("Invalid user data", 400);
      }
      logger.debug("Attempting to create new user", userData);
      const user = await service.createUser(userData);
      if (!user) {
        logger.warn("Failed to save user");
        return res.sendError("Failed to save user", 500);
      }
      logger.info("New user created successfully", { userId: user._id });
      res.sendSuccess(new SaveUserResponse(user));
    } catch (error) {
      logger.error("Error in saveUser:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },
};
