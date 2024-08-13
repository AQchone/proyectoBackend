const { Order, User, Business } = require("../dao");
const { SaveOrderResponse } = require("../dto/responses/SaveOrderResponse");
const { OrdersService } = require("../services/orders.service");

const orderDAO = new Order();
const userDAO = new User();
const businessDAO = new Business();
const ordersService = new OrdersService(orderDAO, userDAO, businessDAO);

module.exports = {
  getOrders: async (_, res) => {
    try {
      const orders = await orderDAO.getOrders();
      if (!orders) {
        return res.sendError("Failed to retrieve orders");
      }
      res.sendSuccess(orders.map((o) => new SaveOrderResponse(o)));
    } catch (error) {
      console.error("Error in getOrders:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  getOrderById: async (req, res) => {
    try {
      const id = req.params.id;
      const order = await orderDAO.getOrderById(id);
      if (!order) {
        return res.sendError("Order not found", 404);
      }
      res.sendSuccess(new SaveOrderResponse(order));
    } catch (error) {
      console.error("Error in getOrderById:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  createOrder: async (req, res) => {
    try {
      const orderData = req.body;
      const order = await ordersService.createOrder(orderData);
      if (!order) {
        return res.sendError("Failed to create order");
      }
      return res.sendSuccess(new SaveOrderResponse(order));
    } catch (error) {
      console.error("Error in createOrder:", error);
      return res.sendError("An unexpected error occurred", 500);
    }
  },

  resolveOrder: async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const result = await ordersService.resolveOrder(id, status);
      if (!result) {
        return res.sendError("Failed to resolve order", 500);
      }
      res.sendSuccess({ message: "Order resolved successfully", status });
    } catch (error) {
      console.error("Error in resolveOrder:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },
};
