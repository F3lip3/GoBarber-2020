import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUser from './AuthenticateUserService';

let authenticateUser: AuthenticateUser;
let fakeUsersRepository: FakeUsersRepository;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    const fakeHashProvider = new FakeHashProvider();

    fakeUsersRepository = new FakeUsersRepository();
    authenticateUser = new AuthenticateUser(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to authenticate', async () => {
    const userData = {
      email: 'johndoe@example.com',
      password: '123456'
    };

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      ...userData
    });

    const response = await authenticateUser.execute(userData);

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const userData = {
      email: 'johndoe@example.com',
      password: '123456'
    };

    await expect(authenticateUser.execute(userData)).rejects.toBeInstanceOf(
      AppError
    );
  });

  it('should not be able to authenticate with invalid password', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: '654321'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
