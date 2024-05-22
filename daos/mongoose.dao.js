const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

async function createProduct(product) {
  try {
    const newProduct = await Product.create(product);
    return newProduct;
  } catch (error) {
    throw new Error("Error creating product: " + error.message);
  }
}

async function getProducts() {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new Error("Error getting products: " + error.message);
  }
}

async function getProductById(id) {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw new Error("Error getting product by id: " + error.message);
  }
}

async function updateProduct(id, updatedFields) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    if (!updatedProduct) {
      throw new Error("Product not found");
    }
    return updatedProduct;
  } catch (error) {
    throw new Error("Error updating product: " + error.message);
  }
}

async function deleteProduct(id) {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new Error("Product not found");
    }
    return deletedProduct;
  } catch (error) {
    throw new Error("Error deleting product: " + error.message);
  }
}

async function createCart() {
  try {
    const newCart = await Cart.create({ products: [] });
    return newCart;
  } catch (error) {
    throw new Error("Error creating cart: " + error.message);
  }
}

async function getCartById(id) {
  try {
    const cart = await Cart.findById(id).populate("products.product");
    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  } catch (error) {
    throw new Error("Error getting cart by id: " + error.message);
  }
}

async function addProductToCart(cartId, productId) {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const existingProduct = cart.products.find(
      (p) => p.product.toString() === productId
    );
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error("Error adding product to cart: " + error.message);
  }
}

async function removeProductFromCart(cartId, productId) {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }
    cart.products.splice(productIndex, 1);
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error("Error removing product from cart: " + error.message);
  }
}

async function updateCart(cartId, updatedProducts) {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      { products: updatedProducts },
      { new: true, runValidators: true }
    );
    if (!updatedCart) {
      throw new Error("Cart not found");
    }
    return updatedCart;
  } catch (error) {
    throw new Error("Error updating cart: " + error.message);
  }
}
async function updateProductQuantity(cartId, productId, quantity) {
  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }
    cart.products[productIndex].quantity = quantity;
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error("Error updating product quantity: " + error.message);
  }
}

async function deleteCart(cartId) {
  try {
    const deletedCart = await Cart.findByIdAndDelete(cartId);
    if (!deletedCart) {
      throw new Error("Cart not found");
    }
    return deletedCart;
  } catch (error) {
    throw new Error("Error deleting cart: " + error.message);
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateCart,
  updateProductQuantity,
  deleteCart,
};
