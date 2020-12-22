import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';

import User from '../models/User';

const uploadFolder = path.resolve(__dirname, '..', '..', '..', 'uploads');

interface IRequestUpdate {
  id: string;
  avatar: string;
}

class AvatarController {
  public static async delete(filename: string): Promise<void> {
    const avatarPath = path.join(__dirname, '..', '..', '..', 'tmp', filename);
    await fs.promises.unlink(avatarPath);
  }

  public static async update({ id, avatar }: IRequestUpdate): Promise<boolean> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });

    let status = false;

    if (!user) {
      throw new Error('Nenhum funcionário com esse id encontrado');
    }

    if (user.avatar) {
      const userAvatarPath = path.join(uploadFolder, user.avatar);
      const userAvatarStats = await fs.promises.stat(userAvatarPath);

      if (userAvatarStats) {
        await fs.promises.unlink(userAvatarPath);
      }
    }

    user.avatar = avatar;

    await userRepository.save(user);

    status = true;

    return status;
  }
}

export default AvatarController;
