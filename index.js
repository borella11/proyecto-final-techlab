import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import productsRoutes from "./src/routes/products.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// Middlewares Globales
// ==========================================

// 1. CORS para permitir peticiones cruzadas desde cualquier frontend
app.use(cors());

// 2. Body-parser para interpretar cuerpos en formato JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==========================================
// Registro de Rutas
// ==========================================

// Ruta base de bienvenida y chequeo de salud
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Bienvenido a la API REST de Gestión de Productos - Techlab",
    endpoints: {
      auth: "/auth/login",
      products: "/api/products"
    }
  });
});

// Rutas de autenticación
app.use("/auth", authRoutes);

// Rutas de productos
app.use("/api/products", productsRoutes);

// ==========================================
// Manejo de Rutas Desconocidas (404)
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    statusCode: 404,
    message: `Ruta no encontrada: [${req.method}] ${req.originalUrl}`
  });
});

// ==========================================
// Middleware Centralizado de Manejo de Errores (400, 500)
// ==========================================
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor o falla en el servicio de datos";

  console.error(`[Error] ${statusCode} - ${message}`);
  if (statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📡 Endpoints disponibles:`);
  console.log(`   - POST   /auth/login`);
  console.log(`   - GET    /api/products`);
  console.log(`   - GET    /api/products/:id`);
  console.log(`   - POST   /api/products/create (Protegido JWT)`);
  console.log(`   - PUT    /api/products/:id     (Protegido JWT)`);
  console.log(`   - DELETE /api/products/:id     (Protegido JWT)`);
  console.log(`===============================================`);
});

export default app;
