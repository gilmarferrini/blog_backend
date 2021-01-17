import { compare } from 'bcrypt';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import authConfing from '../../config/authConfig';

interface IUser {
  username: string;
  password: string;
}

interface IAuthResponse {
  user: User;
  token: string;
}

class AuthController {
  public async auth({ username, password }: IUser): Promise<IAuthResponse> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new Error('Nenhum usuário com esse username foi encontrado');
    }

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new Error('Password incorreto');
    }

    const token = sign({}, authConfing.secret, {
      expiresIn: authConfing.expiresIn,
      subject: user.id,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthController;
