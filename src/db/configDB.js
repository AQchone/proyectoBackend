import mongoose from "mongoose";

const URI = "mongodb+srv://cuccioneaugusto:CCgF0kNEE4kJdoZB@cluster0.2mgz4k6.mongodb.net/ProyectoBackend?retryWrites=true&w=majority"
mongoose
.connect(URI)
.then(()=>console.log("conectado a la db"))
.catch((error)=>console.log(error));