import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Joan Doe',
      email: 'joandoe@example.com'
    });

    expect(updatedUser.name).toBe('Joan Doe');
    expect(updatedUser.email).toBe('joandoe@example.com');
  });

  it('should not be able to update the profile for a non existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: uuid(),
        name: 'Joan Doe',
        email: 'joandoe@example.com'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the profile even if the email keeps the same', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Joan Doe',
      email: 'johndoe@example.com'
    });

    expect(updatedUser.name).toBe('Joan Doe');
  });

  it('should not be able to update to an email taken by another user', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const user = await fakeUsersRepository.create({
      name: 'Joan Doe',
      email: 'joandoe@example.com',
      password: '123456'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Joan Doe',
        email: 'johndoe@example.com'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Joan Doe',
      email: 'joandoe@example.com',
      password: '654321',
      old_password: '123456'
    });

    expect(updatedUser.password).toBe('654321');
  });

  it('should not be able to update the password if old password was not informed', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Joan Doe',
        email: 'joandoe@example.com',
        password: '654321'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password if old password does not match', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Joan Doe',
        email: 'joandoe@example.com',
        password: '654321',
        old_password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
