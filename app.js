import express from 'express';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';

const app = express();
const PORT = 8080;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send('Servidor funcionando');
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
