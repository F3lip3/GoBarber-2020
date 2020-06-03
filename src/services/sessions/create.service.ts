import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import authConfig from '@config/auth.config';
import AppError from '@errors/app.error';
import User from '@models/user.model';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password!');
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new AppError('Invalid email or password!');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    });

    return { user, token };
  }
}

export default CreateSessionService;
