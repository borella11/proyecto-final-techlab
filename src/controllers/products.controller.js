import { ProductsService } from "../services/products.service.js";

export const ProductsController = {
  async getAll(req, res, next) {
    try {
      const products = await ProductsService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductsService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const newProduct = await ProductsService.createProduct(req.body);
      res.status(201).json({
        mensaje: "Producto creado con éxito",
        producto: newProduct
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await ProductsService.updateProduct(id, req.body);
      res.status(200).json({
        mensaje: "Producto actualizado con éxito",
        producto: updated
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await ProductsService.deleteProduct(id);
      res.status(200).json({
        mensaje: `Producto con ID ${id} eliminado con éxito`
      });
    } catch (error) {
      next(error);
    }
  }
};
