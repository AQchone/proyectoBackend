const fs = require("fs");

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  createCart() {
    try {
      const carts = this.getCarts();
      const newCart = {
        id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
        products: [],
      };
      carts.push(newCart);
      fs.promises.writeFile(this.path, JSON.stringify(carts));
      return newCart;
    } catch (error) {
      throw new Error("Error creating cart: " + error.message);
    }
  }

  getCarts() {
    try {
      const data = fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw new Error("Error reading carts: " + error.message);
    }
  }

  getCart(id) {
    try {
      const carts = this.getCarts();
      return carts.find((cart) => cart.id === parseInt(id));
    } catch (error) {
      throw new Error("Error getting cart by id: " + error.message);
    }
  }

  addProductToCart(cartId, productId) {
    try {
      const carts = this.getCarts();
      const cart = carts.find((cart) => cart.id === parseInt(cartId));
      if (!cart) {
        throw new Error("Cart not found");
      }
      const product = cart.products.find(
        (p) => p.product === parseInt(productId)
      );

      if (product) {
        product.quantity++;
      } else {
        cart.products.push({ product: parseInt(productId), quantity: 1 });
      }
      fs.promises.writeFile(this.path, JSON.stringify(carts));
      return cart;
    } catch (error) {
      throw new Error("Error adding product to cart: " + error.message);
    }
  }
}

module.exports = CartManager;
