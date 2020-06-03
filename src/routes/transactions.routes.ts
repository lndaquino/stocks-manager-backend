import { Router } from 'express';
import { parseISO } from 'date-fns';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import GetStatementService from '../services/GetStatementService';
import GetUserDashboard from '../services/GetUserDashboardService';
import GetUserClosedTrades from '../services/GetUserClosedTradesService';
import GetStatementClosedTradesService from '../services/GetStatementClosedTradesService';
import GetUserStatementService from '../services/GetUserStatementService';
import DeleteClosedTradesService from '../services/DeleteClosedTradesService';

const transactionsRouter = Router();

transactionsRouter.use(ensureAuthenticated);

transactionsRouter.get('/active', async (request, response) => {
  const user_id = request.user.id;

  const userBalance = new GetUserDashboard();

  const balance = await userBalance.run({ user_id });

  return response.json(balance);
});

transactionsRouter.get('/closed', async (request, response) => {
  const user_id = request.user.id;

  const userClosedTrades = new GetUserClosedTrades();

  const closedTrades = await userClosedTrades.run({ user_id });

  return response.json(closedTrades);
});

transactionsRouter.get(
  '/statement/active/:asset_id',
  async (request, response) => {
    const { asset_id } = request.params;
    const user_id = request.user.id;

    const statementActiveTrades = new GetStatementService();

    const statement = await statementActiveTrades.run({ user_id, asset_id });

    return response.json(statement);
  },
);

transactionsRouter.get(
  '/statement/closed/:closed_id',
  async (request, response) => {
    const { closed_id } = request.params;
    const user_id = request.user.id;

    const statementClosedTrades = new GetStatementClosedTradesService();

    const statement = await statementClosedTrades.run({ user_id, closed_id });

    return response.json(statement);
  },
);

transactionsRouter.get('/statement/user', async (request, response) => {
  const user_id = request.user.id;

  const getUserStatement = new GetUserStatementService();

  const userStatement = await getUserStatement.run({ user_id });

  return response.json(userStatement);
});

transactionsRouter.post('/add', async (request, response) => {
  const user_id = request.user.id;
  const { asset_id, quantity, value, cost, type, date } = request.body;
  // const parsedDate = parseISO(date);
  console.log({ user_id, asset_id, quantity, value, cost, type, date });
  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.run({
    user_id,
    asset_id,
    quantity,
    value,
    cost,
    type,
    date,
    // date: parsedDate,
  });

  return response.json(transaction);
});

transactionsRouter.delete(
  '/delete/:transaction_id',
  async (request, response) => {
    const { transaction_id } = request.params;
    const user_id = request.user.id;

    const deleteTransaction = new DeleteTransactionService();

    await deleteTransaction.run({ user_id, transaction_id });

    return response.status(204).send();
  },
);

transactionsRouter.delete(
  '/delete/closed/:closed_id',
  async (request, response) => {
    const { closed_id } = request.params;
    const user_id = request.user.id;

    const deleteClosedTrades = new DeleteClosedTradesService();

    await deleteClosedTrades.run({ user_id, closed_id });

    return response.status(204).send();
  },
);

export default transactionsRouter;
