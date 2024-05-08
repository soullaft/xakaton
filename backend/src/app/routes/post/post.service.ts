import prisma from '../../../prisma/prisma-client';
import HttpException from '../../models/http-exception.model';

import { Post } from './post.model';
import { CreatePostInput } from './create-post.model';

export const createPost = async (input: CreatePostInput): Promise<Post> => {
  const { title, description, userId } = input;

  if (!title) {
    throw new HttpException(422, { errors: { subject: ["can't be blank"] } });
  }

  if (!description) {
    throw new HttpException(422, { errors: { body: ["can't be blank"] } });
  }

  if (userId === null || userId <= 0) {
    throw new HttpException(422, { errors: { body: ['incorrect user id'] } });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new HttpException(404, { errors: { user: ['User not found'] } });
  }

  const post = await prisma.post.create({
    data: {
      title,
      description,
      userId,
    },
  });

  return post;
};

export const getPost = async (input: number): Promise<Post | string> => {
  const id = input;

  if (id === null || id <= 0) {
    throw new HttpException(422, { errors: { body: ['incorrect post id'] } });
  }

  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  });

  return post ?? 'Пост не найден';
};
