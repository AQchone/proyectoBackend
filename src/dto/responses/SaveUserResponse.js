class SaveUserResponse {
  constructor(user) {
    this.id = user._id.toString();
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
  }
}
module.exports = { SaveUserResponse };
