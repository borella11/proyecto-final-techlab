import { ProductsModel } from "../models/products.model.js";

export const ProductsService = {
  async getAllProducts() {
    return await ProductsModel.getAll();
  },

  async getProductById(id) {
    if (!id || typeof id !== "string") {
      const error = new Error("El ID del producto es obligatorio");
      error.statusCode = 400;
      throw error;
    }

    const product = await ProductsModel.getById(id);
    if (!product) {
      const error = new Error(`Producto con ID ${id} no encontrado`);
      error.statusCode = 404;
      throw error;
    }

    return product;
  },

  async createProduct(data) {
    const { name, price } = data;

    if (!name || price === undefined || price === null) {
      const error = new Error("El nombre ('name') y el precio ('price') son obligatorios");
      error.statusCode = 400;
      throw error;
    }

    if (typeof price !== "number" || price < 0) {
      const error = new Error("El precio ('price') debe ser un número positivo");
      error.statusCode = 400;
      throw error;
    }

    return await ProductsModel.create(data);
  },

  async updateProduct(id, data) {
    if (!id) {
      const error = new Error("El ID del producto es obligatorio");
      error.statusCode = 400;
      throw error;
    }

    if (!data || Object.keys(data).length === 0) {
      const error = new Error("Debes enviar al menos un campo para actualizar");
      error.statusCode = 400;
      throw error;
    }

    if (data.price !== undefined && (typeof data.price !== "number" || data.price < 0)) {
      const error = new Error("El precio ('price') debe ser un número positivo");
      error.statusCode = 400;
      throw error;
    }

    const updated = await ProductsModel.update(id, data);
    if (!updated) {
      const error = new Error(`Producto con ID ${id} no encontrado`);
      error.statusCode = 404;
      throw error;
    }

    return updated;
  },

  async deleteProduct(id) {
    if (!id) {
      const error = new Error("El ID del producto es obligatorio");
      error.statusCode = 400;
      throw error;
    }

    const result = await ProductsModel.delete(id);
    if (!result) {
      const error = new Error(`Producto con ID ${id} no encontrado`);
      error.statusCode = 404;
      throw error;
    }

    return result;
  }
};
