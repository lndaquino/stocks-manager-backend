import { Router } from 'express';

import ForgotPasswordService from '../services/ForgotPasswordService';
import ResetPasswordService from '../services/ResetPasswordService';

const passwordRouter = Router();

passwordRouter.post('/forgot', async (request, response) => {
  const { email } = request.body;

  const forgotPasswordService = new ForgotPasswordService();

  await forgotPasswordService.run({ email });

  return response.status(204).json();
});

passwordRouter.post('/reset', async (request, response) => {
  const { password, token } = request.body;

  const resetPassword = new ResetPasswordService();

  await resetPassword.run({ password, token });

  return response.status(204).json();
});

export default passwordRouter;
