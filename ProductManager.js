const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  addProduct(product) {
    try {
      const products = this.getProducts();
      const newProduct = {
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        ...product,
      };
      products.push(newProduct);
      fs.promises.writeFile(this.path, JSON.stringify(products));
      return newProduct;
    } catch (error) {
      throw new Error("Error adding product: " + error.message);
    }
  }

  getProducts() {
    try {
      const data = fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw new Error("Error reading products: " + error.message);
    }
  }

  getProductById(id) {
    try {
      const products = this.getProducts();
      return products.find((product) => product.id === id);
    } catch (error) {
      throw new Error("Error getting product by id: " + error.message);
    }
  }

  updateProduct(id, updatedFields) {
    try {
      let products = this.getProducts();
      const index = products.findIndex((product) => product.id === id);
      if (index === -1) {
        throw new Error("Product not found");
      }
      products[index] = { ...products[index], ...updatedFields };
      fs.promises.writeFile(this.path, JSON.stringify(products));
      return products[index];
    } catch (error) {
      throw new Error("Error updating product: " + error.message);
    }
  }

  deleteProduct(id) {
    try {
      let products = this.getProducts();
      products = products.filter((product) => product.id !== id);
      fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (error) {
      throw new Error("Error deleting product: " + error.message);
    }
  }
}

module.exports = ProductManager;
