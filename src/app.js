const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const initializeStrategy = require("./config/passport.config");
const { dbName, mongoUrl } = require("./dbconfig");
const sessionMiddleware = require("./session/mongoStorage");
const {
  productsRouter,
  productsViewsRouter,
  cartRouter,
  cartViewsRouter,
  createProductRouter,
  sessionRouter,
  sessionViewsRouter,
  loggerTestRouter,
  mockingProductRouter,
} = require("./routes");
const { useLogger } = require("./middlewares/logger.middleware");
const helmet = require("helmet");
const swaggerJSDoc = require("swagger-jsdoc");
const { serve, setup } = require("swagger-ui-express");
const methodOverride = require("method-override");

const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

app.use(methodOverride("_method"));

app.use(helmet());
app.use(sessionMiddleware);
initializeStrategy();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(useLogger);

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce Coderhouse",
      description:
        "API pensada para realizar todas las tareas requeridas por un ecommerce",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", serve, setup(specs));

// ENDPOINTS
app.use("/api/products", productsRouter);
app.use("/products", productsViewsRouter);
app.use("/api/cart", cartRouter);
app.use("/cart", cartViewsRouter);
app.use("/createProduct", createProductRouter);
app.use("/api/users", sessionRouter);
app.use("/users", sessionViewsRouter);
app.use("/mockingproducts", mockingProductRouter);
app.use("/loggertest", loggerTestRouter);

module.exports = app;

if (require.main === module) {
  const main = async () => {
    await mongoose.connect(mongoUrl, { dbName });

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `\nServidor cargado! \nhttp://localhost:${PORT}/users\n\nDocumentación ↓\nhttp://localhost:${PORT}/apidocs`
      );
    });
  };

  main();
}
