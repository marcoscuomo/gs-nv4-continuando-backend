import { Router } from 'express';
import multer from 'multer';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';
import UsersController from '../controllers/UsersController';
import UserAvatarService from '../controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarService();

usersRouter.post('/', usersController.create);

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    userAvatarController.update
);

export default usersRouter;
