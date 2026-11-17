import { ProductsService } from "../services/products.service.js";

export const ProductsController = {
  /**
   * GET /api/products
   * Devuelve todos los productos
   */
  async getAll(req, res, next) {
    try {
      const products = await ProductsService.getAllProducts();
      return res.status(200).json({
        status: "success",
        statusCode: 200,
        total: products.length,
        data: products
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/products/:id
   * Devuelve el producto con el ID indicado
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductsService.getProductById(id);
      return res.status(200).json({
        status: "success",
        statusCode: 200,
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/products/create
   * Crea un nuevo producto
   */
  async create(req, res, next) {
    try {
      const newProduct = await ProductsService.createProduct(req.body);
      return res.status(201).json({
        status: "success",
        statusCode: 201,
        message: "Producto creado exitosamente",
        data: newProduct
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/products/:id
   * Actualiza el producto con el ID indicado
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductsService.updateProduct(id, req.body);
      return res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Producto actualizado exitosamente",
        data: updatedProduct
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/products/:id
   * Elimina el producto con el ID indicado
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await ProductsService.deleteProduct(id);
      return res.status(200).json({
        status: "success",
        statusCode: 200,
        message: `Producto con ID ${id} eliminado correctamente`
      });
    } catch (error) {
      next(error);
    }
  }
};
