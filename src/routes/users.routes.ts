import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload.config';
import AuthMiddleware from '@middlewares/auth.middleware';
import CreateUserService from '@services/users/create.service';
import UpdateUserAvatarService from '@services/users/update.avatar.service';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();
    const user = await createUser.execute({
      name,
      email,
      password
    });

    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({
      error: err.message
    });
  }
});

usersRouter.patch(
  '/avatar',
  AuthMiddleware,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename
    });

    delete user.password;

    return response.json(user);
  }
);

export default usersRouter;
