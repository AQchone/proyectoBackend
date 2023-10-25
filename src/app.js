import express from "express"
import handlebars from "express-handlebars"
import { __dirname } from "./utils.js";
import productsRouter from "./routes/products.router.js"
import usersRouter from "./routes/users.router.js"
import viewsRouter from "./routes/views.router.js"

// DB
import "./db/configDB.js"
//

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// handlebars

app.engine("handlebars", handlebars.engine())
app.set("views",__dirname+"/views")
app.set("view engine", "handlebars");

// routes

app.use("/api/products",productsRouter)
app.use("/api/users",usersRouter)
app.use("/",viewsRouter)

app.listen(8080,()=>{
    console.log("escuchando puerto 8080");
})