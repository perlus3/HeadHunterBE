import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { configuration } from './config/config';

const {
  userNameSMTP,
  userPasswordSMTP,
  hostSMTP,
  portSMTP,
  emailSendFromSMTP,
} = configuration;

export = {
  transport: `smtp://${userNameSMTP}:${userPasswordSMTP}@${hostSMTP}:${portSMTP}`,
  defaults: {
    from: `${emailSendFromSMTP}`,
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
