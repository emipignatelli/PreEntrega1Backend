import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';
import ProductManager from './src/managers/ProductManager.js';
import { Server } from 'socket.io';

const app = express();
const PORT = 8080;
const productManager = new ProductManager('./src/data/products.json');


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', resolve(__dirname, './src/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", async (_req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    res.status(500).send(`Error al renderizar la vista: ${error.message}`);
  }
});


app.get("/realTimeProducts", async (_req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    res.status(500).send(`Error al renderizar la vista: ${error.message}`);
  }
});


const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
const io = new Server(httpServer);
app.set('io', io);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  
  socket.on('newProduct', async (productData) => {
    try {
      await productManager.addProduct(productData);
      const products = await productManager.getProducts();
      io.emit('updateProducts', products);
    } catch (error) {
      console.error('Error al agregar producto:', error.message);
    }
  });

  
  socket.on('deleteProduct', async (productId) => {
    try {
      await productManager.deleteProduct(parseInt(productId));
      const products = await productManager.getProducts();
      io.emit('updateProducts', products);
    } catch (error) {
      console.error('Error al eliminar producto:', error.message);
    }
  });
});

// Routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
