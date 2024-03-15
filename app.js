const express = require("express");
const ProductManager = require("./ProductManager");
const CartManager = require("./CartManager");
const app = express();
const handlebars = require("express-handlebars");
app.use(express.json());
const productManager = new ProductManager("products.json");
const cartManager = new CartManager("carts.json");
const productRouter = express.Router();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  const products = productManager.getProducts();
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

productRouter.get("/", (req, res) => {
  const limit = req.query.limit;
  const products = productManager.getProducts(limit);
  res.json(products);
});

productRouter.get("/:pid", (req, res) => {
  const id = req.params.pid;
  const product = productManager.getProduct(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

productRouter.post("/", (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } =
    req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newProduct = productManager.addProduct({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  });
  res.status(201).json(newProduct);
  io.emit("productAdded", newProduct);
});

productRouter.put("/:pid", (req, res) => {
  const id = req.params.pid;
  const updatedFields = req.body;
  const updatedProduct = productManager.updateProduct(id, updatedFields);
  if (!updatedProduct) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(updatedProduct);
});

productRouter.delete("/:pid", (req, res) => {
  const id = req.params.pid;
  const deletedProduct = productManager.deleteProduct(id);
  if (!deletedProduct) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ message: "Product deleted successfully" });
  io.emit("productRemoved", id);
});

app.use("/api/products", productRouter);

const cartRouter = express.Router();

cartRouter.post("/", (req, res) => {
  const newCart = cartManager.createCart();
  res.status(201).json(newCart);
});

cartRouter.get("/:cid", (req, res) => {
  const id = req.params.cid;
  const cart = cartManager.getCart(id);
  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }
  res.json(cart);
});

cartRouter.post("/:cid/product/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const updatedCart = cartManager.addProductToCart(cartId, productId);
  if (!updatedCart) {
    return res.status(404).json({ error: "Cart or product not found" });
  }
  res.json(updatedCart);
});

app.use("/api/carts", cartRouter);

const server = app.listen(8080, () => {
  console.log("Server listening on port 8080");
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
