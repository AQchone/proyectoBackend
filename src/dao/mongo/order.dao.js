const OrderModel = require("./models/order.model");
const { logger } = require("../../utils/logger");

class OrderDAO {
  async getOrders() {
    try {
      logger.debug("Attempting to fetch all orders");
      const orders = await OrderModel.find()
        .populate("business")
        .populate("user");
      logger.info(`Retrieved ${orders.length} orders`);
      return orders.map((o) => o.toObject());
    } catch (err) {
      logger.error("Error fetching orders:", err);
      return null;
    }
  }

  async getOrderById(id) {
    try {
      logger.debug(`Attempting to fetch order with id: ${id}`);
      const order = await OrderModel.findById(id)
        .populate("business")
        .populate("user");
      if (order) {
        logger.info(`Retrieved order with id: ${id}`);
      } else {
        logger.warn(`No order found with id: ${id}`);
      }
      return order?.toObject() ?? null;
    } catch (err) {
      logger.error(`Error fetching order with id ${id}:`, err);
      return null;
    }
  }

  async createOrder(order) {
    try {
      logger.debug("Attempting to create new order", order);
      const savedOrder = await OrderModel.create(order);
      logger.info(`Order created successfully with id: ${savedOrder._id}`);
      return savedOrder.toObject();
    } catch (err) {
      logger.error("Error creating order:", err);
      return null;
    }
  }

  async resolveOrder(id, status) {
    try {
      logger.debug(
        `Attempting to resolve order with id: ${id}, new status: ${status}`
      );
      const result = await OrderModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (result) {
        logger.info(
          `Order resolved successfully: ${id}, new status: ${status}`
        );
      } else {
        logger.warn(`No order found to resolve with id: ${id}`);
      }
      return result?.toObject() ?? null;
    } catch (err) {
      logger.error(`Error resolving order with id ${id}:`, err);
      return null;
    }
  }
}

module.exports = { OrderDAO };
