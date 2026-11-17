import { Router } from "express";
import { ProductsController } from "../controllers/products.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas de consulta
router.get("/", ProductsController.getAll);
router.get("/:id", ProductsController.getById);

// Rutas protegidas con autenticación JWT (Bearer Token)
router.post("/create", authenticateToken, ProductsController.create);
router.put("/:id", authenticateToken, ProductsController.update);
router.delete("/:id", authenticateToken, ProductsController.delete);

export default router;
