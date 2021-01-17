import { Router } from 'express';
import multer from 'multer';

import AvatarController from '../app/controllers/AvatarController';
import UserController from '../app/controllers/UserController';

import uploadConfig from '../config/upload';

const usersRouter = Router();
const userController = new UserController();
const upload = multer(uploadConfig);

usersRouter.get('/', async (request, response) => {
  try {
    const users = await userController.index();

    return response.status(200).json(users);
  } catch (e) {
    return response.status(400).json({ error: e.message });
  }
});

usersRouter.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const user = await userController.show(id);

    return response.status(200).json(user);
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

    return response.status(201).json({ ...user });
  } catch (e) {
    return response.status(400).json({ error: e.message });
  }
});

usersRouter.patch(
  '/:id',
  upload.single('avatar'),
  async (request, response) => {
    try {
      const { id } = request.params;

      await AvatarController.update({
        id,
        avatar: request.file.filename,
      });

      return response
        .status(200)
        .json({ message: 'Avatar atualizado com sucesso' });
    } catch (e) {
      return response.status(400).json({ error: e.message });
    }
  }
);

usersRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const isDeleted = await userController.deleteByID(id);

    if (!isDeleted) {
      return response.status(500).json({ error: 'Erro ao deletar' });
    }

    return response.status(204).send();
  } catch (e) {
    return response.status(400).json({ error: e.message });
  }
});

export default usersRouter;
