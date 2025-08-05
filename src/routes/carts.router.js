import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager('./src/data/carts.json');

router.post('/', async (req, res) => {
  try {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:cid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const cart = await manager.getCartById(cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const updatedCart = await manager.addProductToCart(cid, pid);
  if (!updatedCart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
  res.json(updatedCart);
});

export default router;
