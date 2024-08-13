class SaveOrderResponse {
  constructor(order) {
    this.id = order._id.toString();
    this.number = order.number;
    this.totalPrice = order.totalPrice;
    this.status = order.status;
    this.business = order.business;
    this.user = order.user;
    this.products = order.products;
  }
}

module.exports = { SaveOrderResponse };
