const { Router } = require("express");
const {
  getBusiness,
  getBusinessById,
  createBusiness,
  addProduct,
} = require("../controllers/business.controller");

module.exports = () => {
  const router = Router();

  router.get("/", getBusiness);
  router.get("/:id", getBusinessById);
  router.post("/", createBusiness);
  router.post("/:id/products", addProduct);

  return router;
};
