import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login(email, password);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
};
