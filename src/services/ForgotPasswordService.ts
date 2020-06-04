import path from 'path';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import fs from 'fs';
import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import User from '../models/Users';
import UserTokenRepository from '../repositories/UserTokenRepository';

interface Request {
  email: string;
}

interface TemplateVariables {
  [key: string]: string | number;
}

interface ParseMailTemplateDTO {
  file: string;
  variables: TemplateVariables;
}

interface MailContact {
  name: string;
  email: string;
}
interface SendMailDTO {
  to: MailContact;
  from?: MailContact;
  subject: string;
  templateData: ParseMailTemplateDTO;
  provider: 'ethereal' | 'ses';
}

class SendForgotEmailPasswordService {
  private client: Transporter;

  private async parseEmail({
    file,
    variables,
  }: ParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }

  private async sendMail({
    to,
    subject,
    from,
    templateData,
    provider,
  }: SendMailDTO): Promise<void> {
    if (provider === 'ethereal') {
      const account = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      console.log('nodemailer');

      const message = await transporter.sendMail({
        from: {
          name: from?.name || 'Equipe StocksLife',
          address: from?.email || 'equipe@stockslife.com',
        },
        to: {
          name: to.name,
          address: to.email,
        },
        subject: 'Recuperação de senha',
        html: await this.parseEmail(templateData),
      });

      console.log('Message sent: %s', message.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    } else {
      const transporter = nodemailer.createTransport({
        SES: new aws.SES({
          apiVersion: '2010-12-01',
          region: process.env.AWS_SES_REGION,
        }),
      });

      const message = await transporter.sendMail({
        from: {
          name: from?.name || 'Equipe StocksLife',
          address: from?.email || 'lucas@stockslife.biz',
        },
        to: {
          name: to.name,
          address: to.email,
        },
        subject: 'Recuperação de senha',
        html: await this.parseEmail(templateData),
      });
      console.log(message);
    }
  }

  public async run({ email }: Request): Promise<void> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      email,
    });

    if (!user) {
      throw new AppError('User doesn´t exist.');
    }

    const userTokenRepository = getCustomRepository(UserTokenRepository);

    const { token } = await userTokenRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.sendMail({
      provider: 'ethereal', // ethereal or ses
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[StocksLife] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_password/${token}`,
        },
      },
    });
  }
}

export default SendForgotEmailPasswordService;
