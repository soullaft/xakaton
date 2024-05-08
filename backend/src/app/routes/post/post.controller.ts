import { NextFunction, Request, Response, Router } from 'express';
import { createPost } from './post.service';

const router = Router();

//register
router.post(
  '/post/create',
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

export default router;
