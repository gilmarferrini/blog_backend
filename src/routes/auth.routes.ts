import { Router } from 'express';
import AuthController from '../app/controllers/AuthController';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/', async (request, response) => {
  const { username, password } = request.body;
  const { user, token } = await authController.auth({
    username,
    password,
  });

  const newUser = {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    created_at: user.created_at,
  };

  return response.json({ user: newUser, token });
});

export default authRouter;
