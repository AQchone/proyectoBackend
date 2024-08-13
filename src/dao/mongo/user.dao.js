const UserModel = require("./models/user.model");
const { logger } = require("../../utils/logger");

class UserDAO {
  async getUsers() {
    try {
      logger.debug("Attempting to fetch all users");
      const users = await UserModel.find();
      logger.info(`Retrieved ${users.length} users`);
      return users.map((u) => u.toObject());
    } catch (err) {
      logger.error("Error fetching users:", err);
      throw new Error("Failed to get users");
    }
  }

  async getUserById(id) {
    try {
      logger.debug(`Attempting to fetch user with id: ${id}`);
      const user = await UserModel.findById(id);
      if (user) {
        logger.info(`Retrieved user with id: ${id}`);
      } else {
        logger.warn(`No user found with id: ${id}`);
      }
      return user?.toObject() ?? null;
    } catch (err) {
      logger.error(`Error fetching user with id ${id}:`, err);
      throw new Error("Failed to get user by id");
    }
  }

  async saveUser(user) {
    try {
      logger.debug("Attempting to save new user", user);
      const savedUser = await UserModel.create(user);
      logger.info(`User saved successfully with id: ${savedUser._id}`);
      return savedUser.toObject();
    } catch (err) {
      logger.error("Error saving user:", err);
      throw new Error("Failed to save user");
    }
  }

  async updateUser(id, userData) {
    try {
      logger.debug(`Attempting to update user with id: ${id}`, userData);
      const result = await UserModel.findByIdAndUpdate(id, userData, {
        new: true,
      });
      if (result) {
        logger.info(`User updated successfully: ${id}`);
      } else {
        logger.warn(`No user found to update with id: ${id}`);
      }
      return result?.toObject() ?? null;
    } catch (err) {
      logger.error(`Error updating user with id ${id}:`, err);
      throw new Error("Failed to update user");
    }
  }

  async existUserWithEmail(email) {
    try {
      logger.debug(`Checking if user exists with email: ${email}`);
      const count = await UserModel.countDocuments({ email });
      logger.info(`User with email ${email} exists: ${count > 0}`);
      return count > 0;
    } catch (err) {
      logger.error(`Error checking user existence with email ${email}:`, err);
      throw new Error("Failed to check user existence");
    }
  }

  async addOrderToUser(userId, orderId) {
    try {
      logger.debug(`Attempting to add order ${orderId} to user ${userId}`);
      const result = await UserModel.findByIdAndUpdate(
        userId,
        { $push: { orders: orderId } },
        { new: true }
      );
      if (result) {
        logger.info(`Order ${orderId} added successfully to user ${userId}`);
      } else {
        logger.warn(`No user found to add order with id: ${userId}`);
      }
      return result?.toObject() ?? null;
    } catch (err) {
      logger.error(`Error adding order ${orderId} to user ${userId}:`, err);
      throw new Error("Failed to add order to user");
    }
  }
}

module.exports = { UserDAO };
