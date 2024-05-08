import { RegisteredUser } from '../auth/registered-user.model';

export interface Post {
    id: number;
    title: string;
    description: string;
    userId: number;
  }
  