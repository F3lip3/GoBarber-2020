import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    );
  });

  it('should be able to update user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'johndoe.png'
    });

    expect(updatedUser.avatar).toBe('johndoe.png');
  });

  it('should not be able to update non existing user avatar', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFileName: 'johndoe.png'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete existing avatar image before inserting new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'johndoe.png'
    });

    const updatedUser = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'johndoe_new.png'
    });

    expect(deleteFile).toHaveBeenCalledWith('johndoe.png');
    expect(updatedUser.avatar).toBe('johndoe_new.png');
  });
});
