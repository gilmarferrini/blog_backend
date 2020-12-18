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

interface IUser {
  id: string;
  username: string;
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

  async index(): Promise<IUser[]> {
    const userRepository = getRepository(User);
    const users = await userRepository.find();

    const newUsers =
      users !== undefined
        ? users.map(user => {
            const newUser = {
              id: user.id,
              username: user.username,
              avatar: user.avatar,
              created_at: user.created_at,
              updated_at: user.updated_at,
            };

            return newUser;
          })
        : [];

    return newUsers;
  }

  async show(id: string): Promise<IUser> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('Nenhum usuário com este id foi encontrado');
    }

    const newUser = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return newUser;
  }

  async delete(id: string): Promise<boolean> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('Nenhum usuário com este id foi encontrado');
    }

    let isDeleted = false;
    const deleted = await userRepository.delete(id);

    if (deleted.affected !== null && deleted.affected !== undefined) {
      if (deleted.affected > 0) {
        isDeleted = true;
      }
    }

    return isDeleted;
  }
}

export default UserController;
