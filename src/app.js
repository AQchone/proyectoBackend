const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const { mongoUri, dbName } = require("./config");
const { configureCustomResponses } = require("./controllers/utils");
const createBusinessRouter = require("./routes/business.router");
const createOrdersRouter = require("./routes/orders.router");
const createUsersRouter = require("./routes/users.router");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(configureCustomResponses);

const main = async () => {
  await mongoose.connect(mongoUri, { dbName });

  const routers = [
    { path: "/api/users", createRouter: createUsersRouter },
    { path: "/api/orders", createRouter: createOrdersRouter },
    { path: "/api/business", createRouter: createBusinessRouter },
  ];

  for (const { path, createRouter } of routers) {
    app.use(path, await createRouter());
  }

  const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
};

main();
