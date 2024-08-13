const { Order, User, Business } = require("../dao");
const { SaveOrderResponse } = require("../dto/responses/SaveOrderResponse");
const { OrdersService } = require("../services/orders.service");
const { logger } = require("../utils/logger");

const orderDAO = new Order();
const userDAO = new User();
const businessDAO = new Business();
const ordersService = new OrdersService(orderDAO, userDAO, businessDAO);

module.exports = {
  getOrders: async (req, res) => {
    try {
      logger.debug("Attempting to retrieve all orders");
      const orders = await orderDAO.getOrders();
      if (!orders) {
        logger.info("Failed to retrieve orders");
        return res.sendError("Failed to retrieve orders");
      }
      logger.info(`Retrieved ${orders.length} orders`);
      res.sendSuccess(orders.map((o) => new SaveOrderResponse(o)));
    } catch (error) {
      logger.error("Error in getOrders:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  getOrderById: async (req, res) => {
    try {
      const id = req.params.id;
      logger.debug(`Attempting to get order with id: ${id}`);
      const order = await orderDAO.getOrderById(id);
      if (!order) {
        logger.info(`Order with id ${id} not found`);
        return res.sendError("Order not found", 404);
      }
      logger.info(`Retrieved order with id ${id}`);
      res.sendSuccess(new SaveOrderResponse(order));
    } catch (error) {
      logger.error(`Error in getOrderById for id ${req.params.id}:`, error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  createOrder: async (req, res) => {
    try {
      const orderData = req.body;
      logger.debug("Attempting to create new order", orderData);
      const order = await ordersService.createOrder(orderData);
      if (!order) {
        logger.warn("Failed to create order");
        return res.sendError("Failed to create order");
      }
      logger.info("New order created successfully", { orderId: order._id });
      return res.sendSuccess(new SaveOrderResponse(order));
    } catch (error) {
      logger.error("Error in createOrder:", error);
      return res.sendError("An unexpected error occurred", 500);
    }
  },

  resolveOrder: async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      logger.debug(`Attempting to resolve order ${id} with status: ${status}`);
      const result = await ordersService.resolveOrder(id, status);
      if (!result) {
        logger.warn(`Failed to resolve order ${id}`);
        return res.sendError("Failed to resolve order", 500);
      }
      logger.info(`Order ${id} resolved successfully with status: ${status}`);
      res.sendSuccess({ message: "Order resolved successfully", status });
    } catch (error) {
      logger.error(`Error in resolveOrder for order ${req.params.id}:`, error);
      res.sendError("An unexpected error occurred", 500);
    }
  },
};
