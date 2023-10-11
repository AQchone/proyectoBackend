import { Router } from "express";
import products from '../public/js/data';


const router = Router();

const io = require('socket.io')(server); 
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts'); 


  io.on('connection', (socket) => {
    console.log('Nueva conexión de websocket');


    socket.on('newProduct', (product) => {

      products.push(product);

      io.emit('updateProducts', products);
    });


    socket.on('deleteProduct', (productId) => {

      products = products.filter((product) => product.id !== productId);


      io.emit('updateProducts', products);
    });
  });
});

export default router;
