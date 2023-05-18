import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config } from './config/config';

export = {
  transport: `smtp://${config.USER_NAME_SMTP}:${config.USER_PASSWORD_SMTP}@${config.HOST_SMTP}:${config.PORT_SMTP}`,
  defaults: {
    from: `${config.EMAIL_SEND_FROM_SMTP}`,
  },

  /** Even if we are not going to use any templates, we need to pick one of them */
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
