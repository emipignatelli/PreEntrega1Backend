import fs from 'fs/promises';
import path from 'path';

export default class CartManager {
  constructor(filePath) {
    this.path = path.resolve(filePath);
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newCart = {
      id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
      products: []
    };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(c => c.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._readFile();
    const cart = carts.find(c => c.id === cartId);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product === productId);
    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[productIndex].quantity++;
    }

    await this._writeFile(carts);
    return cart;
  }
}
