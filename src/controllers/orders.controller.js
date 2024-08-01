const { Order, User, Business } = require("../dao");

const orderDAO = new Order();
const userDAO = new User();
const businessDAO = new Business();

module.exports = {
  getOrders: async (_, res) => {
    try {
      const orders = await orderDAO.getOrders();
      if (!orders) {
        return res.sendError("Failed to retrieve orders");
      }
      res.sendSuccess(orders);
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
      res.sendSuccess(order);
    } catch (error) {
      console.error("Error in getOrderById:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },

  createOrder: async (req, res) => {
    try {
      const { user, business, products } = req.body;
      const userObject = await userDAO.getUserById(user);
      const businessObject = await businessDAO.getBusinessById(business);

      if (!businessObject) {
        return res.sendError("Business not found", 404);
      }

      if (!businessObject.products || !Array.isArray(businessObject.products)) {
        return res.sendError("Invalid business data", 400);
      }

      const productsInBusiness = businessObject.products.filter((p) =>
        products.includes(p.id)
      );

      if (productsInBusiness.length === 0) {
        return res.sendError("No valid products found for this business", 400);
      }

      const totalPrice = productsInBusiness.reduce(
        (acc, p) => acc + p.price,
        0
      );

      const order = await orderDAO.createOrder({
        number: Date.now(),
        totalPrice,
        products: productsInBusiness,
        status: "pending",
        business,
        user,
      });

      if (!order) {
        return res.sendError("Failed to create order");
      }

      const userOrders = userObject.orders || [];
      userOrders.push(order._id);
      await userDAO.updateUser(user, { orders: userOrders });

      return res.sendSuccess(order);
    } catch (error) {
      console.error("Error in createOrder:", error);
      return res.sendError("An unexpected error occurred", 500);
    }
  },

  resolveOrder: async (req, res) => {
    try {
      res.sendSuccess({ message: "Order resolved successfully" });
    } catch (error) {
      console.error("Error in resolveOrder:", error);
      res.sendError("An unexpected error occurred", 500);
    }
  },
};
