import * as bcrypt from 'bcryptjs';
import prisma from '../../../prisma/prisma-client';
import HttpException from '../../models/http-exception.model';
import generateToken from './token.utils';
import { User } from './user.model';
import { RegisterInput } from './register-input.model';
import { RegisteredUser } from './registered-user.model';

const checkUserUniqueness = async (username: string) => {
  const existingUserByUsername = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (existingUserByUsername) {
    throw new HttpException(422, {
      errors: {
        ...(existingUserByUsername
          ? { username: ['has already been taken'] }
          : {}),
      },
    });
  }
};

export const login = async (userPayload: any) => {
  const username = userPayload.username?.trim();
  const password = userPayload.password?.trim();

  if (!username) {
    throw new HttpException(422, { errors: { username: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      password: true,
    },
  });

  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return {
        username: user.username,
        token: generateToken(user.id),
      };
    }
  }

  throw new HttpException(403, {
    errors: {
      'email or password': ['is invalid'],
    },
  });
};

export const getCurrentUser = async (id: number) => {
  const user = (await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
    },
  })) as User;

  return {
    ...user,
    token: generateToken(user.id),
  };
};

export const createUser = async (
  input: RegisterInput
): Promise<RegisteredUser> => {
  const username = input.username?.trim();
  const password = input.password?.trim();
  const role = 1;

  if (!username) {
    throw new HttpException(422, { errors: { username: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  await checkUserUniqueness(username);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      roleId: 1,
    },
    select: {
      id: true,
      username: true,
    },
  });

  return {
    ...user,
    token: generateToken(user.id),
  };
};
