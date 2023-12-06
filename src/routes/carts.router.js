import { Router } from "express";
import { cartsManager } from "../managers/cartsManager.js";

const router = new Router();

Router.get("/:idCart", async (req, res) => {
  const { idCart } = req.params;
  const cart = cartsManager.findCartById(idCart);

  if (!cart) {
    res.status(404).send({ error: "Cart not found" });
    return;
  }

  res.json({ cart });
});

Router.post("/:idCart/products/:idProduct", async (req, res) => {
  const { idCart, idProduct } = req.params;
  const cart = cartsManager.addProductToCart(idCart, idProduct);
  res.json({ cart });
});

Router.post("/", async (req, res) => {
  const cart = await cartsManager.createCart();
  res.json({ cart });
});

export default router;
