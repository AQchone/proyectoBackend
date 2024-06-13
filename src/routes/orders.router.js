const { Router } = require("express");
const {
  getOrders,
  getOrderById,
  createOrder,
  resolveOrder,
} = require("../controllers/orders.controller");

module.exports = async () => {
  const router = Router();

  router.get("/", getOrders);
  router.get("/:id", getOrderById);
  router.post("/", createOrder);
  router.put("/:id", resolveOrder);

  return router;
};
