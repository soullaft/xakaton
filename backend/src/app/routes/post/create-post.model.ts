import { RegisteredUser } from '../auth/registered-user.model';

export interface CreatePostInput {
    title: string;
    description: string;
    userId: number;
}
