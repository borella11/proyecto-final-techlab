import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "techlab_secret_key_default";

/**
 * Middleware para validar el Bearer Token JWT en cabeceras de autorización
 * Devuelve 401 si falta el token y 403 si el token es inválido o expiró
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return res.status(401).json({
      status: "error",
      statusCode: 401,
      message: "Acceso no autorizado: Token no provisto en la cabecera Authorization"
    });
  }

  // Se espera el formato: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      status: "error",
      statusCode: 401,
      message: "Formato de token inválido. Debe ser: Bearer <token>"
    });
  }

  const token = parts[1];

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        statusCode: 403,
        message: "Acceso prohibido: Token inválido o expirado"
      });
    }

    // Guardar usuario decodificado en la request para uso posterior
    req.user = decodedUser;
    next();
  });
};
