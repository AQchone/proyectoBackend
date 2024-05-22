const cartDao = require("../daos/mongoose.dao");

exports.createCart = async (req, res) => {
  try {
    const newCart = await cartDao.createCart();
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.getCartById(cid);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartDao.addProductToCart(cid, pid);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartDao.removeProductFromCart(cid, pid);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const updatedCart = await cartDao.updateCart(cid, products);
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartDao.updateProductQuantity(cid, pid, quantity);
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const deletedCart = await cartDao.deleteCart(cid);
    res.json({ status: "success", message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getCartView = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.getCartById(cid);
    res.render("cart", { cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
