import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async deleteFile(file: string): Promise<void> {
    const index = this.storage.findIndex(storageFile => storageFile === file);
    if (index >= 0) {
      this.storage.splice(index, 1);
    }
  }

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }
}
