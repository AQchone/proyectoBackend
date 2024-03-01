const express = require("express");

const ProductManager = require("./ProductManager");

const productManager = new ProductManager("products.json");

const app = express();

app.get("/products", (req, res) => {
  const limit = req.query.limit;

  const products = productManager.getProducts(limit);

  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const id = req.params.id;

  const product = productManager.getProduct(id);

  res.json(product);
});

app.listen(3000);
