const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const cartController = require("../controllers/cart.controller");

router.get("/products", productController.getProductsView);
router.get("/carts/:cid", cartController.getCartView);

module.exports = router;
