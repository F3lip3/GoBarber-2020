import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUser from './AuthenticateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const authenticateUser = new AuthenticateUser(fakeUsersRepository);
    const createUser = new CreateUserService(fakeUsersRepository);

    const userData = {
      email: 'johndoe@example.com',
      password: '123456'
    };

    await createUser.execute({ name: 'John Doe', ...userData });

    const response = await authenticateUser.execute(userData);

    expect(response).toHaveProperty('token');
  });
});
