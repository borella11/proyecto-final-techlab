import { ProductsModel } from "../models/products.model.js";

export const ProductsService = {
  /**
   * Obtiene la lista completa de productos
   */
  async getAllProducts() {
    return await ProductsModel.getAll();
  },

  /**
   * Obtiene un producto por ID con validación
   * @param {string} id
   */
  async getProductById(id) {
    if (!id || typeof id !== "string") {
      const error = new Error("El ID del producto es obligatorio y debe ser válido");
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

  /**
   * Valida y crea un nuevo producto
   * @param {Object} productData
   */
  async createProduct(productData) {
    const { name, price } = productData;

    if (!name || price === undefined || price === null) {
      const error = new Error("Los campos 'name' y 'price' son obligatorios para crear el producto");
      error.statusCode = 400;
      throw error;
    }

    if (typeof price !== "number" || price < 0) {
      const error = new Error("El precio ('price') debe ser un número positivo");
      error.statusCode = 400;
      throw error;
    }

    return await ProductsModel.create(productData);
  },

  /**
   * Valida y actualiza un producto existente
   * @param {string} id
   * @param {Object} updateData
   */
  async updateProduct(id, updateData) {
    if (!id) {
      const error = new Error("El ID del producto es obligatorio");
      error.statusCode = 400;
      throw error;
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      const error = new Error("Debe proporcionar al menos un campo para actualizar");
      error.statusCode = 400;
      throw error;
    }

    if (updateData.price !== undefined && (typeof updateData.price !== "number" || updateData.price < 0)) {
      const error = new Error("El precio ('price') debe ser un número positivo");
      error.statusCode = 400;
      throw error;
    }

    const updated = await ProductsModel.update(id, updateData);
    if (!updated) {
      const error = new Error(`Producto con ID ${id} no encontrado para actualizar`);
      error.statusCode = 404;
      throw error;
    }

    return updated;
  },

  /**
   * Elimina un producto por ID
   * @param {string} id
   */
  async deleteProduct(id) {
    if (!id) {
      const error = new Error("El ID del producto es obligatorio");
      error.statusCode = 400;
      throw error;
    }

    const result = await ProductsModel.delete(id);
    if (!result) {
      const error = new Error(`Producto con ID ${id} no encontrado para eliminar`);
      error.statusCode = 404;
      throw error;
    }

    return result;
  }
};
