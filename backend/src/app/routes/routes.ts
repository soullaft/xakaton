import { Router } from 'express';
import testController from './test/test.controller';
import authController from './auth/auth.controller';

const api = Router().use(
  testController,
  authController,
);
export default Router().use('/api', api);
