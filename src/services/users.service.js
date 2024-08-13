class UsersService {
  constructor(dao) {
    this.dao = dao;
  }

  async createUser(userData) {
    const { name, email, role } = userData;
    const hasInvalidNameOrEmail =
      ["", null, undefined].includes(name) ||
      ["", null, undefined].includes(email) ||
      typeof name !== "string" ||
      typeof email !== "string";

    if (hasInvalidNameOrEmail) {
      return null;
    }

    const hasRepeatedEmail = await this.dao.existUserWithEmail(email);
    if (hasRepeatedEmail) {
      return null;
    }

    const hasInvalidRole = !["user", "admin"].includes(role);
    if (hasInvalidRole) {
      return null;
    }

    const user = await this.dao.saveUser(userData);
    return user;
  }
}

module.exports = { UsersService };
