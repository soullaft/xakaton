import { Router } from 'express';
import testController from './test/test.controller';
import authController from './auth/auth.controller';
import postcontroller from './post/post.controller';

const api = Router().use(testController, authController, postcontroller);
export default Router().use('/api', api);
