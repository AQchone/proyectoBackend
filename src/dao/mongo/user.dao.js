const UserModel = require("./models/user.model");

class UserDAO {
  async getUsers() {
    try {
      const users = await UserModel.find();
      return users.map((u) => u.toObject());
    } catch (err) {
      console.error(err);
      throw new Error("Failed to get users");
    }
  }

  async getUserById(id) {
    try {
      const user = await UserModel.findById(id);
      return user?.toObject() ?? null;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to get user by id");
    }
  }

  async saveUser(user) {
    try {
      const savedUser = await UserModel.create(user);
      return savedUser.toObject();
    } catch (err) {
      console.error(err);
      throw new Error("Failed to save user");
    }
  }

  async updateUser(id, userData) {
    try {
      const result = await UserModel.findByIdAndUpdate(id, userData, {
        new: true,
      });
      return result?.toObject() ?? null;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to update user");
    }
  }

  async existUserWithEmail(email) {
    try {
      const count = await UserModel.countDocuments({ email });
      return count > 0;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to check user existence");
    }
  }

  async addOrderToUser(userId, orderId) {
    try {
      const result = await UserModel.findByIdAndUpdate(
        userId,
        { $push: { orders: orderId } },
        { new: true }
      );
      return result?.toObject() ?? null;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to add order to user");
    }
  }
}

module.exports = { UserDAO };
