const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

exports.createCart = async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    const product = await Product.findById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    const existingProduct = cart.products.find(
      (p) => p.product.toString() === pid
    );
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found in cart" });
    }
    cart.products.splice(productIndex, 1);
    await cart.save();
    res.json({ status: "success", message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const updatedCart = await Cart.findByIdAndUpdate(
      cid,
      { products },
      { new: true, runValidators: true }
    );
    if (!updatedCart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    res.json({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );
    if (productIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found in cart" });
    }
    cart.products[productIndex].quantity = quantity;
    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const deletedCart = await Cart.findByIdAndDelete(cid);
    if (!deletedCart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    res.json({ status: "success", message: "Cart deleted" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getCartView = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }
    res.render("cart", { cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
