import { Router } from 'express';

import usersRouter from './users.routes';
import transactionsRouter from './transactions.routes';
import sessionsRouter from './sessions.routes';
import assetsRouter from './assets.routes';
import passwordRouter from './password.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/transactions', transactionsRouter);
routes.use('/login', sessionsRouter);
routes.use('/assets', assetsRouter);
routes.use('/password', passwordRouter);

export default routes;
