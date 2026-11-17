import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  /**
   * POST /auth/login
   * Valida credenciales y devuelve el Bearer Token JWT
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      return res.status(200).json({
        status: "success",
        statusCode: 200,
        message: "Autenticación exitosa",
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
};
