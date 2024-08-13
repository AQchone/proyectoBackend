const { User } = require("../dao");
const { SaveUserResponse } = require("../dto/responses/SaveUserResponse");
const userDAO = new User();
const { UsersService } = require("../services/users.service");
const service = new UsersService(userDAO);

module.exports = {
  getUsers: async (_, res) => {
    try {
      const users = await userDAO.getUsers();
      if (!users || users.length === 0) {
        return res.sendError("No users found", 404);
      }
      res.sendSuccess(users);
    } catch (error) {
      console.error("Error in getUsers:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  getUserById: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userDAO.getUserById(id);
      if (!user) {
        return res.sendError("User not found", 404);
      }
      res.sendSuccess(user);
    } catch (error) {
      console.error("Error in getUserById:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  saveUser: async (req, res) => {
    try {
      const userData = req.body;
      const user = await service.createUser(userData);
      if (!userData || Object.keys(userData).length === 0) {
        return res.sendError("Invalid user data", 400);
      }
      if (!user) {
        return res.sendError("Failed to save user", 500);
      }
      res.sendSuccess(new SaveUserResponse(user));
    } catch (error) {
      console.error("Error in saveUser:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },
};
