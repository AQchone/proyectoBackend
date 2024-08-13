class SaveBusinessResponse {
  constructor(business) {
    this.id = business._id.toString();
    this.name = business.name;
    this.address = business.address;
    this.products = business.products;
  }
}

module.exports = { SaveBusinessResponse };
