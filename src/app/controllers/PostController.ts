import { getRepository } from 'typeorm';
import deleteImage from '../../utils/deleteImage';
import Post from '../models/Post';
import User from '../models/User';

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
  async index(): Promise<IPostRequest[]> {
    const postRepository = getRepository(Post);
    const posts = await postRepository.find();

    return posts;
  }

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
}

export default PostController;
