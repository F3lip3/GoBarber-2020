import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list all providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Joan Doe',
      email: 'joandoe@example.com',
      password: '654321'
    });

    const user = await fakeUsersRepository.create({
      name: 'Logger User',
      email: 'user@example.com',
      password: 'test123'
    });

    const providers = await listProviders.execute({
      user_id: user.id
    });

    expect(providers).toEqual([user1, user2]);
  });
});
