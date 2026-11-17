import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "techlab_secret_key_default";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@techlab.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

export const AuthService = {
  /**
   * Autentica credenciales y genera un Bearer token JWT
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    if (!email || !password) {
      const error = new Error("El correo ('email') y la contraseña ('password') son obligatorios");
      error.statusCode = 400;
      throw error;
    }

    // Validación de credenciales
    const isValidUser = email === ADMIN_EMAIL && password === ADMIN_PASSWORD;

    if (!isValidUser) {
      const error = new Error("Credenciales de autenticación inválidas");
      error.statusCode = 401;
      throw error;
    }

    // Generación del token
    const payload = {
      email,
      role: "admin"
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return {
      token,
      tokenType: "Bearer",
      expiresIn: JWT_EXPIRES_IN,
      user: {
        email,
        role: "admin"
      }
    };
  }
};
