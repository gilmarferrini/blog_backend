import { Router } from 'express';
import multer from 'multer';
import PostController from '../app/controllers/PostController';

import uploadConfig from '../config/upload';

const postsRouter = Router();
const postController = new PostController();
const upload = multer(uploadConfig);

postsRouter.get('/', async (request, response) => {
  try {
    const posts = await postController.index();

    return response.status(200).json(posts);
  } catch (e) {
    return response.status(400).json({ error: e.message });
  }
});

postsRouter.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const post = await postController.show(id);

    return response.status(200).json(post);
  } catch (e) {
    return response.status(400).json({ error: e.message });
  }
});

postsRouter.post(
  '/',
  upload.single('post_image'),
  async (request, response) => {
    try {
      const { user_id, title, body } = request.body;
      const post = await postController.store({
        post_image: request.file.filename,
        user_id,
        title,
        body,
      });

      return response.status(200).json({ ...post });
    } catch (e) {
      return response.status(400).json({ error: e.message });
    }
  }
);

export default postsRouter;
