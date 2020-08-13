import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUser from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUser(
      fakeUsersRepository,
      fakeHashProvider
    );

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const userData = {
      email: 'johndoe@example.com',
      password: '123456'
    };

    const user = await createUser.execute({ name: 'John Doe', ...userData });

    const response = await authenticateUser.execute(userData);

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUser(
      fakeUsersRepository,
      fakeHashProvider
    );

    const userData = {
      email: 'johndoe@example.com',
      password: '123456'
    };

    expect(authenticateUser.execute(userData)).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with invalid password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUser(
      fakeUsersRepository,
      fakeHashProvider
    );

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: '654321'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
