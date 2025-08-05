import fs from 'fs/promises';
import path from 'path';

export default class ProductManager {
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

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this._readFile();

    const newProduct = {
      id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
      title: product.title,
      description: product.description,
      code: product.code,
      price: Number(product.price),
      status: product.status ?? true,
      stock: Number(product.stock),
      category: product.category,
      thumbnails: Array.isArray(product.thumbnails) ? product.thumbnails : [],
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updatedFields) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    
    const existingProduct = products[index];
    const updatedProduct = {
      ...existingProduct,
      ...updatedFields,
      id: existingProduct.id, 
      price: updatedFields.price !== undefined ? Number(updatedFields.price) : existingProduct.price,
      stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : existingProduct.stock,
      thumbnails: Array.isArray(updatedFields.thumbnails)
        ? updatedFields.thumbnails
        : existingProduct.thumbnails,
    };

    products[index] = updatedProduct;
    await this._writeFile(products);
    return updatedProduct;
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return false;

    await this._writeFile(filtered);
    return true;
  }
}
