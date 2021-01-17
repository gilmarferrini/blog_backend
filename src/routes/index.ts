import { Router } from 'express';

import usersRouter from './users.routes';
import postsRouter from './posts.routes';
import authRouter from './auth.routes';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/users', usersRouter);
routes.use('/post', postsRouter);

export default routes;
