import { getRepository } from 'typeorm';
import deleteImage from '../../utils/deleteImage';
import Post from '../models/Post';
import User from '../models/User';
import AvatarController from './AvatarController';

interface IPostRequest {
  post_image: string;
  user_id: string;
  title: string;
  body: string;
}

interface IPostResponse {
  id: string;
  post_image: string;
  title: string;
  body: string;
  created_at: Date;
  updated_at: Date;
}

class PostController {
  /**
   * Método para listar todos os posts.
   * @author gilmar
   * @returns retorna um array de posts.
   */
  async index(): Promise<IPostRequest[]> {
    const postRepository = getRepository(Post);
    const posts = await postRepository.find();

    return posts;
  }

  /**
   * Método para listar um post a partir do id.
   * @param id é o id do post para identificar no banco de dados.
   * @author gilmar
   * @returns retorna um objeto contendo o post.
   */
  async show(id: string): Promise<IPostRequest> {
    const postRepository = getRepository(Post);
    const post = await postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new Error('Nenhum post com este id foi encontrado');
    }

    return post;
  }

  /**
   * Método para cadastrar um novo post
   * @param post_image nome da imagem a ser salva.
   * @param user_id id do usuário para identificar o autor do post.
   * @param title é o título de post
   * @param body é o corpo do post
   * @author gilmar
   * @returns retorna o post recém-criado.
   */
  async store({
    post_image,
    user_id,
    title,
    body,
  }: IPostRequest): Promise<IPostResponse> {
    const postRepository = getRepository(Post);
    const userRepository = getRepository(User);

    const checkIfUserIdExist = await userRepository.findOne({
      where: { id: user_id },
    });

    if (!checkIfUserIdExist) {
      await deleteImage(post_image);
      throw new Error('Nenhum usuário com este id foi encontrado');
    }

    const post = postRepository.create({
      post_image,
      user_id,
      title,
      body,
    });

    await postRepository.save(post);

    return post;
  }

  /**
   * Método para deletar o post a partir do id.
   * @param id é o identificador do post a ser deletado.
   * @author gilmar
   * @returns retorna true se foi corretamente deletado e caso contrário retorna false.
   */
  async deleteByID(id: string): Promise<boolean> {
    const postRepository = getRepository(Post);
    const checkIfPostExist: Post | undefined = await postRepository.findOne({
      where: { id },
    });

    if (!checkIfPostExist) {
      throw new Error('Nenhum post com este id foi encontrado');
    }

    let isDeleted = false;

    const postFilename = checkIfPostExist.post_image;

    const deleted = await postRepository.delete(id);

    if (
      deleted.affected !== null &&
      deleted.affected !== undefined &&
      deleted.affected > 0
    ) {
      isDeleted = true;
      await AvatarController.delete(postFilename);
    }

    return isDeleted;
  }
}

export default PostController;
