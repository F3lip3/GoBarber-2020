import { getRepository } from 'typeorm';
import User from '@models/user.model';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const usersExists = await usersRepository.findOne({
      where: { email }
    });

    if (usersExists) {
      throw new Error('Email address already in use');
    }

    const user = usersRepository.create({
      name,
      email,
      password
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;