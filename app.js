const express = require("express");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const passport = require("./auth");
const Product = require("./models/product.model");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const productsRoutes = require("./routes/products.route");
const cartsRoutes = require("./routes/carts.route");
const viewsRoutes = require("./routes/views.route");
const authRoutes = require("./routes/auth.route");
const sessionsRoutes = require("./routes/sessions.route");

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/", viewsRoutes);
app.use("/auth", authRoutes);
app.use("/api/sessions", sessionsRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("addProduct", async (product) => {
    try {
      const newProduct = await Product.create(product);
      io.emit("productAdded", newProduct);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  });

  socket.on("deleteProduct", async (productId) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (deletedProduct) {
        io.emit("productRemoved", deletedProduct);
      } else {
        console.error("Product not found");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
