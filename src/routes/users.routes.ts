import { Router } from 'express';

import UserController from '../app/controllers/UserController';

const usersRouter = Router();
const userController = new UserController();

usersRouter.get('/', async (request, response) => {
  try {
    const users = await userController.index();
    console.log('foi chamado');

    return response.status(200).json(users);
  } catch (e) {
    return response.status(400).json({ error: e.message });
  }
});

usersRouter.post('/', async (request, response) => {
  try {
    const { username, password } = request.body;
    const user = await userController.store({
      username,
      password,
    });

    return response.json({ ...user });
  } catch (e) {
    return response.status(400).json({ error: e.message });
  }
});

export default usersRouter;
