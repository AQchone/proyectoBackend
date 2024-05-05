const express = require("express");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// MongoDB connection
mongoose.connect("mongodb://localhost/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handlebars setup
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
const productsRoutes = require("./routes/products.route");
const cartsRoutes = require("./routes/carts.route");
const viewsRoutes = require("./routes/views.route");

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/", viewsRoutes);

// Server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Socket.IO
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  // Add product event
  socket.on("addProduct", (product) => {
    // Add product logic here
    io.emit("productAdded", product);
  });

  // Delete product event
  socket.on("deleteProduct", (productId) => {
    // Delete product logic here
    io.emit("productRemoved", productId);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
