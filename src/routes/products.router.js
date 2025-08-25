import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = await manager.getProductById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});


router.post('/', async (req, res) => {
  try {
    const newProduct = await manager.addProduct(req.body);

    
    req.app.get('io').emit('updateProducts', await manager.getProducts());

    res.status(201).json(newProduct);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  const updatedProduct = await manager.updateProduct(pid, req.body);
  if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(updatedProduct);
});


router.delete('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid);
  const deleted = await manager.deleteProduct(pid);
  if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });


  req.app.get('io').emit('updateProducts', await manager.getProducts());

  res.json({ message: 'Producto eliminado' });
});

export default router;
