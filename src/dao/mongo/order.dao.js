const OrderModel = require("./models/order.model");

class OrderDAO {
  async getOrders() {
    try {
      const orders = await OrderModel.find()
        .populate("business")
        .populate("user");
      return orders.map((o) => o.toObject());
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getOrderById(id) {
    try {
      const order = await OrderModel.findById(id)
        .populate("business")
        .populate("user");
      return order?.toObject() ?? null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async createOrder(order) {
    try {
      const savedOrder = await OrderModel.create(order);
      return savedOrder.toObject();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async resolveOrder(id, status) {
    try {
      const result = await OrderModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      return result?.toObject() ?? null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

module.exports = { OrderDAO };
