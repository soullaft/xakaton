import { NextFunction, Request, Response, Router } from 'express';
import { createPost, getPost, removePostIfAuthor } from './post.service';
import auth from '../auth/auth';

const router = Router();

//register
router.post(
  '/post/create',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const post = await createPost({ ...req.body });
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/post/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const post = await getPost(Number.parseInt(req.params.id));
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/post/remove-if-author',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = parseInt(req.params.postId);
      const userId = parseInt(req.user.id); 

      await removePostIfAuthor(postId, userId);

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
