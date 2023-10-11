import express from "express";
import { engine } from "express-handlebars";
import router from "./routes/views.router";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", router);

const PORT = 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});


const socketServer = new Server(httpServer);



const names = [];

const messages = [];

socketServer.on("connection", (socket) => {
  socket.on("newUser", (user) => {
    socket.broadcast.emit("newUserBroadcast", user);
  });

  socket.on("message", (info) => {
    messages.push(info);
    socketServer.emit("chat", messages);
  });
});
