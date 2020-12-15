import { getRepository } from 'typeorm';

import { hash } from 'bcrypt';

import User from '../models/User';

interface IUserRequest {
  username: string;
  password: string;
}

interface IUserResponse {
  id: string;
  username: string;
  password: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
}

class UserController {
  async store({ username, password }: IUserRequest): Promise<IUserResponse> {
    const userRepository = getRepository(User);

    const checkIfUsernameExist = await userRepository.findOne({
      where: { username },
    });

    if (checkIfUsernameExist) {
      throw new Error('Este username já está cadastrado');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      username,
      password: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}

export default UserController;
