import { getRepository } from 'typeorm';

import { hash } from 'bcrypt';

import User from '../models/User';
import AvatarController from './AvatarController';

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

interface IRequestUpdate {
  id: string;
  username: string;
  password: string;
  avatar: string;
}

class UserController {
  /**
   * Método para criar um novo usuário.
   * @param username é o username do usuário.
   * @param password é a senha do usuário
   * @author gilmar
   * @returns retorna o usuário recém-criado.
   */
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

  /**
   * Método para listar todos os usuários.
   * @author gilmar
   * @returns retorna um array de usuários.
   */
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

  /**
   * Método para listar um usuário.
   * @param id para identificar o usuário a ser listado.
   * @author gilmar
   * @returns retorna um objeto contendo o usuário
   */
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

  /**
   * Método para deleta em usuário a partir do id.
   * @param id é o identificador do usuário a ser deletado.
   * @author gilmar
   * @returns retorna true se foi corretamente deletado e caso contrário retorna false.
   */
  async deleteByID(id: string): Promise<boolean> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('Nenhum usuário com este id foi encontrado');
    }

    let isDeleted = false;
    const avatarFilename = user.avatar;

    const deleted = await userRepository.delete(id);

    if (
      deleted.affected !== null &&
      deleted.affected !== undefined &&
      deleted.affected > 0
    ) {
      isDeleted = true;
      await AvatarController.delete(avatarFilename);
    }

    return isDeleted;
  }

  /**
   * Método para atualizar um usuário a partir do id.
   * @param id é o identificador do usuário a ser atualizado.
   * @param username é o username do usuário a ser atualizado.
   * @param password é a senha do usuário a ser atualizado.
   * @param avatar é o nome da imagem do usuário a ser atualizado.
   * @author gilmar
   * @returns retorna o usuário atualizado
   */
  async update({
    id,
    username,
    password,
    avatar,
  }: IRequestUpdate): Promise<IUserResponse> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('Nenhum usuário com este id foi encontrado');
    }

    user.username = username;
    user.password = password;
    user.avatar = avatar;

    await userRepository.save(user);

    return user;
  }
}

export default UserController;
