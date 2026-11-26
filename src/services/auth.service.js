import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "techlab_secret_key_default";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@techlab.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1234";

export const AuthService = {
  async login(email, password) {
    if (!email || !password) {
      const error = new Error("El email y password son obligatorios");
      error.statusCode = 400;
      throw error;
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      const error = new Error("Credenciales inválidas");
      error.statusCode = 401;
      throw error;
    }

    const payload = {
      email,
      role: "admin"
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    return {
      token,
      tipo: "Bearer",
      usuario: email
    };
  }
};
